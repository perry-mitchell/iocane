import {
    arrayBufferToHexString,
    concatArrayBuffers,
    hexStringToArrayBuffer,
    stringToArrayBuffer
} from "./tools";
import { HMAC_KEY_SIZE, PASSWORD_KEY_SIZE } from "../symbols";
import { DerivedKeyInfo } from "../types";

function checkBrowserSupport() {
    if (!window.TextEncoder || !window.TextDecoder) {
        throw new Error("TextEncoder is not available");
    }
}

export async function deriveKeyFromPassword(
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
    const derivedKeyData = await pbkdf2(password, salt, rounds, bits);
    const derivedKeyHex = arrayBufferToHexString(derivedKeyData);
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

async function pbkdf2(
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
    return concatArrayBuffers([rawKey1, rawKey2]);
}
