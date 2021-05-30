import crypto, { CipherGCM, DecipherGCM, Hmac } from "crypto";
import { PassThrough, Readable, Transform, Writable } from "stream";
import EventEmitter from "events";
import duplexer from "duplexer";
import streamEach from "stream-each";
import { generateIV, generateSalt } from "./encryption";
import { itemsToBuffer, prepareFooter, prepareHeader } from "./dataPacking";
import { getBinaryContentBorder, getBinarySignature } from "../shared/signature";
import { constantTimeCompare } from "../shared/timing";
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

type StreamEachCallable = () => void;

const CONTENT_READAHEAD = 256 * 1024;
const CONTENT_READ = CONTENT_READAHEAD - getBinaryContentBorder().length * 2;

class Streamer extends EventEmitter {
    protected _buffer: Buffer = null;
    protected _bytesRead: number = 0;
    protected _finished: boolean = false;
    protected _stream: Readable;
    protected _target: number = -1;

    get bytesRead(): number {
        return this._bytesRead;
    }

    get finished(): boolean {
        return this._finished;
    }

    constructor(stream: Readable) {
        super();
        this._stream = stream;
    }

    async peek(bytes: number): Promise<Buffer> {
        return this._read(bytes, false);
    }

    async read(bytes: number): Promise<Buffer> {
        return this._read(bytes, true);
    }

    protected _init() {
        if (this._target !== -1) return;
        this._target = 0;
        streamEach(
            this._stream,
            (data: Buffer, next: StreamEachCallable) => {
                this._buffer = this._buffer ? Buffer.concat([this._buffer, data]) : data;
                if (this._target > 0) {
                    if (this._buffer.length >= this._target) {
                        this.emit("target");
                    } else {
                        next();
                        return;
                    }
                }
                this.once("wait", () => {
                    next();
                });
            },
            (err?: Error) => {
                if (err) {
                    this.emit("error", err);
                    this._stream.emit("error", err);
                }
                this._finished = true;
                this.emit("finished");
            }
        );
    }

    protected async _read(
        bytes: number,
        remove: boolean,
        skipTargetCheck: boolean = false
    ): Promise<Buffer> {
        this._init();
        if (!bytes || bytes <= 0) {
            throw new Error(`Invalid number of bytes: ${bytes}`);
        }
        if (!skipTargetCheck && this._target > 0) {
            throw new Error("Existing stream peek/read operation already in progress");
        }
        this._target = bytes;
        if (!this._buffer || this._buffer.length < this._target) {
            return new Promise<Buffer>((resolve, reject) => {
                const finishedCB = () => {
                    this.removeListener("target", finishedCB);
                    this._read(this._buffer.length, remove, true).then(resolve, reject);
                };
                const targetReachedCB = () => {
                    this.removeListener("finished", finishedCB);
                    this._read(bytes, remove, true).then(resolve, reject);
                };
                this.once("finished", finishedCB);
                this.once("target", targetReachedCB);
                this.emit("wait");
            });
        }
        const readBytes = Math.min(this._target, this._buffer.length);
        const outBuff = Buffer.alloc(readBytes);
        this._buffer.copy(outBuff, 0, 0, readBytes);
        if (remove) {
            this._buffer = this._buffer.slice(readBytes);
        }
        this._target = 0;
        this._bytesRead += outBuff.length;
        return outBuff;
    }
}

export function createDecryptStream(adapter: IocaneAdapter, password: string): Readable {
    // Setup exposed streams
    const inStream = new PassThrough();
    const outStream = new PassThrough();
    const output = duplexer(inStream, outStream);
    // Reader
    const processor = new Streamer(inStream);
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
        let hmacTool: Hmac = null;
        if (header.method === EncryptionAlgorithm.CBC) {
            hmacTool = crypto.createHmac(NODE_HMAC_ALGORITHM, keyDerivationInfo.hmac as Buffer);
        } else if (header.method === EncryptionAlgorithm.GCM) {
            (<DecipherGCM>decrypt).setAAD(
                Buffer.from(`${header.iv}${keyDerivationInfo.salt}`, "utf8")
            );
        }
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
            // Peek
            const peekBuffer = await processor.peek(CONTENT_READAHEAD);
            const contentBorderIndex = peekBuffer.indexOf(contentBorderReference);
            if (contentBorderIndex >= 0) {
                // End in sight: Process until the content border
                const finalContent = await processor.read(contentBorderIndex);
                // Write to decrypt stream
                if (hmacTool) {
                    hmacTool.update(finalContent);
                }
                outStream.write(decrypt.update(finalContent));
                // Pass border
                await processor.read(contentBorderReference.length);
                // Fetch the end segment
                const finalSegSizeBuff = await processor.read(SIZE_ENCODING_BYTES);
                const finalSegSize = finalSegSizeBuff.readUInt32BE(0);
                finalSegment = await processor.read(finalSegSize);
                if (!processor.finished) {
                    throw new Error("Expected end of stream");
                }
                break;
            } else {
                // No border in sight: Read more and repeat
                const intermediateBuffer = await processor.read(CONTENT_READ);
                if (hmacTool) {
                    hmacTool.update(intermediateBuffer);
                }
                outStream.write(decrypt.update(intermediateBuffer));
                // continue
            }
        } while (true);
        // Parse footer
        footer = JSON.parse(finalSegment.toString("utf8"));
        // Set auth tag
        if (header.method === EncryptionAlgorithm.CBC) {
            hmacTool.update(header.iv);
            hmacTool.update(header.salt);
            // Check hmac for tampering
            const newHmacHex = hmacTool.digest("hex");
            if (constantTimeCompare(footer.auth, newHmacHex) !== true) {
                throw new Error("Authentication failed while decrypting content");
            }
        } else if (header.method === EncryptionAlgorithm.GCM) {
            (<DecipherGCM>decrypt).setAuthTag(Buffer.from(footer.auth, "hex"));
        }
        // Finalise decryption
        inStream.destroy();
        outStream.end(decrypt.final());
    })().catch(err => {
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
