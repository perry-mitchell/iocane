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
import { DecryptionFunction, EncryptionFunction, EncryptionType, IVGenerationFunction, KeyDerivationFunction, SaltGenerationFunction } from "./constructs";

interface ConfigurationOptions {
    /**
     * AES-CBC decryption function
     */
    decryption_cbc: DecryptionFunction,
    /**
     * AES-GCM decryption function
     */
    decryption_gcm: DecryptionFunction,
    /**
     * Default number of key derivation iterations
     */
    derivationRounds: number,
    /**
     * Keys derivation function
     */
    deriveKey: KeyDerivationFunction,
    /**
     * AES-CBC encryption function
     */
    encryption_cbc: EncryptionFunction,
    /**
     * AES-GCM encryption function
     */
    encryption_gcm: EncryptionFunction,
    /**
     * Random IV generation function
     */
    generateIV: IVGenerationFunction,
    /**
     * Random salt generation function
     */
    generateSalt: SaltGenerationFunction,
    /**
     * The encryption method - cbc/gcm
     */
    method: EncryptionType,
    /**
     * Salt character length
     */
    saltLength: number
}

const DERIVED_KEY_ITERATIONS = 250000;
const METHODS = [EncryptionType.CBC, EncryptionType.GCM];
const SALT_LENGTH = 12;

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
    overrideDecryption(method: EncryptionType, func?: DecryptionFunction): Configuration {
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
    overrideEncryption(method: EncryptionType, func?: EncryptionFunction): Configuration {
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
    overrideIVGeneration(func?: IVGenerationFunction): Configuration {
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
    overrideKeyDerivation(func?: KeyDerivationFunction): Configuration {
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
    overrideSaltGeneration(func?: SaltGenerationFunction): Configuration {
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
     * @example
     *  config.setDerivationRounds(250000);
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
     * @example
     *  config.use("gcm");
     */
    use(method: EncryptionType): Configuration {
        validateEncryptionMethod(method);
        this._options.method = method;
        return this;
    }
}
