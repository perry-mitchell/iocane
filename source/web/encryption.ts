import {
    arrayBufferToBase64,
    arrayBufferToHexString,
    arrayBufferToString,
    base64ToArrayBuffer,
    concatArrayBuffers,
    hexStringToArrayBuffer,
    stringToArrayBuffer
} from "./shared";
import {
    DerivedKeyInfo,
    EncryptedComponents,
    EncryptionType,
    EncryptedBinaryComponents
} from "../base/constructs";

const ENC_ALGORITHM_CBC = "AES-CBC";
const ENC_ALGORITHM_GCM = "AES-GCM";
const GCM_AUTH_TAG_LENGTH = 128;
const HMAC_ALGORITHM = "SHA-256";
const SIGN_ALGORITHM = "HMAC";

/**
 * Decrypt text using AES-CBC
 * @param encryptedComponents Encrypted components
 * @param keyDerivationInfo Key derivation information
 * @returns A promise that resolves with the decrypted string
 */
export async function decryptCBC(
    encryptedComponents: EncryptedComponents | EncryptedBinaryComponents,
    keyDerivationInfo: DerivedKeyInfo
): Promise<string | ArrayBuffer> {
    const crypto = getCrypto();
    // Extract the components
    const {
        auth: hmacDataRaw,
        content: encryptedContentRaw,
        iv: ivStr,
        salt
    } = encryptedComponents;
    const iv = hexStringToArrayBuffer(ivStr);
    const saltBuff = stringToArrayBuffer(salt);
    const hmacData = hexStringToArrayBuffer(hmacDataRaw);
    const textMode = typeof encryptedContentRaw === "string";
    const encryptedContent = textMode
        ? base64ToArrayBuffer(encryptedContentRaw as string)
        : encryptedContentRaw;
    // Import keys (primary & HMAC signing)
    // @ts-ignore
    const importedKey = await crypto.subtle.importKey(
        "raw",
        keyDerivationInfo.key,
        { name: ENC_ALGORITHM_CBC },
        /* not extractable: */ false,
        ["decrypt"]
    );
    // @ts-ignore
    const importedHMACKey = await crypto.subtle.importKey(
        "raw",
        keyDerivationInfo.hmac,
        {
            name: SIGN_ALGORITHM,
            hash: HMAC_ALGORITHM
        },
        /* not extractable: */ false,
        ["verify"]
    );
    // Verify authentication
    const signTargetPayload = textMode
        ? stringToArrayBuffer(`${encryptedContentRaw}${ivStr}${salt}`)
        : concatArrayBuffers([encryptedContent as ArrayBuffer, iv, saltBuff]);
    const hmacMatches = await crypto.subtle.verify(
        SIGN_ALGORITHM,
        importedHMACKey,
        hmacData,
        signTargetPayload
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
        encryptedContent as ArrayBuffer
    );
    return textMode ? arrayBufferToString(decrypted) : decrypted;
}

/**
 * Decrypt text using AES-GCM
 * @param encryptedComponents Encrypted components
 * @param keyDerivationInfo Key derivation information
 * @returns A promise that resolves with the decrypted string
 */
export async function decryptGCM(
    encryptedComponents: EncryptedComponents | EncryptedBinaryComponents,
    keyDerivationInfo: DerivedKeyInfo
): Promise<string | ArrayBuffer> {
    const crypto = getCrypto();
    // Extract the components
    const {
        auth: hmacDataRaw,
        content: encryptedContentRaw,
        iv: ivHex,
        salt
    } = encryptedComponents;
    const iv = hexStringToArrayBuffer(ivHex);
    const hmacData = hexStringToArrayBuffer(hmacDataRaw);
    const textMode = typeof encryptedContentRaw === "string";
    const encryptedContent = textMode
        ? concatArrayBuffers([base64ToArrayBuffer(encryptedContentRaw as string), hmacData])
        : concatArrayBuffers([encryptedContentRaw as ArrayBuffer, hmacData]);
    // Import key
    // @ts-ignore
    const importedKey = await crypto.subtle.importKey(
        "raw",
        keyDerivationInfo.key,
        { name: ENC_ALGORITHM_GCM },
        /* not extractable: */ false,
        ["decrypt"]
    );
    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
        {
            name: ENC_ALGORITHM_GCM,
            iv,
            additionalData: stringToArrayBuffer(`${ivHex}${salt}`)
        },
        importedKey,
        encryptedContent
    );
    return textMode ? arrayBufferToString(decrypted) : decrypted;
}

