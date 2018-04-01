const Configuration = require("./Configuration.js");
const { getConfiguration } = require("./global.js");
const { deriveFromPassword } = require("./derivation.js");
const { packEncryptedContent, unpackEncryptedContent } = require("./packing.js");

class Session extends Configuration {
    constructor() {
        super();
        // Get options from global
        this._options = Object.assign({}, getConfiguration().options);
    }

    decrypt(text, password) {
        const encryptedComponents = unpackEncryptedContent(text);
        const {
            salt,
            rounds,
            method
        } = encryptedComponents;
        const decryptMethod = this.options[`decryption_${method}`];
        return this.deriveKey(password, salt, rounds, method)
            .then(keyDerivationInfo => decryptMethod(encryptedComponents, keyDerivationInfo));
    }

    deriveKey(password, salt, rounds, encryptionMethod) {
        const { derivationRounds, deriveKey, method: optionsMethod } = this.options;
        const method = encryptionMethod || optionsMethod;
        const deriveKeyCall = method === "gcm" ?
            () => deriveFromPassword(deriveKey, password, salt, rounds || derivationRounds, /* HMAC: */ false) :
            () => deriveFromPassword(deriveKey, password, salt, rounds || derivationRounds);
        return deriveKeyCall();
    }

    deriveNewKey(password) {
        const { generateSalt, saltLength } = this.options;
        return generateSalt(saltLength)
            .then(salt => this.deriveKey(password, salt));
    }

    encrypt(text, password) {
        const { method } = this.options;
        const encryptMethod = this.options[`encryption_${method}`];
        return this.deriveNewKey(password)
            .then(keyDerivationInfo => encryptMethod(text, keyDerivationInfo))
            .then(encryptedComponents => {
                const { content, iv, salt, rounds, mode, auth } = encryptedComponents;
                return packEncryptedContent(content, iv, salt, auth, rounds, method);
            });
    }
}

module.exports = Session;
