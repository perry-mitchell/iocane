import { EncryptedBinaryComponents, PackedEncryptedData } from "../base/constructs";
import { getBinarySignature } from "../base/packing";
import { stringToArrayBuffer } from "./shared";

export { packEncryptedText, unpackEncryptedText } from "../base/packing";

function concatArrayBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
    if (buffers.length <= 0) {
        throw new Error("Failed concatenating array buffers: At least one must be passed");
    }
    const totalSize = buffers.reduce((total, buff) => total + buff.byteLength, 0);
    const dataArr = new Uint8Array(totalSize);
    let offset = 0;
    buffers.forEach(buff => {
        dataArr.set(new Uint8Array(buff), offset);
        offset += buff.byteLength;
    });
    return dataArr.buffer;
}

export function packEncryptedData(
    encryptedComponents: EncryptedBinaryComponents
): PackedEncryptedData {
    const signature = new Uint8Array(getBinarySignature()).buffer;
    const { content, iv, salt, auth, rounds, method } = encryptedComponents;
    return concatArrayBuffers([
        signature,
        ...[content, iv, salt, auth, rounds, method].reduce((buffers, item) => {
            let data: ArrayBuffer;
            if (typeof item === "string" || typeof item === "number") {
                data = stringToArrayBuffer(`${item}`);
            } else if (item instanceof ArrayBuffer) {
                data = item;
            } else {
                throw new Error(`Failed packing data: Invalid component type: ${typeof item}`);
            }
            buffers.push(sizeToBuffer(data.byteLength));
            buffers.push(data);
            return buffers;
        }, [])
    ]);
}

function sizeToBuffer(size: number): ArrayBuffer {
    const buffer = new ArrayBuffer(4);
    const dataView = new DataView(buffer);
    dataView.setUint32(0, size, /* little-endian: */ false);
    return buffer;
}
