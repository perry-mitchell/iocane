import crypto, { CipherGCM, Hmac } from "crypto";
import { PassThrough, Readable, Transform, Writable } from "stream";
import duplexer from "duplexer";
import streamEach from "stream-each";
import { generateIV, generateSalt } from "./encryption";
import { itemsToBuffer, prepareFooter, prepareHeader } from "./dataPacking";
import { getBinaryContentBorder, getBinarySignature } from "../shared/signature";
import {
    NODE_ENC_ALGORITHM_CBC,
    NODE_ENC_ALGORITHM_GCM,
    NODE_HMAC_ALGORITHM,
    SALT_LENGTH,
    SIZE_ENCODING_BYTES
} from "../symbols";
import {
    DerivedKeyInfo,
    EncryptedPayloadFooter,
    EncryptedPayloadHeader,
    EncryptionAlgorithm,
    IocaneAdapter
} from "../types";

interface PreparedEncryptionComponents {
    iv: Buffer;
    keyDerivationInfo: DerivedKeyInfo;
}

type StreamProcessorContinueFn = () => void;
type StreamProcessorPeekCB = () => void;

const CONTENT_FINAL_READ = 16384;
const CONTENT_READAHEAD = 2048;
const CONTENT_READ = CONTENT_READAHEAD - getBinaryContentBorder().length * 2;

class StreamProcessor {
    protected _buffer: Buffer = null;
    protected _continue: StreamProcessorContinueFn = null;
    protected _finished: boolean | Error = false;
    protected _peekCB: StreamProcessorPeekCB = null;
    protected _stream: Readable;
    protected _target: number = -1;

    get finished(): boolean {
        return this._finished === true;
    }

    constructor(stream: Readable) {
        this._stream = stream;
    }

    destroy() {}

    async peek(bytes: number): Promise<Buffer> {
        console.log("PEEK", bytes);
        if (this._finished instanceof Error) {
            throw this._finished;
        }
        return this._read(bytes, false);
    }

    async read(bytes: number): Promise<Buffer> {
        console.log("READ", bytes);
        if (this._finished instanceof Error) {
            throw this._finished;
        }
        return this._read(bytes, true);
    }

    _init() {
        if (this._target !== -1) return;
        this._target = 0;
        streamEach(
            this._stream,
            (data: Buffer, next: StreamProcessorContinueFn) => {
                this._buffer = this._buffer ? Buffer.concat([this._buffer, data]) : data;
                console.log("_INIT: data in", data.length, ", TOTAL:", this._buffer.length);
                console.log("-->", `"${data.toString("utf8")}"`);
                if (this._buffer.length >= this._target) {
                    this._continue = next;
                    if (this._peekCB) {
                        console.log("CALL: PEEK CB");
                        this._peekCB();
                    }
                    return;
                }
                this._continue = null;
                next();
            },
            (err?: Error) => {
                // Finish
                this._finished = err || true;
            }
        );
    }

    async _read(bytes: number, remove: boolean): Promise<Buffer> {
        this._init();
        if (this._peekCB) {
            throw new Error("A read operation is already in progress");
        }
        this._target = bytes;
        this._init();
        if (this._continue) {
            this._continue();
            this._continue = null;
        }
        if (this._buffer) {
            let bufferLen = this._target;
            if (this._finished && bufferLen > this._buffer.length) {
                bufferLen = this._buffer.length;
            }
            if (this._buffer.length >= this._target) {
                // const bufferLen = this._finished ? this._buffer.length : this._target;
                const output = Buffer.alloc(bufferLen);
                this._buffer.copy(output, 0, 0, bufferLen);
                if (remove) {
                    console.log("REMOVE1:", bufferLen);
                    this._buffer = this._buffer.slice(bufferLen);
                }
                return output;
            }
        }
        let peekCBCalled = false;
        this._peekCB = () => {
            peekCBCalled = true;
        };
        return new Promise<Buffer>(resolve => {
            console.log(
                "WAIT FOR DATA",
                this._buffer?.length,
                "/",
                this._target,
                `(finished? ${this._finished})`
            );
            const completePeek = () => {
                this._peekCB = null;
                const peekLength = this._finished ? this._buffer.length : this._target;
                const output = Buffer.alloc(peekLength);
                this._buffer.copy(output, 0, 0, peekLength);
                if (remove) {
                    console.log("REMOVE2:", peekLength);
                    this._buffer = this._buffer.slice(peekLength);
                }
                resolve(output);
            };
            if (peekCBCalled || this._finished) {
                completePeek();
                return;
            }
            this._peekCB = completePeek;
        });
    }
}

