const { pbkdf2 } = require("./derivation.js");
const { encryptCBC, decryptCBC, generateIV, generateSalt } = require("./encryption.js");
const { ALGO_DEFAULT } = require("./shared.js");

const DERIVED_KEY_ALGORITHM = "sha256";
const DERIVED_KEY_ITERATIONS_MIN = 200000;
const DERIVED_KEY_ITERATIONS_MAX = 250000;
const METHODS = ["cbc", "gcm"];
const SALT_LENGTH = 12;

function getDefaultOptions() {
    return {
        decryption: {
            cbc: decryptCBC
        },
        derivationMax: DERIVED_KEY_ITERATIONS_MAX,
        derivationMin: DERIVED_KEY_ITERATIONS_MIN,
        encryption: {
            cbc: encryptCBC
        },
        generateIV,
        generateSalt,
        method: ALGO_DEFAULT,
        pbkdf2,
        pbkdf2Algorithm: DERIVED_KEY_ALGORITHM,
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
        this._options.decryption[method] = func  || getDefaultOptions().decryption[method];
        return this;
    }

    overrideEncryption(method) {
        validateEncryptionMethod(method);
        this._options.encryption[method] = func || getDefaultOptions().encryption[method];
        return this;
    }

    overrideIVGeneration(method) {
        this._options.generateIV = method || getDefaultOptions().generateIV;
        return this;
    }

    overrideKeyDerivation(method) {
        this._options.pbkdf2 = method || getDefaultOptions().pbkdf2;
        return this;
    }

    overrideSaltGeneration(method) {
        this._options.generateSalt = method || getDefaultOptions().generateSalt;
        return this;
    }

    reset() {
        this._options = getDefaultOptions();
        return this;
    }

    setDerivationRounds(min, max) {
        if (typeof min === "number") {
            this._options.derivationMin = min;
        }
        if (typeof max === "number") {
            this._options.derivationMax = max;
        }
        return this;
    }

    use(method) {
        validateEncryptionMethod(method);
        this._options.method = method;
        return this;
    }
}

module.exports = Configuration;
