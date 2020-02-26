import * as crypto from "crypto";
import { constantTimeCompare } from "../base/timing";
import { ENC_ALGORITHM_CBC, ENC_ALGORITHM_GCM, HMAC_ALGORITHM } from "../base/shared";
import {
    DerivedKeyInfo,
    EncryptedComponents,
    EncryptionType,
    EncryptedBinaryComponents
} from "../types";

/**
 * Decrypt text using AES-CBC
 * @param encryptedComponents Encrypted components
 * @param keyDerivationInfo Key derivation information
 * @returns A promise that resolves with the decrypted string
 */
export async function decryptCBC(
    encryptedComponents: EncryptedComponents | EncryptedBinaryComponents,
    keyDerivationInfo: DerivedKeyInfo
): Promise<string | Buffer> {
    // Extract the components
    const encryptedContent = encryptedComponents.content;
    const iv = Buffer.from(encryptedComponents.iv, "hex");
    const salt = encryptedComponents.salt;
    const hmacData = encryptedComponents.auth;
    // Get HMAC tool
    const hmacTool = crypto.createHmac(HMAC_ALGORITHM, keyDerivationInfo.hmac as Buffer);
    // Generate the HMAC
    hmacTool.update(
        typeof encryptedContent === "string"
            ? (encryptedContent as string)
            : (encryptedContent as Buffer)
    );
    hmacTool.update(encryptedComponents.iv);
    hmacTool.update(salt);
    const newHmaxHex = hmacTool.digest("hex");
    // Check hmac for tampering
    if (constantTimeCompare(hmacData, newHmaxHex) !== true) {
        throw new Error("Authentication failed while decrypting content");
    }
    // Decrypt
    const decryptTool = crypto.createDecipheriv(
        ENC_ALGORITHM_CBC,
        keyDerivationInfo.key as Buffer,
        iv
    );
    if (typeof encryptedContent === "string") {
        const decryptedText = decryptTool.update(encryptedContent, "base64", "utf8");
        return `${decryptedText}${decryptTool.final("utf8")}`;
    }
    return Buffer.concat([decryptTool.update(encryptedContent as Buffer), decryptTool.final()]);
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
): Promise<string | Buffer> {
    // Extract the components
    const encryptedContent = encryptedComponents.content;
    const iv = Buffer.from(encryptedComponents.iv, "hex");
    const { auth: tagHex } = encryptedComponents;
    // Prepare tool
    const decryptTool = crypto.createDecipheriv(
        ENC_ALGORITHM_GCM,
        keyDerivationInfo.key as Buffer,
        iv
    );
    // Add additional auth data
    decryptTool.setAAD(Buffer.from(`${encryptedComponents.iv}${keyDerivationInfo.salt}`, "utf8"));
    // Set auth tag
    decryptTool.setAuthTag(Buffer.from(tagHex, "hex"));
    // Perform decryption
    if (typeof encryptedContent === "string") {
        const decryptedText = decryptTool.update(encryptedContent, "base64", "utf8");
        return `${decryptedText}${decryptTool.final("utf8")}`;
    }
    return Buffer.concat([decryptTool.update(encryptedContent as Buffer), decryptTool.final()]);
}

/**
 * Encrypt text using AES-CBC
 * @param text The text to encrypt
 * @param keyDerivationInfo Key derivation information
 * @param iv A buffer containing the IV
 * @returns A promise that resolves with encrypted components
 */
export async function encryptCBC(
    content: string | Buffer,
    keyDerivationInfo: DerivedKeyInfo,
    iv: Buffer
): Promise<EncryptedComponents | EncryptedBinaryComponents> {
    const ivHex = iv.toString("hex");
    const encryptTool = crypto.createCipheriv(
        ENC_ALGORITHM_CBC,
        keyDerivationInfo.key as Buffer,
        iv
    );
    const hmacTool = crypto.createHmac(HMAC_ALGORITHM, keyDerivationInfo.hmac as Buffer);
    const { rounds } = keyDerivationInfo;
    // Perform encryption
    let encryptedContent =
        typeof content === "string"
            ? encryptTool.update(content, "utf8", "base64")
            : encryptTool.update(content);
    if (typeof content === "string") {
        encryptedContent += encryptTool.final("base64");
    } else {
        encryptedContent = Buffer.concat([encryptedContent as Buffer, encryptTool.final()]);
    }
    // Generate hmac
    hmacTool.update(encryptedContent);
    hmacTool.update(ivHex);
    hmacTool.update(keyDerivationInfo.salt);
    const hmacHex = hmacTool.digest("hex");
    // Output encrypted components
    const output = {
        method: EncryptionType.CBC,
        auth: hmacHex,
        iv: ivHex,
        salt: keyDerivationInfo.salt,
        rounds,
        content: encryptedContent
    };
    return typeof content === "string"
        ? (output as EncryptedComponents)
        : (output as EncryptedBinaryComponents);
}

/**
 * Encrypt text using AES-GCM
 * @param text The text to encrypt
 * @param keyDerivationInfo Key derivation information
 * @param iv A buffer containing the IV
 * @returns A promise that resolves with encrypted components
 */
export async function encryptGCM(
    content: string | Buffer,
    keyDerivationInfo: DerivedKeyInfo,
    iv: Buffer
): Promise<EncryptedComponents | EncryptedBinaryComponents> {
    const ivHex = iv.toString("hex");
    const { rounds } = keyDerivationInfo;
    const encryptTool = crypto.createCipheriv(
        ENC_ALGORITHM_GCM,
        keyDerivationInfo.key as Buffer,
        iv
    );
    // Add additional auth data
    encryptTool.setAAD(Buffer.from(`${ivHex}${keyDerivationInfo.salt}`, "utf8"));
    // Perform encryption
    let encryptedContent =
        typeof content === "string"
            ? encryptTool.update(content, "utf8", "base64")
            : encryptTool.update(content);
    if (typeof content === "string") {
        encryptedContent += encryptTool.final("base64");
    } else {
        encryptedContent = Buffer.concat([encryptedContent as Buffer, encryptTool.final()]);
    }
    // Handle authentication
    const tag = encryptTool.getAuthTag();
    // Output encrypted components
    const output = {
        method: EncryptionType.GCM,
        iv: ivHex,
        salt: keyDerivationInfo.salt,
        rounds,
        content: encryptedContent,
        auth: tag.toString("hex")
    };
    return typeof content === "string"
        ? (output as EncryptedComponents)
        : (output as EncryptedBinaryComponents);
}

/**
 * IV generator
 * @returns A newly generated IV
 */
export async function generateIV(): Promise<Buffer> {
    return Buffer.from(crypto.randomBytes(16));
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
    let output = "";
    while (output.length < length) {
        output += crypto.randomBytes(3).toString("base64");
        if (output.length > length) {
            output = output.substr(0, length);
        }
    }
    return output;
}
