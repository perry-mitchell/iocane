import crypto, { CipherGCM, Hmac } from "crypto";
import { PassThrough, Readable, Transform, Writable } from "stream";
import duplexer from "duplexer";
import { StreamReader } from "peek-readable";
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

// interface TransformWithCollect extends Transform {
//     collect: () => Buffer;
// }

interface PreparedEncryptionComponents {
    iv: Buffer;
    keyDerivationInfo: DerivedKeyInfo;
}

const CONTENT_FINAL_READ = 16384;
const CONTENT_READAHEAD = 2048;
const CONTENT_READ = CONTENT_READAHEAD - getBinaryContentBorder().length * 2;

export function createDecryptStream(adapter: IocaneAdapter, password: string): Readable {
    // Setup exposed streams
    const inStream = new PassThrough();
    const outStream = new PassThrough();
    const output = duplexer(inStream, outStream);
    // Reader
    const reader = new StreamReader(inStream);
    (async function() {
        let header: EncryptedPayloadHeader = null,
            footer: EncryptedPayloadFooter = null;
        const contentBorderReference = Buffer.from(getBinaryContentBorder());
        // Get signature
        {
            const expectedSignature = Buffer.from(getBinarySignature());
            const sigLen = expectedSignature.length;
            const buff = Buffer.alloc(sigLen);
            await reader.read(buff, 0, sigLen);
            if (!buff.equals(expectedSignature)) {
                throw new Error("Failed unpacking data: Signature mismatch");
            }
        }
        // Get header
        {
            const sizeBuff = Buffer.alloc(SIZE_ENCODING_BYTES);
            await reader.read(sizeBuff, 0, SIZE_ENCODING_BYTES);
            const headerSize = sizeBuff.readUInt32BE(0);
            const headerBuff = Buffer.alloc(headerSize);
            await reader.read(headerBuff, 0, headerSize);
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
        // Parse content border
        {
            const sizeBuff = Buffer.alloc(SIZE_ENCODING_BYTES);
            await reader.read(sizeBuff, 0, SIZE_ENCODING_BYTES);
            const borderSize = sizeBuff.readUInt32BE(0);
            const borderBuff = Buffer.alloc(borderSize);
            await reader.read(borderBuff, 0, borderSize);
            if (!borderBuff.equals(contentBorderReference)) {
                throw new Error("Failed unpacking data: Content border invalid");
            }
        }
        // Process content, looking for the final content border
        let finalSegment: Buffer = null;
        do {
            // Peek
            let peakBuffer = Buffer.alloc(CONTENT_READAHEAD);
            const peakRead = await reader.peek(peakBuffer, 0, CONTENT_READAHEAD);
            if (peakRead < CONTENT_READAHEAD) {
                // Stream ran out: trim it
                peakBuffer = peakBuffer.slice(0, peakRead);
            }
            const contentBorderIndex = peakBuffer.indexOf(contentBorderReference);
            if (contentBorderIndex >= 0) {
                // End in sight: Process until the content border
                console.log("READ END", contentBorderIndex);
                const finalContent = Buffer.alloc(contentBorderIndex);
                await reader.read(finalContent, 0, contentBorderIndex);
                // Write to decrypt stream
                outStream.write(decrypt.update(finalContent));
                // outStream.write(decrypt.final());
                // Pass border
                console.log("PASS BORDER");
                const endBorder = Buffer.alloc(contentBorderReference.length);
                await reader.read(endBorder, 0, contentBorderReference.length);
                // Fetch the end segment
                console.log("END SEG");
                finalSegment = Buffer.alloc(CONTENT_FINAL_READ);
                const finalSegmentLength = await reader.peek(finalSegment, 0, CONTENT_FINAL_READ);
                console.log("END SEG READ");
                await reader.read(finalSegment, 0, finalSegmentLength);
                finalSegment = finalSegment.slice(0, finalSegmentLength);
                break;
            } else {
                // No border in sight: Read more and repeat
                const intermediateBuffer = Buffer.alloc(CONTENT_READ);
                console.log("READ CONT", CONTENT_READ);
                await reader.read(intermediateBuffer, 0, CONTENT_READ);
                outStream.write(decrypt.update(intermediateBuffer));
                // continue
            }
        } while (true);
        // Parse footer
        footer = JSON.parse(finalSegment.toString("utf8"));
        // Finalise decryption
        outStream.write(decrypt.final());
        outStream.end();
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
