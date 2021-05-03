import { getBinarySignature } from "../shared/signature";
import { SIZE_ENCODING_BYTES } from "../symbols";
import { EncryptedBinaryComponents } from "../types";

export function packEncryptedData(encryptedComponents: EncryptedBinaryComponents): Buffer {
    const signature = Buffer.from(getBinarySignature());
    const { content, iv, salt, auth, rounds, method } = encryptedComponents;
    const encryptedComponentPayload = JSON.stringify({
        iv,
        salt,
        auth,
        rounds,
        method
    });
    return Buffer.concat([
        signature,
        ...[encryptedComponentPayload, content].reduce((buffers, item) => {
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
    const buffer = Buffer.alloc(SIZE_ENCODING_BYTES);
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
    const [componentBuff, contentBuff] = items;
    const { iv, salt, auth, rounds, method } = JSON.parse(componentBuff.toString("utf8"));
    return {
        content: contentBuff,
        iv,
        salt,
        auth,
        rounds,
        method
    };
}
