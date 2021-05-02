import { EncryptedBinaryComponents, EncryptionAlgorithm } from "../types";
import { getBinarySignature } from "../shared/signature";
import {
    arrayBuffersEqual,
    arrayBufferToString,
    concatArrayBuffers,
    stringToArrayBuffer
} from "./tools";
import { SIZE_ENCODING_BYTES } from "../symbols";

export function packEncryptedData(encryptedComponents: EncryptedBinaryComponents): ArrayBuffer {
    const signature = new Uint8Array(getBinarySignature()).buffer;
    const { content, iv, salt, auth, rounds, method } = encryptedComponents;
    const encryptedComponentPayload = JSON.stringify({
        iv,
        salt,
        auth,
        rounds,
        method
    });
    return concatArrayBuffers([
        signature,
        ...[encryptedComponentPayload, content].reduce((buffers, item) => {
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

export function unpackEncryptedData(encryptedContent: ArrayBuffer): EncryptedBinaryComponents {
    const expectedSignature = new Uint8Array(getBinarySignature()).buffer;
    const sigLen = expectedSignature.byteLength;
    const signature = encryptedContent.slice(0, sigLen);
    if (!arrayBuffersEqual(signature, expectedSignature)) {
        throw new Error("Failed unpacking data: Signature mismatch");
    }
    let offset = sigLen;
    const items = [];
    const dataView = new DataView(encryptedContent);
    while (offset < encryptedContent.byteLength) {
        const itemSize = dataView.getUint32(offset);
        offset += SIZE_ENCODING_BYTES;
        const item = encryptedContent.slice(offset, offset + itemSize);
        offset += itemSize;
        items.push(item);
    }
    const [componentBuff, content] = items;
    const { iv, salt, auth, rounds, method } = JSON.parse(arrayBufferToString(componentBuff));
    return {
        content,
        iv,
        salt,
        auth,
        rounds,
        method
    };
}
