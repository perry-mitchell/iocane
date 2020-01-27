import { EncryptedBinaryComponents } from "../base/constructs";
import { getBinarySignature } from "../base/packing";

export { packEncryptedText, unpackEncryptedText } from "../base/packing";

const SIZE_ENCODING_BYTES = 4;

export function packEncryptedData(encryptedComponents: EncryptedBinaryComponents): Buffer {
    const signature = Buffer.from(getBinarySignature());
    const { content, iv, salt, auth, rounds, method } = encryptedComponents;
    return Buffer.concat([
        signature,
        ...[content, iv, salt, auth, rounds, method].reduce((buffers, item) => {
            let data: Buffer;
            if (typeof item === "string" || typeof item === "number") {
                data = Buffer.from(`${item}`, "utf8");
            } else if (item instanceof Buffer) {
                data = item;
            } else {
                throw new Error(`Failed packing data: Invalid component type: ${typeof item}`);
            }
            buffers.push(sizeToBuffer(data.length));
            buffers.push(data);
            return buffers;
        }, [])
    ]);
}

function sizeToBuffer(size: number): Buffer {
    const buffer = new Buffer(SIZE_ENCODING_BYTES);
    buffer.writeUInt32BE(size, 0);
    return buffer;
}

export function unpackEncryptedData(encryptedContent: Buffer): EncryptedBinaryComponents {
    const expectedSignature = Buffer.from(getBinarySignature());
    const sigLen = expectedSignature.length;
    const signature = encryptedContent.slice(0, sigLen);
    if (!signature.equals(expectedSignature)) {
        throw new Error("Failed unpacking data: Signature mismatch");
    }
    let offset = sigLen;
    const items = [];
    while (offset < encryptedContent.length) {
        const itemSize = encryptedContent.readUInt32BE(offset);
        offset += SIZE_ENCODING_BYTES;
        const item = encryptedContent.slice(offset, offset + itemSize);
        offset += itemSize;
        items.push(item);
    }
    const [content, ivBuff, saltBuff, authBuff, roundsBuff, methodBuff] = items;
    return {
        content,
        iv: ivBuff.toString("utf8"),
        salt: saltBuff.toString("utf8"),
        auth: authBuff.toString("utf8"),
        rounds: parseInt(roundsBuff.toString("utf8"), 10),
        method: methodBuff.toString("utf8")
    };
}
