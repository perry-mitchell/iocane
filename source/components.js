"use strict";

var Crypto = require("crypto"),
    pbkdf2 = require("pbkdf2");

var generation = require("./generators.js"),
    constants = require("./constants.js");

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

    setEncryptTool: function setEncryptTool(fn) {
        encryptionOverride = fn;
    },

    /**
     * Set the PBKDF2 function to use. Setting undefined puts the default back in use.
     * @param {Function|undefined} fn The PBKDF2 function to use
     * @returns {undefined}
     */
    setPBKDF2: function setPBKDF2(fn) {
        pbkdf2Override = fn;
    }

};
