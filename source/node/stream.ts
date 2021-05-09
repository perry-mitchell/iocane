import crypto, { CipherGCM, Hmac } from "crypto";
import zlib from "zlib";
import { PassThrough, Transform, Writable } from "stream";
import duplexer from "duplexer";
import { generateIV, generateSalt } from "./encryption";
import { prepareFooter, prepareHeader } from "./dataPacking";
import {
    NODE_ENC_ALGORITHM_CBC,
    NODE_ENC_ALGORITHM_GCM,
    NODE_HMAC_ALGORITHM,
    SALT_LENGTH
} from "../symbols";
import { DerivedKeyInfo, EncryptionAlgorithm, IocaneAdapter } from "../types";

interface PreparedEncryptionComponents {
    iv: Buffer;
    keyDerivationInfo: DerivedKeyInfo;
}

export function createEncryptStream(adapter: IocaneAdapter, password: string): Writable {
    // Setup exposed streams
    const inStream = new PassThrough();
    const outStream = new PassThrough();
    const output = duplexer(inStream, outStream);
    // Internal streams
    const gzip = zlib.createGzip();
    inStream.pipe(gzip);
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
            // Setup crypto streams
            let hmac: Hmac, final: Writable;
            if (adapter.algorithm === EncryptionAlgorithm.CBC) {
                const encrypt = crypto.createCipheriv(
                    NODE_ENC_ALGORITHM_CBC,
                    keyDerivationInfo.key as Buffer,
                    iv
                );
                hmac = crypto.createHmac(NODE_HMAC_ALGORITHM, keyDerivationInfo.hmac as Buffer);
                final = gzip.pipe(encrypt).pipe(hmac);
                final.on("data", chunk => console.log("IN", chunk));
            } else if (adapter.algorithm === EncryptionAlgorithm.GCM) {
                const encrypt = crypto.createCipheriv(
                    NODE_ENC_ALGORITHM_GCM,
                    keyDerivationInfo.key as Buffer,
                    iv
                );
                (<CipherGCM>encrypt).setAAD(
                    Buffer.from(`${ivHex}${keyDerivationInfo.salt}`, "utf8")
                );
                final = gzip.pipe(encrypt);
            } else {
                throw new Error(`Invalid encryption algorithm: ${adapter.algorithm}`);
            }
            // Handle transform (footer write)
            const footerTransform = new Transform({
                flush(callback) {
                    if (hmac) {
                        hmac.update(ivHex);
                        hmac.update(keyDerivationInfo.salt);
                        const hmacHex = hmac.digest("hex");
                        this.push(
                            prepareFooter({
                                auth: hmacHex
                            })
                        );
                        callback();
                    }
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
