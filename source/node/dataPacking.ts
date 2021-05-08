import { getBinarySignature } from "../shared/signature";
import { SIZE_ENCODING_BYTES } from "../symbols";
import {
    EncryptedBinaryComponents,
    EncryptedComponentsBase,
    EncryptedPayloadFooter,
    EncryptedPayloadHeader
} from "../types";

function itemsToBuffer(items: Array<string | number | Buffer>): Buffer {
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
    const components: Array<Buffer> = [prepareHeader(encryptedComponents)];
    if ((<EncryptedBinaryComponents>encryptedComponents).content) {
        components.push(
            itemsToBuffer([(<EncryptedBinaryComponents>encryptedComponents).content as Buffer])
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
    const { iv, salt, rounds, method } = encryptedComponents;
    const componentsPrefix = JSON.stringify({
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
    const [prefixBuff, contentBuff, suffixBuff] = items;
    const { iv, salt, rounds, method } = JSON.parse(prefixBuff.toString("utf8"));
    const { auth } = JSON.parse(suffixBuff.toString("utf8"));
    return {
        content: contentBuff,
        iv,
        salt,
        auth,
        rounds,
        method
    };
}
