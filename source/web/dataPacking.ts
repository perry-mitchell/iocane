import { EncryptedBinaryComponents, EncryptedComponentsBase } from "../types";
import { getBinarySignature } from "../shared/signature";
import {
    arrayBuffersEqual,
    arrayBufferToString,
    concatArrayBuffers,
    stringToArrayBuffer
} from "./tools";
import { SIZE_ENCODING_BYTES } from "../symbols";

function itemsToBuffer(items: Array<string | number | ArrayBuffer>): ArrayBuffer {
    return concatArrayBuffers(
        items.reduce((buffers: Array<ArrayBuffer>, item) => {
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
    );
}

export function packEncryptedData(
    encryptedComponents: EncryptedBinaryComponents | EncryptedComponentsBase
): ArrayBuffer {
    const components: Array<ArrayBuffer> = [prepareHeader(encryptedComponents)];
    if ((<EncryptedBinaryComponents>encryptedComponents).content) {
        components.push(
            itemsToBuffer([(<EncryptedBinaryComponents>encryptedComponents).content as ArrayBuffer])
        );
    }
    components.push(prepareFooter(encryptedComponents));
    return concatArrayBuffers(components);
}

export function prepareHeader(encryptedComponents: EncryptedComponentsBase): ArrayBuffer {
    const signature = Buffer.from(getBinarySignature());
    const { iv, salt, rounds, method } = encryptedComponents;
    const componentsPrefix = JSON.stringify({
        iv,
        salt,
        rounds,
        method
    });
    return concatArrayBuffers([signature, itemsToBuffer([componentsPrefix])]);
}

export function prepareFooter(encryptedComponents: EncryptedComponentsBase): ArrayBuffer {
    const { auth } = encryptedComponents;
    const componentsSuffix = JSON.stringify({
        auth
    });
    return itemsToBuffer([componentsSuffix]);
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
    const [prefixBuff, contentBuff, suffixBuff] = items;
    const { iv, salt, rounds, method } = JSON.parse(arrayBufferToString(prefixBuff));
    const { auth } = JSON.parse(arrayBufferToString(suffixBuff));
    return {
        content: contentBuff,
        iv,
        salt,
        auth,
        rounds,
        method
    };
}
