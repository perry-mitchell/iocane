const { pbkdf2 } = require("./derivation.js");
const { encryptCBC, decryptCBC, generateIV, generateSalt } = require("./encryption.js");
const { ALGO_DEFAULT } = require("./shared.js");

const DERIVED_KEY_ALGORITHM = "sha256";
const DERIVED_KEY_ITERATIONS = 250000;
const METHODS = ["cbc", "gcm"];
const SALT_LENGTH = 12;

function getDefaultOptions() {
    return {
        decryption: {
            cbc: decryptCBC
        },
        derivationRounds: DERIVED_KEY_ITERATIONS,
        deriveKey: pbkdf2,
        deriveKeyAlgorithm: DERIVED_KEY_ALGORITHM,
        encryption: {
            cbc: encryptCBC
        },
        generateIV,
        generateSalt,
        method: ALGO_DEFAULT,
        saltLength: SALT_LENGTH
    };
}

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
        this._options.decryption[method] = func || getDefaultOptions().decryption[method];
        return this;
    }

    overrideEncryption(method, func) {
        validateEncryptionMethod(method);
        this._options.encryption[method] = func || getDefaultOptions().encryption[method];
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
