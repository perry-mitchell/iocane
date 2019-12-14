import { pbkdf2 } from "./derivation";
import {
    decryptCBC,
    decryptGCM,
    encryptCBC,
    encryptGCM,
    generateIV,
    generateSalt
} from "./encryption";
import { ALGO_DEFAULT } from "./shared";
import { EncryptionType } from "./constructs";

interface ConfigurationOptions {
    decryption_cbc: Function,
    decryption_gcm: Function,
    derivationRounds: number,
    deriveKey: Function,
    encryption_cbc: Function,
    encryption_gcm: Function,
    generateIV: Function,
    generateSalt: Function,
    method: EncryptionType,
    saltLength: number
}

const DERIVED_KEY_ITERATIONS = 250000;
const METHODS = [EncryptionType.CBC, EncryptionType.GCM];
const SALT_LENGTH = 12;

// /**
//  * @typedef {Object} ConfigurationOptions
//  * @property {Function} decryption_cbc - The CBC decryption method
//  * @property {Function} decryption_gcm - The GCM decryption method
//  * @property {Number} derivationRounds - The number of key derivation iterations
//  * @property {Function} deriveKey - The key derivation function (default: PBKDF2)
//  * @property {Function} encryption_cbc - The CBC encryption method
//  * @property {Function} encryption_gcm - The GCM encryption method
//  * @property {Function} generateIV - The IV generation method
//  * @property {Function} generateSalt - The salt generation method
//  * @property {String} method - The encryption method (cbc/gcm)
//  * @property {Number} saltLength - The length of the salt
//  */

/**
 * Get the default options
 * @returns Default configuration options
 */
function getDefaultOptions(): ConfigurationOptions {
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

/**
 * Validate an encryption method specification
 * @param method The method to validate
 * @throws {Error} Throws if the method is not valid
 */
function validateEncryptionMethod(method: EncryptionType) {
    if (METHODS.indexOf(method) === -1) {
        throw new Error(`Invalid encryption/decryption method: ${method}`);
    }
}

/**
 * System configuration
 */
export class Configuration {
    static getDefaultOptions = getDefaultOptions;

    _options = getDefaultOptions();

    /**
     * Configuration options
     * @memberof Configuration
     * @readonly
     */
    get options(): ConfigurationOptions {
        return Object.assign({}, this._options);
    }

    /**
     * Override the decryption method
     * @param method Which encryption type to override (cbc/gcm)
     * @param func A decryption function that should resemble that in the example
     * @returns Returns self
     * @memberof Configuration
     * @example
     *  config.overrideDecryption("cbc", (encryptedComponents, keyDerivationInfo) => {
     *    // handle decryption
     *    // return Promise
     *  });
     */
    overrideDecryption(method: EncryptionType, func?: Function): Configuration {
        validateEncryptionMethod(method);
        this._options[`decryption_${method}`] = func || getDefaultOptions()[`decryption_${method}`];
        return this;
    }

    /**
     * Override the encryption method
     * @param method Which encryption type to override (cbc/gcm)
     * @param func A encryption function that should resemble that in the example
     * @returns Returns self
     * @memberof Configuration
     * @example
     *  config.overrideEncryption("cbc", (text, keyDerivationInfo, ivBuffer) => {
     *    // handle encryption
     *    // return Promise
     *  });
     */
    overrideEncryption(method: EncryptionType, func?: Function): Configuration {
        validateEncryptionMethod(method);
        this._options[`encryption_${method}`] = func || getDefaultOptions()[`encryption_${method}`];
        return this;
    }

    /**
     * Override the IV generator
     * @param func The override function
     * @returns Returns self
     * @memberof Configuration
     * @example
     *  config.overrideIVGeneration(() => {
     *    return Promise.resolve(ivBuffer);
     *  });
     */
    overrideIVGeneration(func?: Function): Configuration {
        this._options.generateIV = func || getDefaultOptions().generateIV;
        return this;
    }

    /**
     * Override key derivation
     * Derive the key according to the `pbkdf2` function in derivation.js
     * @param func The new key derivation function
     * @returns Returns self
     * @memberof Configuration
     * @example
     *  config.overrideKeyDerivation((password, salt, rounds, bits) => {
     *    return Promise.resolve(derivedKeyBuffer);
     *  });
     */
    overrideKeyDerivation(func?: Function): Configuration {
        this._options.deriveKey = func || getDefaultOptions().deriveKey;
        return this;
    }

    /**
     * Override salt generation
     * @param func The function to use for salt generation
     * @returns Returns self
     * @memberof Configuration
     * @example
     *  config.overrideSaltGeneration(length => {
     *    return Promise.resolve(saltText);
     *  });
     */
    overrideSaltGeneration(func?: Function): Configuration {
        this._options.generateSalt = func || getDefaultOptions().generateSalt;
        return this;
    }

    /**
     * Reset the configuration options
     * @memberof Configuration
     * @returns Returns self
     */
    reset(): Configuration {
        this._options = getDefaultOptions();
        return this;
    }

    /**
     * Set the derivation rounds to use
     * @param rounds The new rounds to use (empty for reset)
     * @returns Returns self
     * @memberof Configuration
     */
    setDerivationRounds(rounds?: number): Configuration {
        if (typeof rounds === "undefined") {
            this._options.derivationRounds = DERIVED_KEY_ITERATIONS;
        } else if (typeof rounds === "number") {
            this._options.derivationRounds = rounds;
        }
        return this;
    }

    /**
     * Set the encryption method to use
     * @param method The method to use (cbc/gcm)
     * @returns Returns self
     * @memberof Configuration
     */
    use(method: EncryptionType): Configuration {
        validateEncryptionMethod(method);
        this._options.method = method;
        return this;
    }
}
