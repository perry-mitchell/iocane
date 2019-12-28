// import * as crypto from "crypto";
// import { constantTimeCompare } from "../base/timing";
import {
    arrayBufferToHexString,
    arrayBufferToString,
    base64ToArrayBuffer,
    hexStringToArrayBuffer,
    stringToArrayBuffer
} from "./shared";
import { DerivedKeyInfo, EncryptedComponents, EncryptionType } from "../base/constructs";

const ENC_ALGORITHM_CBC = "AES-CBC";
const ENC_ALGORITHM_GCM = "AES-GCM";
const GCM_AUTH_TAG_LENGTH = 128;
const SIGN_ALGORITHM = "HMAC";

/**
 * Decrypt text using AES-CBC
 * @param encryptedComponents Encrypted components
 * @param keyDerivationInfo Key derivation information
 * @returns A promise that resolves with the decrypted string
 */
export async function decryptCBC(
    encryptedComponents: EncryptedComponents,
    keyDerivationInfo: DerivedKeyInfo
): Promise<string> {
    const crypto = getCrypto();
    // Extract the components
    const {
        auth: hmacDataRaw,
        content: encryptedContentRaw,
        iv: ivStr,
        salt
    } = encryptedComponents;
    const iv = hexStringToArrayBuffer(ivStr);
    const hmacData = hexStringToArrayBuffer(hmacDataRaw);
    const encryptedContent = base64ToArrayBuffer(encryptedContentRaw);
    // Import keys (primary & HMAC signing)
    // @ts-ignore
    const importedKey = await crypto.subtle.importKey(
        "raw",
        keyDerivationInfo.key,
        { name: ENC_ALGORITHM_CBC },
        /* not extractable: */ false,
        ["encrypt"]
    );
    // @ts-ignore
    const importedHMACKey = await crypto.subtle.importKey(
        "raw",
        keyDerivationInfo.hmac,
        { name: ENC_ALGORITHM_CBC },
        /* not extractable: */ false,
        ["verify"]
    );
    // Verify authentication
    const hmacMatches = await crypto.subtle.verify(
        SIGN_ALGORITHM,
        importedHMACKey,
        hmacData,
        encryptedContent
    );
    if (!hmacMatches) {
        throw new Error("Authentication failed while decrypting content");
    }
    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
        {
            name: ENC_ALGORITHM_CBC,
            iv
        },
        importedKey,
        encryptedContent
    );
    return arrayBufferToString(decrypted);
}

// /**
//  * Decrypt text using AES-GCM
//  * @param encryptedComponents Encrypted components
//  * @param keyDerivationInfo Key derivation information
//  * @returns A promise that resolves with the decrypted string
//  */
// export async function decryptGCM(
//     encryptedComponents: EncryptedComponents,
//     keyDerivationInfo: DerivedKeyInfo
// ): Promise<string> {
//     // Extract the components
//     const encryptedContent = encryptedComponents.content;
//     const iv = new Buffer(encryptedComponents.iv, "hex");
//     const { auth: tagHex } = encryptedComponents;
//     // Prepare tool
//     const decryptTool = crypto.createDecipheriv(ENC_ALGORITHM_GCM, keyDerivationInfo.key, iv);
//     // Add additional auth data
//     decryptTool.setAAD(new Buffer(`${encryptedComponents.iv}${keyDerivationInfo.salt}`, "utf8"));
//     // Set auth tag
//     decryptTool.setAuthTag(new Buffer(tagHex, "hex"));
//     // Perform decryption
//     const decryptedText = decryptTool.update(encryptedContent, "base64", "utf8");
//     return `${decryptedText}${decryptTool.final("utf8")}`;
// }

/**
 * Encrypt text using AES-CBC
 * @param text The text to encrypt
 * @param keyDerivationInfo Key derivation information
 * @param iv A buffer containing the IV
 * @returns A promise that resolves with encrypted components
 */