export function createDecryptStream(adapter: IocaneAdapter, password: string): Readable {
    // Setup exposed streams
    const inStream = new PassThrough();
    const outStream = new PassThrough();
    const output = duplexer(inStream, outStream);
    // Reader
    const processor = new StreamProcessor(inStream);
    (async function() {
        let header: EncryptedPayloadHeader = null,
            footer: EncryptedPayloadFooter = null;
        const contentBorderReference = Buffer.from(getBinaryContentBorder());
        // Get signature
        {
            const expectedSignature = Buffer.from(getBinarySignature());
            const sigLen = expectedSignature.length;
            const buff = await processor.read(sigLen);
            if (!buff.equals(expectedSignature)) {
                throw new Error("Failed unpacking data: Signature mismatch");
            }
        }
        // Get header
        {
            const sizeBuff = await processor.read(SIZE_ENCODING_BYTES);
            const headerSize = sizeBuff.readUInt32BE(0);
            const headerBuff = await processor.read(headerSize);
            header = JSON.parse(headerBuff.toString("utf8"));
        }
        // Setup decrypt tool
        console.log("PROC HEADER", header);
        adapter.setAlgorithm(header.method);
        adapter.setDerivationRounds(header.rounds);
        let cipher: string;
        switch (header.method) {
            case EncryptionAlgorithm.CBC:
                cipher = NODE_ENC_ALGORITHM_CBC;
                break;
            case EncryptionAlgorithm.GCM:
                cipher = NODE_ENC_ALGORITHM_GCM;
                break;
            default:
                throw new Error(`Invalid algo: ${header.method}`);
        }
        const keyDerivationInfo = await adapter.deriveKey(password, header.salt);
        const iv = Buffer.from(header.iv, "hex");
        const decrypt = crypto.createDecipheriv(cipher, keyDerivationInfo.key as Buffer, iv);
        decrypt.on("readable", () => {
            let chunk: Buffer;
            console.log("READBLE NOW");
            while (null !== (chunk = decrypt.read())) {
                console.log(" -> CHUNK", chunk.toString("utf8"));
                outStream.write(chunk);
            }
        });
        decrypt.on("end", () => {
            outStream.end();
        });
        // Parse content border
        {
            const sizeBuff = await processor.read(SIZE_ENCODING_BYTES);
            const borderSize = sizeBuff.readUInt32BE(0);
            const borderBuff = await processor.read(borderSize);
            if (!borderBuff.equals(contentBorderReference)) {
                throw new Error("Failed unpacking data: Content border invalid");
            }
        }
        // Process content, looking for the final content border
        let finalSegment: Buffer = null;
        do {
            console.log("DO LOOP");
            // Peek
            // let peekBuffer = Buffer.alloc(CONTENT_READAHEAD);
            // const peakRead = await reader.peek(peekBuffer, 0, CONTENT_READAHEAD);
            const peekBuffer = await processor.peek(CONTENT_READAHEAD);
            // if (peakRead < CONTENT_READAHEAD) {
            //     // Stream ran out: trim it
            //     peekBuffer = peekBuffer.slice(0, peakRead);
            // }
            const contentBorderIndex = peekBuffer.indexOf(contentBorderReference);
            if (contentBorderIndex >= 0) {
                // End in sight: Process until the content border
                console.log("READ END", contentBorderIndex);
                const finalContent = await processor.read(contentBorderIndex);
                // Write to decrypt stream
                decrypt.update(finalContent);
                // outStream.write(decrypt.update(finalContent));
                // outStream.write(decrypt.final());
                // Pass border
                console.log("PASS BORDER", contentBorderReference.length);
                // const endBorder = Buffer.alloc(contentBorderReference.length);
                // await reader.read(endBorder, 0, contentBorderReference.length);
                await processor.read(contentBorderReference.length);
                // Fetch the end segment
                console.log("END SEG");
                // finalSegment = Buffer.alloc(CONTENT_FINAL_READ);
                // const finalSegmentLength = await reader.peek(finalSegment, 0, CONTENT_FINAL_READ);

                const finalSegSizeBuff = await processor.read(SIZE_ENCODING_BYTES);
                const finalSegSize = finalSegSizeBuff.readUInt32BE(0);
                finalSegment = await processor.read(finalSegSize);
                if (!processor.finished) {
                    throw new Error("Expected end of stream");
                }
                // finalSegment = await processor.read(CONTENT_FINAL_READ);
                // console.log("END SEG READ");

                // await reader.read(finalSegment, 0, finalSegmentLength);
                // finalSegment = finalSegment.slice(0, finalSegmentLength);
                break;
            } else {
                // No border in sight: Read more and repeat
                // const intermediateBuffer = Buffer.alloc(CONTENT_READ);
                console.log("READ CONT", CONTENT_READ);
                // await reader.read(intermediateBuffer, 0, CONTENT_READ);
                const intermediateBuffer = await processor.read(CONTENT_READ);
                decrypt.update(intermediateBuffer);
                // outStream.write(decrypt.update(intermediateBuffer));
                // continue
            }
        } while (true);
        // Parse footer
        console.log("PREP FOOTER", finalSegment.toString("utf8"));
        footer = JSON.parse(finalSegment.toString("utf8"));
        // Finalise decryption
        console.log("END STREAM");
        decrypt.end();
        // outStream.write(decrypt.final());
        // outStream.end(decrypt.final());
    })().catch(err => {
        console.log("STREAM ERR");
        output.emit("error", err);
        output.destroy();
    });
    return output;
}

