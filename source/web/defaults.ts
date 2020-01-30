import { deriveFromPassword, pbkdf2 } from "./derivation";
import {
    decryptCBC,
    decryptGCM,
    encryptCBC,
    encryptGCM,
    generateIV,
    generateSalt
} from "./encryption";
import {
    packEncryptedData,
    packEncryptedText,
    unpackEncryptedData,
    unpackEncryptedText
} from "./packing";
import { ALGO_DEFAULT, DERIVED_KEY_ITERATIONS } from "../base/shared";
import { ConfigurationOptions } from "../base/constructs";

const SALT_LENGTH = 12;

/**
 * Get the default options
 * @returns Default configuration options
 */
export function getDefaultOptions(): ConfigurationOptions {
    return {
        decryption_cbc: decryptCBC,
        decryption_gcm: decryptGCM,
        derivationRounds: DERIVED_KEY_ITERATIONS,
        deriveKey: deriveFromPassword,
        encryption_cbc: encryptCBC,
        encryption_gcm: encryptGCM,
        generateIV,
        generateSalt,
        method: ALGO_DEFAULT,
        pack_data: packEncryptedData,
        pack_text: packEncryptedText,
        pbkdf2,
        saltLength: SALT_LENGTH,
        unpack_data: unpackEncryptedData,
        unpack_text: unpackEncryptedText
    };
}
