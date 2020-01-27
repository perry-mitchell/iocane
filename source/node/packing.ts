import { EncryptedBinaryComponents, PackedEncryptedData } from "../base/constructs";
import { getBinarySignature } from "../base/packing";
export { packEncryptedText, unpackEncryptedText } from "../base/packing";

export function packEncryptedData(
    encryptedComponents: EncryptedBinaryComponents
): PackedEncryptedData {
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
    const buffer = new Buffer(4);
    buffer.writeUInt32BE(size, 0);
    return buffer;
}
