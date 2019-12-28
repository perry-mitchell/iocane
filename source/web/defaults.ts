import { pbkdf2 } from "./derivation";
import {
    decryptCBC,
    decryptGCM,
    encryptCBC,
    encryptGCM,
    generateIV,
    generateSalt
} from "../node/encryption";
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
        deriveKey: pbkdf2,
        encryption_cbc: encryptCBC,
        encryption_gcm: encryptGCM,
        generateIV,
        generateSalt,
        method: ALGO_DEFAULT,
        saltLength: SALT_LENGTH
    };
}