/**
 * Encrypt text using AES-CBC
 * @param text The text to encrypt
 * @param keyDerivationInfo Key derivation information
 * @param iv A buffer containing the IV
 * @returns A promise that resolves with encrypted components
 */
export async function encryptCBC(
    content: string | ArrayBuffer,
    keyDerivationInfo: DerivedKeyInfo,
    iv: ArrayBuffer
): Promise<EncryptedComponents | EncryptedBinaryComponents> {
    const crypto = getCrypto();
    const { rounds, salt } = keyDerivationInfo;
    const ivArr = new Uint8Array(iv);
    const ivHex = arrayBufferToHexString(iv);
    const textMode = typeof content === "string";
    const preparedContent = textMode ? stringToArrayBuffer(content as string) : content;
    // Import keys (primary & HMAC signing)
    // @ts-ignore
    const importedKey = await crypto.subtle.importKey(
        "raw",
        keyDerivationInfo.key,
        { name: ENC_ALGORITHM_CBC },
        /* extractable: */ false,
        ["encrypt"]
    );
    // @ts-ignore
    const importedHMACKey = await crypto.subtle.importKey(
        "raw",
        keyDerivationInfo.hmac,
        {
            name: SIGN_ALGORITHM,
            hash: HMAC_ALGORITHM
        },
        /* extractable: */ false,
        ["sign"]
    );
    // Encrypt content
    const cipherBuffer = await crypto.subtle.encrypt(
        {
            name: ENC_ALGORITHM_CBC,
            iv: ivArr
        },
        importedKey,
        preparedContent as ArrayBuffer
    );
    // Convert encrypted content to base64
    const encryptedContent = textMode ? arrayBufferToBase64(cipherBuffer) : cipherBuffer;
    // Sign content
    const signTargetStr = `${encryptedContent}${ivHex}${salt}`;
    const signatureBuffer = await window.crypto.subtle.sign(
        SIGN_ALGORITHM,
        importedHMACKey,
        stringToArrayBuffer(signTargetStr)
    );
    const hmacHex = arrayBufferToHexString(signatureBuffer);
    // Output encrypted components
    const output = {
        method: EncryptionType.CBC,
        auth: hmacHex,
        iv: ivHex,
        salt,
        rounds,
        content: encryptedContent
    };
    return textMode ? (output as EncryptedComponents) : (output as EncryptedBinaryComponents);
}

/**
 * Encrypt text using AES-GCM
 * @param text The text to encrypt
 * @param keyDerivationInfo Key derivation information
 * @param iv A buffer containing the IV
 * @returns A promise that resolves with encrypted components
 */
export async function encryptGCM(
    content: string | ArrayBuffer,
    keyDerivationInfo: DerivedKeyInfo,
    iv: ArrayBuffer
): Promise<EncryptedComponents | EncryptedBinaryComponents> {
    const crypto = getCrypto();
    const { rounds } = keyDerivationInfo;
    const ivArr = new Uint8Array(iv);
    const ivHex = arrayBufferToHexString(iv);
    const textMode = typeof content === "string";
    const preparedContent = textMode ? stringToArrayBuffer(content as string) : content;
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
        preparedContent as ArrayBuffer
    );
    // Extract auth tag
    const tagLengthBytes = GCM_AUTH_TAG_LENGTH / 8;
    const [cipherBuffer, tagBuffer] = extractAuthTag(cipherBufferRaw, tagLengthBytes);
    const tag = arrayBufferToHexString(tagBuffer);
    // Convert encrypted content to base64
    const encryptedContent = textMode ? arrayBufferToBase64(cipherBuffer) : cipherBuffer;
    // Output encrypted components
    const output = {
        method: EncryptionType.GCM,
        iv: ivHex,
        salt: keyDerivationInfo.salt,
        rounds,
        content: encryptedContent,
        auth: tag
    };
    return textMode ? (output as EncryptedComponents) : (output as EncryptedBinaryComponents);
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
