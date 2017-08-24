"use strict";

var derivation = require("./derive.js"),
    components = require("./components.js"),
    packing = require("./packers.js"),
    debug = require("./debug.js");

var lib = module.exports = {

    /**
     * Encrypt a string with derivation information
     * @param {String} text The text to encrypt
     * @param {DerivedKeyInfo} keyDerivationInfo The derived key information
     * @returns {String} An encrypted string
     */
    encrypt: function encrypt(text, keyDerivationInfo) {
        debug("encrypt content");
        var encryptor = components.getEncryptTool();
        var res = encryptor(text, keyDerivationInfo);
        return packing.packEncryptedContent(
            res.encryptedContent,
            res.iv,
            res.salt,
            res.hmac,
            res.rounds
        );
    },

    /**
     * Encrypt some text using a file (filename or buffer)
     * @param {String} text The text to encrypt
     * @param {String|Buffer} filenameOrBuffer The filename or a buffer
     * @returns {Promise.<String>} A promise that resolves with the encrypted text
     */
    encryptWithKeyFile: function encryptWithKeyFile(text, filenameOrBuffer) {
        debug("encrypt using keyfile");
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
        debug("encrypt using password");
        return derivation
            .deriveFromPassword(password)
            .then((keyDerivationInfo) => lib.encrypt(text, keyDerivationInfo));
    },

    /**
     * Decrypt an encrypted string
     * @param {EncryptedComponents} encryptedComponents The encrypted components to decrypt
     * @param {DerivedKeyInfo} keyDerivationInfo The derived key information
     * @returns {String} The decrypted text
     */
    decrypt: function decrypt(encryptedComponents, keyDerivationInfo) {
        debug("decrypt content");
        var tool = components.getDecryptTool()
        return tool(encryptedComponents, keyDerivationInfo);
    },

    /**
     * Decrypt some text using a key-file
     * @param {String} text The text to decrypt
     * @param {String|Buffer} file The file to use for key derivation (filename or contents buffer)
     * @returns {Promise.<String>} The decrypted text
     */
    decryptWithKeyFile: function decryptWithKeyFile(text, file) {
        debug("decrypt using keyfile");
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
    decryptWithPassword: function(text, password) {
        debug("decrypt using password");
        var encryptedComponents = packing.unpackEncryptedContent(text)
        return derivation
            .deriveFromPassword(password, encryptedComponents.salt, encryptedComponents.rounds)
            .then((keyDerivationInfo) => lib.decrypt(encryptedComponents, keyDerivationInfo));
    }

};
