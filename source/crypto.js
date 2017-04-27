"use strict";

var Crypto = require("crypto");

var derivation = require("./derive.js"),
    generation = require("./generators.js"),
    packing = require("./packers.js"),
    security = require("./security.js"),
    constants = require("./constants.js"),
    debug = require("./debug.js");

var lib = module.exports = {

    encrypt: function(text, keyDerivationInfo) {
        debug("encrypt content");
        var iv = generation.generateIV(),
            ivHex = iv.toString("hex");
        var encryptTool = Crypto.createCipheriv(constants.ENC_ALGORITHM, keyDerivationInfo.key, iv),
            hmacTool = Crypto.createHmac(constants.HMAC_ALGORITHM, keyDerivationInfo.hmac),
            saltHex = keyDerivationInfo.salt.toString("hex"),
            pbkdf2Rounds = keyDerivationInfo.rounds;
        // Perform encryption
        var encryptedContent = encryptTool.update(text, "utf8", "base64");
        encryptedContent += encryptTool.final("base64");
        // Generate hmac
        hmacTool.update(encryptedContent);
        hmacTool.update(ivHex);
        hmacTool.update(saltHex);
        var hmacHex = hmacTool.digest("hex");
        // Return packed content
        return packing.packEncryptedContent(
            encryptedContent,
            ivHex,
            saltHex,
            hmacHex,
            pbkdf2Rounds
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
        // Extract the components
        var encryptedContent = encryptedComponents.content,
            iv = new Buffer(encryptedComponents.iv, "hex"),
            salt = encryptedComponents.salt,
            hmacData = encryptedComponents.hmac;
        // Get HMAC tool
        var hmacTool = Crypto.createHmac(constants.HMAC_ALGORITHM, keyDerivationInfo.hmac);
        // Generate the HMAC
        hmacTool.update(encryptedContent);
        hmacTool.update(encryptedComponents.iv);
        hmacTool.update(salt);
        var newHmaxHex = hmacTool.digest("hex");
        // Check hmac for tampering
        if (security.constantTimeCompare(hmacData, newHmaxHex) !== true) {
            throw new Error("Authentication failed while decrypting content");
        }
        // Decrypt
        var decryptTool = Crypto.createDecipheriv(constants.ENC_ALGORITHM, keyDerivationInfo.key, iv),
            decryptedText = decryptTool.update(encryptedContent, "base64", "utf8");
        return decryptedText + decryptTool.final("utf8");
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