export async function encryptCBC(
    text: string,
    keyDerivationInfo: DerivedKeyInfo,
    iv: ArrayBuffer
): Promise<EncryptedComponents> {
    const crypto = getCrypto();
    const { rounds } = keyDerivationInfo;
    const ivArr = new Uint8Array(iv);
    const ivHex = arrayBufferToHexString(iv);
    const preparedContent = stringToArrayBuffer(text);
    // Import keys (primary & HMAC signing)
    // @ts-ignore
    const importedKey = await crypto.subtle.importKey(
        "raw",
        keyDerivationInfo.key,
        { name: ENC_ALGORITHM_CBC },
        /* not extractable: */ false,
        ["encrypt"]
    );
    // @ts-ignore
    const importedHMACKey = await crypto.subtle.importKey(
        "raw",
        keyDerivationInfo.hmac,
        { name: ENC_ALGORITHM_CBC },
        /* not extractable: */ false,
        ["sign"]
    );
    // Encrypt content
    const cipherBuffer = await crypto.subtle.encrypt(
        {
            name: ENC_ALGORITHM_CBC,
            iv: ivArr
        },
        importedKey,
        preparedContent
    );
    // Sign content
    const signatureBuffer = await window.crypto.subtle.sign(
        SIGN_ALGORITHM,
        importedHMACKey,
        cipherBuffer
    );
    const hmacHex = arrayBufferToHexString(signatureBuffer);
    // Convert encrypted content to base64
    const cipherArr = new Uint8Array(cipherBuffer);
    const rawOutput = cipherArr.reduce((progress, byte) => {
        return progress + String.fromCharCode(byte);
    }, "");
    const encryptedContent = btoa(rawOutput);
    // Output encrypted components
    return {
        method: EncryptionType.CBC,
        auth: hmacHex,
        iv: ivHex,
        salt: keyDerivationInfo.salt,
        rounds,
        content: encryptedContent
    };
}

/**
 * Encrypt text using AES-GCM
 * @param text The text to encrypt
 * @param keyDerivationInfo Key derivation information
 * @param iv A buffer containing the IV
 * @returns A promise that resolves with encrypted components
 */
export async function encryptGCM(
    text: string,
    keyDerivationInfo: DerivedKeyInfo,
    iv: ArrayBuffer
): Promise<EncryptedComponents> {
    const crypto = getCrypto();
    const { rounds } = keyDerivationInfo;
    const ivArr = new Uint8Array(iv);
    const ivHex = arrayBufferToHexString(iv);
    const preparedContent = stringToArrayBuffer(text);
    // Import keys (only primary)
    // @ts-ignore
    const importedKey = await crypto.subtle.importKey(
        "raw",
        keyDerivationInfo.key,
        { name: ENC_ALGORITHM_GCM },
        /* not extractable: */ false,
        ["encrypt"]
    );
    // Encrypt content
    const cipherBufferRaw = await crypto.subtle.encrypt(
        {
            name: ENC_ALGORITHM_GCM,
            iv: ivArr,
            additionalData: stringToArrayBuffer(`${ivHex}${keyDerivationInfo.salt}`)
        },
        importedKey,
        preparedContent
    );
    // Extract auth tag
    const tagLengthBytes = GCM_AUTH_TAG_LENGTH / 8;
    const [cipherBuffer, tagBuffer] = extractAuthTag(cipherBufferRaw, tagLengthBytes);
    const tag = arrayBufferToHexString(tagBuffer);
    // Convert encrypted content to base64
    const cipherArr = new Uint8Array(cipherBuffer);
    const rawOutput = cipherArr.reduce((progress, byte) => {
        return progress + String.fromCharCode(byte);
    }, "");
    const encryptedContent = btoa(rawOutput);
    // Output encrypted components
    return {
        method: EncryptionType.GCM,
        iv: ivHex,
        salt: keyDerivationInfo.salt,
        rounds,
        content: encryptedContent,
        auth: tag
    };
}

function extractAuthTag(encryptedBuffer: ArrayBuffer, tagBytes: number): ArrayBuffer[] {
    const shortedEnc = encryptedBuffer.slice(0, encryptedBuffer.byteLength - tagBytes);
    const tagBuff = encryptedBuffer.slice(encryptedBuffer.byteLength - tagBytes);
    return [shortedEnc, tagBuff];
}

/**
 * IV generator
 * @returns A newly generated IV
 */
export async function generateIV(): Promise<ArrayBuffer> {
    const randArr = new Uint8Array(16);
    getCrypto().getRandomValues(randArr);
    return randArr.buffer;
}

/**
 * Generate a random salt
 * @param length The length of the string to generate
 * @returns A promise that resolves with a salt (hex)
 * @throws {Error} Rejects if length is invalid
 */
export async function generateSalt(length: number): Promise<string> {
    if (length <= 0) {
        throw new Error(`Failed generating salt: Invalid length supplied: ${length}`);
    }
    const crypto = getCrypto();
    let output = "";
    while (output.length < length) {
        const randArr = new Uint8Array(3);
        crypto.getRandomValues(randArr);
        const rawOutput = randArr.reduce((progress, byte) => {
            return progress + String.fromCharCode(byte);
        }, "");
        output += btoa(rawOutput);
        if (output.length > length) {
            output = output.substr(0, length);
        }
    }
    return output;
}

function getCrypto(): Crypto {
    // @ts-ignore // msCrypto not recognised
    return window.crypto || window.msCrypto;
}
