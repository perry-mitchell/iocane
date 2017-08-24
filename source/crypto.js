"use strict";

var derivation = require("./derive.js"),
    components = require("./components.js"),
    packing = require("./packers.js"),
    debug = require("./debug.js");

var lib = module.exports = {

    encrypt: function(text, keyDerivationInfo) {
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
     * @param {string} text The text to encrypt
     * @param {string|Buffer} filenameOrBuffer The filename or a buffer
     * @param {Function=} callback An optional callback
     * @returns {Promise.<string>} A promise that resolves with the encrypted text
     */
    encryptWithKeyFile: function(text, filenameOrBuffer, callback) {
        debug("encrypt using keyfile");
        return derivation.deriveFromFile(filenameOrBuffer)
            .then((keyDerivationInfo) => lib.encrypt(text, keyDerivationInfo));
    },

    encryptWithPassword: function(text, password) {
        debug("encrypt using password");
        return derivation.deriveFromPassword(password)
            .then((keyDerivationInfo) => lib.encrypt(text, keyDerivationInfo));
    },

    decrypt: function(encryptedComponents, keyDerivationInfo) {
        debug("decrypt content");
        var tool = components.getDecryptTool()
        return tool(encryptedComponents, keyDerivationInfo);
    },

    decryptWithKeyFile: function(text, file, callback) {
        debug("decrypt using keyfile");
        var encryptedComponents = packing.unpackEncryptedContent(text);
        return derivation.deriveFromFile(file, encryptedComponents.salt, encryptedComponents.rounds)
            .then((keyDerivationInfo) => lib.decrypt(encryptedComponents, keyDerivationInfo));

    },

    decryptWithPassword: function(text, password) {
        debug("decrypt using password");
        var encryptedComponents = packing.unpackEncryptedContent(text)
        return derivation.deriveFromPassword(password, encryptedComponents.salt, encryptedComponents.rounds)
            .then((keyDerivationInfo) => lib.decrypt(encryptedComponents, keyDerivationInfo));
    }

};
