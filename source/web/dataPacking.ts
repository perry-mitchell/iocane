import { getBinarySignature, getBinaryContentBorder } from "../shared/signature";
import {
    arrayBufferFindIndex,
    arrayBuffersEqual,
    arrayBufferToString,
    concatArrayBuffers,
    stringToArrayBuffer
} from "./tools";
import { SIZE_ENCODING_BYTES } from "../symbols";
import {
    EncryptedBinaryComponents,
    EncryptedComponentsBase,
    EncryptedPayloadFooter,
    EncryptedPayloadHeader
} from "../types";

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
    const border = new Uint8Array(getBinaryContentBorder()).buffer;
    const components: Array<ArrayBuffer> = [prepareHeader(encryptedComponents)];
    if ((<EncryptedBinaryComponents>encryptedComponents).content) {
        components.push(
            itemsToBuffer([border]),
            (<EncryptedBinaryComponents>encryptedComponents).content as ArrayBuffer,
            border
        );
    }
    components.push(prepareFooter(encryptedComponents));
    return concatArrayBuffers(components);
}

export function prepareFooter(encryptedComponents: EncryptedPayloadFooter): ArrayBuffer {
    const { auth } = encryptedComponents;
    const componentsSuffix = JSON.stringify({
        auth
    });
    return itemsToBuffer([componentsSuffix]);
}

export function prepareHeader(encryptedComponents: EncryptedPayloadHeader): ArrayBuffer {
    const signature = new Uint8Array(getBinarySignature()).buffer;
    const { iv, salt, rounds, method } = encryptedComponents;
    const componentsPrefix = JSON.stringify({
        iv,
        salt,
        rounds,
        method
    });
    return concatArrayBuffers([signature, itemsToBuffer([componentsPrefix])]);
}

function sizeToBuffer(size: number): ArrayBuffer {
    const buffer = new ArrayBuffer(4);
    const dataView = new DataView(buffer);
    dataView.setUint32(0, size, /* little-endian: */ false);
    return buffer;
}

export function unpackEncryptedData(encryptedContent: ArrayBuffer): EncryptedBinaryComponents {
    let offset = 0;
    const expectedSignature = new Uint8Array(getBinarySignature()).buffer;
    const sigLen = expectedSignature.byteLength;
    const signature = encryptedContent.slice(0, sigLen);
    if (!arrayBuffersEqual(signature, expectedSignature)) {
        throw new Error("Failed unpacking data: Signature mismatch");
    }
    offset = sigLen;
    // Prepare dataview
    const dataView = new DataView(encryptedContent);
    // const uintView = new Uint8Array(encryptedContent);
    // Read header
    const headerSize = dataView.getUint32(offset);
    offset += SIZE_ENCODING_BYTES;
    const headerData = encryptedContent.slice(offset, offset + headerSize);
    offset += headerSize;
    // Read content border
    const contentBorderSize = dataView.getUint32(offset);
    offset += SIZE_ENCODING_BYTES;
    const contentBorder = encryptedContent.slice(offset, offset + contentBorderSize);
    offset += contentBorderSize;
    const contentBorderRef = new Uint8Array(getBinaryContentBorder());
    if (!arrayBuffersEqual(contentBorderRef, contentBorder)) {
        throw new Error("Decoding error: Encrypted content length is corrupt");
    }
    // Locate end of content
    // const endBorderOffset = encryptedContent.indexOf(contentBorder, offset);
    const endBorderOffset = arrayBufferFindIndex(encryptedContent, contentBorder, offset);
    if (endBorderOffset === -1) {
        throw new Error("Decoding error: Encrypted content corrupt or incomplete");
    }
    const contentBuff = encryptedContent.slice(offset, endBorderOffset);
    offset = endBorderOffset + contentBorderSize;
    // Read footer
    const footerSize = dataView.getUint32(offset);
    offset += SIZE_ENCODING_BYTES;
    const footerData = encryptedContent.slice(offset, offset + footerSize);
    offset += footerSize;
    // Decode
    const { iv, salt, rounds, method } = JSON.parse(arrayBufferToString(headerData));
    const { auth } = JSON.parse(arrayBufferToString(footerData));
    return {
        content: contentBuff,
        iv,
        salt,
        auth,
        rounds,
        method
    };
}
