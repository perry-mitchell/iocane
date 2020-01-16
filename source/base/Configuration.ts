import {
    ConfigurationOptions,
    DecryptionFunction,
    EncryptionFunction,
    EncryptionType,
    IVGenerationFunction,
    KeyDerivationFunction,
    SaltGenerationFunction
} from "./constructs";
import { DERIVED_KEY_ITERATIONS } from "./shared";

const METHODS = [EncryptionType.CBC, EncryptionType.GCM];

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
    constructor(options: ConfigurationOptions) {
        this._baseOptions = Object.assign({}, options);
        this._options = options;
    }

    _baseOptions: ConfigurationOptions;
    _options: ConfigurationOptions;

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
    overrideDecryption(method: EncryptionType, func?: DecryptionFunction): this {
        validateEncryptionMethod(method);
        this._options[`decryption_${method}`] = func || this._baseOptions[`decryption_${method}`];
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
    overrideEncryption(method: EncryptionType, func?: EncryptionFunction): this {
        validateEncryptionMethod(method);
        this._options[`encryption_${method}`] = func || this._baseOptions[`encryption_${method}`];
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
    overrideIVGeneration(func?: IVGenerationFunction): this {
        this._options.generateIV = func || this._baseOptions.generateIV;
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
    overrideKeyDerivation(func?: KeyDerivationFunction): this {
        this._options.deriveKey = func || this._baseOptions.deriveKey;
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
    overrideSaltGeneration(func?: SaltGenerationFunction): this {
        this._options.generateSalt = func || this._baseOptions.generateSalt;
        return this;
    }

    /**
     * Reset the configuration options
     * @memberof Configuration
     * @returns Returns self
     */
    reset(): this {
        this._options = this._baseOptions;
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
    setDerivationRounds(rounds?: number): this {
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
    use(method: EncryptionType): this {
        validateEncryptionMethod(method);
        this._options.method = method;
        return this;
    }
}
