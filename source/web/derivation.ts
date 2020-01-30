import {
    addHexSupportToArrayBuffer,
    concatArrayBuffers,
    hexStringToArrayBuffer,
    stringToArrayBuffer
} from "./shared";
import { DerivedKeyInfo, PBKDF2Function } from "../base/constructs";

const HMAC_KEY_SIZE = 32;
const PASSWORD_KEY_SIZE = 32;

function checkBrowserSupport() {
    if (!window.TextEncoder || !window.TextDecoder) {
        throw new Error("TextEncoder is not available");
    }
}

/**
 * Derive a key from a password
 * @param pbkdf2Gen The generator method
 * @param password The password to derive from
 * @param salt The salt
 * @param rounds The number of iterations
 * @param generateHMAC Enable HMAC key generation
 * @throws {Error} Rejects if no password is provided
 * @throws {Error} Rejects if no salt is provided
 * @throws {Error} Rejects if no rounds are provided
 * @returns A promise that resolves with derived key information
 */
export async function deriveFromPassword(
    pbkdf2Gen: PBKDF2Function,
    password: string,
    salt: string,
    rounds: number,
    generateHMAC: boolean = true
): Promise<DerivedKeyInfo> {
    if (!password) {
        throw new Error("Failed deriving key: Password must be provided");
    }
    if (!salt) {
        throw new Error("Failed deriving key: Salt must be provided");
    }
    if (!rounds || rounds <= 0) {
        throw new Error("Failed deriving key: Rounds must be greater than 0");
    }
    const bits = generateHMAC ? (PASSWORD_KEY_SIZE + HMAC_KEY_SIZE) * 8 : PASSWORD_KEY_SIZE * 8;
    const derivedKeyData = await pbkdf2Gen(password, salt, rounds, bits);
    const derivedKeyHex = derivedKeyData.toString("hex");
    const dkhLength = derivedKeyHex.length;
    const keyBuffer = generateHMAC
        ? hexStringToArrayBuffer(derivedKeyHex.substr(0, dkhLength / 2))
        : hexStringToArrayBuffer(derivedKeyHex);
    return {
        salt: salt,
        key: keyBuffer,
        rounds: rounds,
        hmac: generateHMAC
            ? hexStringToArrayBuffer(derivedKeyHex.substr(dkhLength / 2, dkhLength / 2))
            : null
    };
}

/**
 * The default PBKDF2 function
 * @param password The password to use
 * @param salt The salt to use
 * @param rounds The number of iterations
 * @param bits The size of the key to generate, in bits
 * @returns A Promise that resolves with the hash
 */
export async function pbkdf2(
    password: string,
    salt: string,
    rounds: number,
    bits: number
): Promise<ArrayBuffer> {
    checkBrowserSupport();
    const subtleCrypto = window.crypto.subtle;
    const params = {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: stringToArrayBuffer(salt),
        iterations: rounds
    };
    const bytes = bits / 8;
    const keysLen = bytes / 2;
    // @ts-ignore // `importKey` is not entirely working as what's described in TS
    const keyData = await subtleCrypto.importKey(
        "raw",
        stringToArrayBuffer(password),
        { name: "PBKDF2" },
        /* not extractable: */ false,
        ["deriveBits"]
    );
    const derivedData = await subtleCrypto.deriveBits(params, keyData, bits);
    const [key1, key2] = await Promise.all([
        subtleCrypto.importKey("raw", derivedData.slice(0, keysLen), "AES-CBC", true, [
            "encrypt",
            "decrypt"
        ]),
        subtleCrypto.importKey("raw", derivedData.slice(keysLen, keysLen * 2), "AES-CBC", true, [
            "encrypt",
            "decrypt"
        ])
    ]);
    const [rawKey1, rawKey2] = await Promise.all([
        subtleCrypto.exportKey("raw", key1),
        subtleCrypto.exportKey("raw", key2)
    ]);
    return addHexSupportToArrayBuffer(concatArrayBuffers([rawKey1, rawKey2]));
}
