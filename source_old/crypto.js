"use strict";

const derivation = require("./derive.js");
const components = require("./components.js");
const packing = require("./packers.js");
const debug = require("./debug.js");

const lib = module.exports = {

    /**
     * Encrypt a string with derivation information
     * @param {String} text The text to encrypt
     * @param {DerivedKeyInfo} keyDerivationInfo The derived key information
     * @returns {Promise.<String>} An encrypted string
     */
    encrypt: function encrypt(text, keyDerivationInfo) {
        debug("encrypting content");
        const encryptor = components.getEncryptTool();
        return encryptor(text, keyDerivationInfo)
            .then(res => packing.packEncryptedContent(
                res.encryptedContent,
                res.iv,
                res.salt,
                res.hmac,
                res.rounds
            ));
    },

    /**
     * Encrypt some text using a file (filename or buffer)
     * @param {String} text The text to encrypt
     * @param {String|Buffer} filenameOrBuffer The filename or a buffer
     * @returns {Promise.<String>} A promise that resolves with the encrypted text
     */
    encryptWithKeyFile: function encryptWithKeyFile(text, filenameOrBuffer) {
        debug("encrypting using keyfile");
        return derivation
            .deriveFromFile(filenameOrBuffer)
            .then((keyDerivationInfo) => lib.encrypt(text, keyDerivationInfo));
    },

    /**
     * Encrypt a piece of text with a password
     * @param {String} text The text to encrypt
     * @param {String} password The password to use for encryption
     * @returns {Promise.<String>} A promise that resolves with the encrypted text
     */
    encryptWithPassword: function encryptWithPassword(text, password) {
        debug("encrypting using password");
        return derivation
            .deriveFromPassword(password)
            .then((keyDerivationInfo) => lib.encrypt(text, keyDerivationInfo));
    },

    /**
     * Decrypt an encrypted string
     * @param {EncryptedComponents} encryptedComponents The encrypted components to decrypt
     * @param {DerivedKeyInfo} keyDerivationInfo The derived key information
     * @returns {Promise.<String>} A promise that resolves with the decrypted text
     */
    decrypt: function decrypt(encryptedComponents, keyDerivationInfo) {
        debug("decrypting content");
        const tool = components.getDecryptTool();
        return tool(encryptedComponents, keyDerivationInfo);
    },

    /**
     * Decrypt some text using a key-file
     * @param {String} text The text to decrypt
     * @param {String|Buffer} file The file to use for key derivation (filename or contents buffer)
     * @returns {Promise.<String>} The decrypted text
     */
    decryptWithKeyFile: function decryptWithKeyFile(text, file) {
        debug("decrypting using keyfile");
        var encryptedComponents = packing.unpackEncryptedContent(text);
        return derivation
            .deriveFromFile(file, encryptedComponents.salt, encryptedComponents.rounds)
            .then((keyDerivationInfo) => lib.decrypt(encryptedComponents, keyDerivationInfo));
    },

    /**
     * Decrypt some text using a password
     * @param {String} text The text to decrypt
     * @param {String} password The password to use for decryption
     * @returns {Promise.<String>} The decrypted text
     */
    decryptWithPassword: function decryptWithPassword(text, password) {
        debug("decrypting using password");
        const encryptedComponents = packing.unpackEncryptedContent(text)
        return derivation
            .deriveFromPassword(password, encryptedComponents.salt, encryptedComponents.rounds)
            .then((keyDerivationInfo) => lib.decrypt(encryptedComponents, keyDerivationInfo));
    }

};
