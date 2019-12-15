import * as crypto from "crypto";
import { constantTimeCompare } from "./timing";
import { DerivedKeyInfo, EncryptedComponents, EncryptionType } from "./constructs";

const ENC_ALGORITHM_CBC = "aes-256-cbc";
const ENC_ALGORITHM_GCM = "aes-256-gcm";
const HMAC_ALGORITHM = "sha256";

/**
 * Decrypt text using AES-CBC
 * @param encryptedComponents Encrypted components
 * @param keyDerivationInfo Key derivation information
 * @returns A promise that resolves with the decrypted string
 */
export async function decryptCBC(encryptedComponents: EncryptedComponents, keyDerivationInfo: DerivedKeyInfo): Promise<String> {
    // Extract the components
    const encryptedContent = encryptedComponents.content;
    const iv = new Buffer(encryptedComponents.iv, "hex");
    const salt = encryptedComponents.salt;
    const hmacData = encryptedComponents.auth;
    // Get HMAC tool
    const hmacTool = crypto.createHmac(HMAC_ALGORITHM, keyDerivationInfo.hmac);
    // Generate the HMAC
    hmacTool.update(encryptedContent);
    hmacTool.update(encryptedComponents.iv);
    hmacTool.update(salt);
    const newHmaxHex = hmacTool.digest("hex");
    // Check hmac for tampering
    if (constantTimeCompare(hmacData, newHmaxHex) !== true) {
        throw new Error("Authentication failed while decrypting content");
    }
    // Decrypt
    const decryptTool = crypto.createDecipheriv(ENC_ALGORITHM_CBC, keyDerivationInfo.key, iv);
    const decryptedText = decryptTool.update(encryptedContent, "base64", "utf8");
    return `${decryptedText}${decryptTool.final("utf8")}`;
}

/**
 * Decrypt text using AES-GCM
 * @param encryptedComponents Encrypted components
 * @param keyDerivationInfo Key derivation information
 * @returns A promise that resolves with the decrypted string
 */
export async function decryptGCM(encryptedComponents: EncryptedComponents, keyDerivationInfo: DerivedKeyInfo): Promise<String> {
    // Extract the components
    const encryptedContent = encryptedComponents.content;
    const iv = new Buffer(encryptedComponents.iv, "hex");
    const { auth: tagHex } = encryptedComponents;
    // Prepare tool
    const decryptTool = crypto.createDecipheriv(ENC_ALGORITHM_GCM, keyDerivationInfo.key, iv);
    // Add additional auth data
    decryptTool.setAAD(new Buffer(`${encryptedComponents.iv}${keyDerivationInfo.salt}`, "utf8"));
    // Set auth tag
    decryptTool.setAuthTag(new Buffer(tagHex, "hex"));
    // Perform decryption
    const decryptedText = decryptTool.update(encryptedContent, "base64", "utf8");
    return `${decryptedText}${decryptTool.final("utf8")}`;
}

/**
 * Encrypt text using AES-CBC
 * @param text The text to encrypt
 * @param keyDerivationInfo Key derivation information
 * @param iv A buffer containing the IV
 * @returns A promise that resolves with encrypted components
 */
export async function encryptCBC(text: string, keyDerivationInfo: DerivedKeyInfo, iv: Buffer): Promise<EncryptedComponents> {
    const ivHex = iv.toString("hex");
    const encryptTool = crypto.createCipheriv(ENC_ALGORITHM_CBC, keyDerivationInfo.key, iv);
    const hmacTool = crypto.createHmac(HMAC_ALGORITHM, keyDerivationInfo.hmac);
    const { rounds } = keyDerivationInfo;
    // Perform encryption
    let encryptedContent = encryptTool.update(text, "utf8", "base64");
    encryptedContent += encryptTool.final("base64");
    // Generate hmac
    hmacTool.update(encryptedContent);
    hmacTool.update(ivHex);
    hmacTool.update(keyDerivationInfo.salt);
    const hmacHex = hmacTool.digest("hex");
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
export async function encryptGCM(text: string, keyDerivationInfo: DerivedKeyInfo, iv: Buffer): Promise<EncryptedComponents> {
    const ivHex = iv.toString("hex");
    const { rounds } = keyDerivationInfo;
    const encryptTool = crypto.createCipheriv(ENC_ALGORITHM_GCM, keyDerivationInfo.key, iv);
    // Add additional auth data
    encryptTool.setAAD(new Buffer(`${ivHex}${keyDerivationInfo.salt}`, "utf8"));
    // Perform encryption
    let encryptedContent = encryptTool.update(text, "utf8", "base64");
    encryptedContent += encryptTool.final("base64");
    // Handle authentication
    const tag = encryptTool.getAuthTag();
    // Output encrypted components
    return {
        method: EncryptionType.GCM,
        iv: ivHex,
        salt: keyDerivationInfo.salt,
        rounds,
        content: encryptedContent,
        auth: tag.toString("hex")
    };
}

/**
 * IV generator
 * @returns A newly generated IV
 */
export async function generateIV(): Promise<Buffer> {
    return new Buffer(crypto.randomBytes(16));
}

/**
 * Generate a random salt
 * @param length The length of the string to generate
 * @returns A promise that resolves with a salt (hex)
 * @throws {Error} Rejects if length is invalid
 */
export async function generateSalt(length: number): Promise<String> {
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
