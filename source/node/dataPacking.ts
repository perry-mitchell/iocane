import { getBinarySignature, getBinaryContentBorder } from "../shared/signature";
import { SIZE_ENCODING_BYTES } from "../symbols";
import {
    DerivationMethod,
    EncryptedBinaryComponents,
    EncryptedComponentsBase,
    EncryptedPayloadFooter,
    EncryptedPayloadHeader
} from "../types";

export function itemsToBuffer(items: Array<string | number | Buffer>): Buffer {
    return Buffer.concat(
        items.reduce((buffers: Array<Buffer>, item) => {
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

export function packEncryptedData(
    encryptedComponents: EncryptedBinaryComponents | EncryptedComponentsBase
): Buffer {
    const border = Buffer.from(getBinaryContentBorder());
    const components: Array<Buffer> = [prepareHeader(encryptedComponents)];
    if ((<EncryptedBinaryComponents>encryptedComponents).content) {
        components.push(
            itemsToBuffer([border]),
            (<EncryptedBinaryComponents>encryptedComponents).content as Buffer,
            border
        );
    }
    components.push(prepareFooter(encryptedComponents));
    return Buffer.concat(components);
}

export function prepareFooter(encryptedComponents: EncryptedPayloadFooter): Buffer {
    const { auth } = encryptedComponents;
    const componentsSuffix = JSON.stringify({
        auth
    });
    return itemsToBuffer([componentsSuffix]);
}

export function prepareHeader(encryptedComponents: EncryptedPayloadHeader): Buffer {
    const signature = Buffer.from(getBinarySignature());
    const { derivation, iv, salt, rounds, method } = encryptedComponents;
    const componentsPrefix = JSON.stringify({
        derivation,
        iv,
        salt,
        rounds,
        method
    });
    return Buffer.concat([signature, itemsToBuffer([componentsPrefix])]);
}

function sizeToBuffer(size: number): Buffer {
    const buffer = Buffer.alloc(SIZE_ENCODING_BYTES);
    buffer.writeUInt32BE(size, 0);
    return buffer;
}

export function unpackEncryptedData(encryptedContent: Buffer): EncryptedBinaryComponents {
    let offset = 0;
    const expectedSignature = Buffer.from(getBinarySignature());
    const sigLen = expectedSignature.length;
    const signature = encryptedContent.slice(0, sigLen);
    if (!signature.equals(expectedSignature)) {
        throw new Error("Failed unpacking data: Signature mismatch");
    }
    offset = sigLen;
    // Read header
    const headerSize = encryptedContent.readUInt32BE(offset);
    offset += SIZE_ENCODING_BYTES;
    const headerData = encryptedContent.slice(offset, offset + headerSize);
    offset += headerSize;
    // Read content border
    const contentBorderSize = encryptedContent.readUInt32BE(offset);
    offset += SIZE_ENCODING_BYTES;
    const contentBorder = encryptedContent.slice(offset, offset + contentBorderSize);
    offset += contentBorderSize;
    const contentBorderRef = Buffer.from(getBinaryContentBorder());
    if (!contentBorderRef.equals(contentBorder)) {
        throw new Error("Decoding error: Encrypted content length is corrupt");
    }
    // Locate end of content
    const endBorderOffset = encryptedContent.indexOf(contentBorder, offset);
    if (endBorderOffset === -1) {
        throw new Error("Decoding error: Encrypted content corrupt or incomplete");
    }
    const contentBuff = encryptedContent.slice(offset, endBorderOffset);
    offset = endBorderOffset + contentBorderSize;
    // Read footer
    const footerSize = encryptedContent.readUInt32BE(offset);
    offset += SIZE_ENCODING_BYTES;
    const footerData = encryptedContent.slice(offset, offset + footerSize);
    offset += footerSize;
    // Decode
    const {
        derivation = DerivationMethod.PBKDF2_SHA256,
        iv,
        salt,
        rounds,
        method
    } = JSON.parse(headerData.toString("utf8"));
    const { auth } = JSON.parse(footerData.toString("utf8"));
    return {
        content: contentBuff,
        derivation,
        iv,
        salt,
        auth,
        rounds,
        method
    };
}
