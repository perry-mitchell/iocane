const { pbkdf2 } = require("./derivation.js");
const { decryptCBC, decryptGCM, encryptCBC, encryptGCM, generateIV, generateSalt } = require("./encryption.js");
const { ALGO_DEFAULT } = require("./shared.js");

const DERIVED_KEY_ITERATIONS = 250000;
const METHODS = ["cbc", "gcm"];
const SALT_LENGTH = 12;

/**
 * @typedef {Object} ConfigurationOptions
 * @property {Function} decryption_cbc - The CBC decryption method
 * @property {Function} decryption_gcm - The GCM decryption method
 * @property {Number} derivationRounds - The number of key derivation iterations
 * @property {Function} deriveKey - The key derivation function (default: PBKDF2)
 * @property {Function} encryption_cbc - The CBC encryption method
 * @property {Function} encryption_gcm - The GCM encryption method
 * @property {Function} generateIV - The IV generation method
 * @property {Function} generateSalt - The salt generation method
 * @property {String} method - The encryption method (cbc/gcm)
 * @property {Number} saltLength - The length of the salt
 */

/**
 * Get the default options
 * @static
 * @returns {ConfigurationOptions} Default configuration options
 * @memberof Configuration
 */
function getDefaultOptions() {
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
 * @param {String} method The method to validate
 * @throws {Error} Throws if the method is not valid
 * @private
 */
function validateEncryptionMethod(method) {
    if (METHODS.indexOf(method) === -1) {
        throw new Error(`Invalid encryption/decryption method: ${method}`);
    }
}

class Configuration {
    constructor() {
        this._options = getDefaultOptions();
    }

    get options() {
        return Object.assign({}, this._options);
    }

    overrideDecryption(method, func) {
        validateEncryptionMethod(method);
        this._options[`decryption_${method}`] = func || getDefaultOptions()[`decryption_${method}`];
        return this;
    }

    overrideEncryption(method, func) {
        validateEncryptionMethod(method);
        this._options[`encryption_${method}`] = func || getDefaultOptions()[`encryption_${method}`];
        return this;
    }

    overrideIVGeneration(func) {
        this._options.generateIV = func || getDefaultOptions().generateIV;
        return this;
    }

    overrideKeyDerivation(func) {
        this._options.deriveKey = func || getDefaultOptions().deriveKey;
        return this;
    }

    overrideSaltGeneration(func) {
        this._options.generateSalt = func || getDefaultOptions().generateSalt;
        return this;
    }

    reset() {
        this._options = getDefaultOptions();
        return this;
    }

    setDerivationRounds(rounds) {
        if (typeof rounds === "number") {
            this._options.derivationRounds = rounds;
        }
        return this;
    }

    use(method) {
        validateEncryptionMethod(method);
        this._options.method = method;
        return this;
    }
}

Configuration.getDefaultOptions = getDefaultOptions;

module.exports = Configuration;