export function createEncryptStream(adapter: IocaneAdapter, password: string): Writable {
    // Setup exposed streams
    const inStream = new PassThrough();
    const outStream = new PassThrough();
    const output = duplexer(inStream, outStream);
    // Internal streams
    prepareComponents(adapter, password)
        .then(({ iv, keyDerivationInfo }) => {
            const ivHex = iv.toString("hex");
            const header = prepareHeader({
                iv: ivHex,
                salt: keyDerivationInfo.salt,
                rounds: keyDerivationInfo.rounds,
                method: adapter.algorithm
            });
            // Write header (no compression etc.)
            outStream.write(header);
            // Write content border
            outStream.write(itemsToBuffer([Buffer.from(getBinaryContentBorder())]));
            // Setup crypto streams
            let hmac: Hmac, final: Writable, authTag: Buffer;
            if (adapter.algorithm === EncryptionAlgorithm.CBC) {
                const encrypt = crypto.createCipheriv(
                    NODE_ENC_ALGORITHM_CBC,
                    keyDerivationInfo.key as Buffer,
                    iv
                );
                hmac = crypto.createHmac(NODE_HMAC_ALGORITHM, keyDerivationInfo.hmac as Buffer);
                final = inStream
                    .pipe(
                        new Transform({
                            flush(callback) {
                                this.push(encrypt.final());
                                callback();
                            },
                            transform(chunk, encoding, callback) {
                                callback(null, encrypt.update(chunk));
                            }
                        })
                    )
                    .pipe(
                        new Transform({
                            flush(callback) {
                                this.push(Buffer.from(getBinaryContentBorder()));
                                callback();
                            },
                            transform(chunk, encoding, callback) {
                                hmac.update(chunk);
                                callback(null, chunk);
                            }
                        })
                    );
            } else if (adapter.algorithm === EncryptionAlgorithm.GCM) {
                const encrypt = crypto.createCipheriv(
                    NODE_ENC_ALGORITHM_GCM,
                    keyDerivationInfo.key as Buffer,
                    iv
                );
                (<CipherGCM>encrypt).setAAD(
                    Buffer.from(`${ivHex}${keyDerivationInfo.salt}`, "utf8")
                );
                final = inStream.pipe(
                    new Transform({
                        flush(callback) {
                            this.push(encrypt.final());
                            this.push(Buffer.from(getBinaryContentBorder()));
                            authTag = encrypt.getAuthTag();
                            callback();
                        },
                        transform(chunk, encoding, callback) {
                            callback(null, encrypt.update(chunk));
                        }
                    })
                );
            } else {
                throw new Error(`Invalid encryption algorithm: ${adapter.algorithm}`);
            }
            // Handle transform (footer write)
            const footerTransform = new Transform({
                flush(callback) {
                    if (hmac) {
                        hmac.update(ivHex);
                        hmac.update(keyDerivationInfo.salt);
                        this.push(
                            prepareFooter({
                                auth: hmac.digest("hex")
                            })
                        );
                    } else if (authTag) {
                        this.push(
                            prepareFooter({
                                auth: authTag.toString("hex")
                            })
                        );
                    }
                    callback();
                },
                transform(chunk, encoding, callback) {
                    callback(null, chunk);
                }
            });
            final.pipe(footerTransform).pipe(outStream);
        })
        .catch(err => {
            output.emit("error", err);
            output.destroy();
        });
    return output;
}

async function prepareComponents(
    adapter: IocaneAdapter,
    password: string
): Promise<PreparedEncryptionComponents> {
    const salt = await generateSalt(SALT_LENGTH);
    const [keyDerivationInfo, iv] = await Promise.all([
        adapter.deriveKey(password, salt),
        generateIV()
    ]);
    return {
        iv,
        keyDerivationInfo
    };
}
