"use strict";

const Crypto = require("crypto");
const pbkdf2 = require("pbkdf2");

const generation = require("./generators.js");
const constants = require("./constants.js");
const security = require("./security.js");
const debug = require("./debug.js");

/**
 * Default decryption method
 * @param {EncryptedComponents} encryptedComponents Encrypted components
 * @param {DerivedKeyInfo} keyDerivationInfo Key derivation information
 * @returns {Promise.<String>} A promise that resolves with the decrypted string
 */
function decrypt_def(encryptedComponents, keyDerivationInfo) {
    debug("decrypting using build-in method");
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
    return Promise.resolve(decryptedText + decryptTool.final("utf8"));
}

/**
 * Default encryption method
 * @param {String} text The text to encrypt
 * @param {DerivedKeyInfo} keyDerivationInfo Key derivation information
 * @returns {Promise.<EncryptedComponents>} A promise that resolves with encrypted components
 */
function encrypt_def(text, keyDerivationInfo) {
    debug("encrypting using build-in method");
    return generation
        .generateIV()
        .then(function _encrypt(iv) {
            const ivHex = iv.toString("hex");
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
            return Promise.resolve({
                hmac: hmacHex,
                iv: ivHex,
                salt: saltHex,
                rounds: pbkdf2Rounds,
                encryptedContent
            });
        })
}

/**
 * Default IV generator
 * @returns {Promise.<Buffer>} A promise that resolves with an IV
 */
function iv_gen_def() {
    debug("generating IV using build-in method");
    return Promise.resolve(new Buffer(Crypto.randomBytes(16)));
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
    debug("generating derived key using build-in method");
    return new Promise(function(resolve) {
        resolve(pbkdf2.pbkdf2Sync(
            password,
            salt,
            rounds,
            bits / 8,
            algo
        ));
    });
}

/**
 * Default salt generator
 * @param {Number} length The length of the string to generate
 * @returns {Promise.<String>} A promise that resolves with a salt
 */
function salt_gen_def(length) {
    debug("generating salt using build-in method");
    const genLen = length % 2 ? length + 1 : length;
    return Promise.resolve(Crypto.randomBytes(genLen / 2).toString("hex").substring(0, length))
}

let pbkdf2Override,
    encryptionOverride,
    decryptionOverride,
    saltGenerateOverride,
    ivGenerateOverride;

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
     * Get the current IV generation method
     * @returns {Function} The IV generation function
     */
    getIVGenerationTool: function getIVGenerationTool() {
        return ivGenerateOverride ? ivGenerateOverride : iv_gen_def;
    },

    /**
     * Get the current PBKDF2 method
     * @returns {Function} The PBKDF2 function
     */
    getPBKDF2: function getPBKDF2() {
        return pbkdf2Override ? pbkdf2Override : pbkdf2_def;
    },

    /**
     * Get the salt generation method
     * @returns {Function} The salt generation function
     */
    getSaltGenerationTool: function getSaltGenerationTool() {
        return saltGenerateOverride ? saltGenerateOverride : salt_gen_def;
    },

    /**
     * Set the decryption tool method
     * @param {Function|undefined} fn The decryption method
     */
    setDecryptTool: function setDecryptTool(fn) {
        decryptionOverride = fn;
    },

    /**
     * Set the encryption tool method
     * @param {Function|undefined} fn The encryption method
     */
    setEncryptTool: function setEncryptTool(fn) {
        encryptionOverride = fn;
    },

    /**
     * Set the current IV generation tool
     * @param {Function|undefined} fn The new method
     */
    setIVGenerationTool: function setIVGenerationTool(fn) {
        ivGenerateOverride = fn;
    },

    /**
     * Set the PBKDF2 function to use. Setting undefined puts the default back in use.
     * @param {Function|undefined} fn The PBKDF2 function to use
     */
    setPBKDF2: function setPBKDF2(fn) {
        pbkdf2Override = fn;
    },

    /**
     * Set the current salt generation tool
     * @param {Function|undefined} fn The new method
     */
    setSaltGenerationTool: function setSaltGenerationTool(fn) {
        saltGenerateOverride = fn;
    }

};
