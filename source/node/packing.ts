import { EncryptedBinaryComponents, EncryptionType } from "../types";
import { getBinarySignature } from "../base/packing";

export { packEncryptedText, unpackEncryptedText } from "../base/packing";

const SIZE_ENCODING_BYTES = 4;

type PackableComponent = Buffer | string | number;
type PackableComponents = Array<Buffer | string | number>;

export function packComponents(...components: PackableComponents): Buffer {
    return Buffer.concat(
        components.reduce((buffers: Buffer[], item: PackableComponent): Buffer[] => {
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
    );
}

export function packEncryptedData(encryptedComponents: EncryptedBinaryComponents): Buffer {
    const signature = Buffer.from(getBinarySignature());
    const { content, iv, salt, auth, rounds, method } = encryptedComponents;
    return Buffer.concat([
        signature,
        packComponents(content as Buffer, iv, salt, auth, rounds, method)
    ]);
}

function sizeToBuffer(size: number): Buffer {
    const buffer = Buffer.alloc(SIZE_ENCODING_BYTES);
    buffer.writeUInt32BE(size, 0);
    return buffer;
}

export function unpackComponents(packedContent: Buffer, initialOffset: number): Buffer[] {
    let offset = initialOffset;
    const items = [];
    while (offset < packedContent.length) {
        const itemSize = packedContent.readUInt32BE(offset);
        offset += SIZE_ENCODING_BYTES;
        const item = packedContent.slice(offset, offset + itemSize);
        offset += itemSize;
        items.push(item);
    }
    return items;
}

export function unpackEncryptedData(encryptedContent: Buffer): EncryptedBinaryComponents {
    const expectedSignature = Buffer.from(getBinarySignature());
    const sigLen = expectedSignature.length;
    const signature = encryptedContent.slice(0, sigLen);
    if (!signature.equals(expectedSignature)) {
        throw new Error("Failed unpacking data: Signature mismatch");
    }
    const [content, ivBuff, saltBuff, authBuff, roundsBuff, methodBuff] = unpackComponents(
        encryptedContent,
        sigLen
    );
    return {
        content,
        iv: ivBuff.toString("utf8"),
        salt: saltBuff.toString("utf8"),
        auth: authBuff.toString("utf8"),
        rounds: parseInt(roundsBuff.toString("utf8"), 10),
        method: methodBuff.toString("utf8") as EncryptionType
    };
}
