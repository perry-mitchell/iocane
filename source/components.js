"use strict";

var Crypto = require("crypto"),
    pbkdf2 = require("pbkdf2");

var generation = require("./generators.js"),
    constants = require("./constants.js"),
    security = require("./security.js");

function decrypt_def(encryptedComponents, keyDerivationInfo) {
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
}

function encrypt_def(text, keyDerivationInfo) {
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
    return {
        hmac: hmacHex,
        iv: ivHex,
        salt: saltHex,
        rounds: pbkdf2Rounds,
        encryptedContent
    };
}

/**
 * The default PBKDF2 function
 * @param {string} password The password to use
 * @param {string} salt The salt to use
 * @param {number} rounds The number of iterations
 * @param {number} bits The size of the key to generate, in bits
 * @param {string} algo The NodeJS compatible hashing algorithm to use
 * @returns {Promise.<Buffer>} A Promise that resolves with the hash
 */
function pbkdf2_def(password, salt, rounds, bits, algo) {
    return new Promise(function(resolve) {
        (resolve)(pbkdf2.pbkdf2Sync(
            password,
            salt,
            rounds,
            bits / 8,
            algo
        ));
    });
}

let pbkdf2Override,
    encryptionOverride,
    decryptionOverride;

module.exports = {

    /**
     * Get decryption tool method
     * @returns {Function} The decryption method
     */
    getDecryptTool: function getDecryptTool() {
        return decryptionOverride ? decryptionOverride : decrypt_def;
    },

    /**
     * Get encryption tool method
     * @returns {Function} The encryption method
     */
    getEncryptTool: function getEncryptTool() {
        return encryptionOverride ? encryptionOverride : encrypt_def;
    },

    /**
     * Get the current PBKDF2 method
     * @returns {Function} The PBKDF2 function
     */
    getPBKDF2: function getPBKDF2() {
        return pbkdf2Override ? pbkdf2Override : pbkdf2_def;
    },

    /**
     * Set the decryption tool method
     * @param {Function} fn The decryption method
     */
    setDecryptTool: function setDecryptTool(fn) {
        decryptionOverride = fn;
    },

    /**
     * Set the encryption tool method
     * @param {Function} fn The encryption method
     */
    setEncryptTool: function setEncryptTool(fn) {
        encryptionOverride = fn;
    },

    /**
     * Set the PBKDF2 function to use. Setting undefined puts the default back in use.
     * @param {Function|undefined} fn The PBKDF2 function to use
     */
    setPBKDF2: function setPBKDF2(fn) {
        pbkdf2Override = fn;
    }

};
