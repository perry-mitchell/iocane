"use strict";

var constants = require("./constants.js"),
    debug = require("./debug.js");

/**
 * Encrypted content components
 * @typedef {Object} EncryptedComponents
 * @property {String} content - The encrypted string
 * @property {String} iv - The IV in hex form
 * @property {String} salt - The salt
 * @property {String} hmac - The HMAC in hex form
 * @property {Number} rounds - The PBKDF2 rounds
 */

var lib = module.exports = {

    /**
     * Pack encrypted content components into the final encrypted form
     * @param {String} encryptedContent The encrypted text
     * @param {String} iv The IV in hex form
     * @param {String} salt The salt
     * @param {String} hmac The HMAC in hex form
     * @param {Number} rounds The PBKDF2 round count
     * @returns {String} The final encrypted form
     */
    packEncryptedContent: function packEncryptedContent(encryptedContent, iv, salt, hmac, rounds) {
        debug("packing encrypted content");
        return [encryptedContent, iv, salt, hmac, rounds].join("$");
    },

    /**
     * Unpack encrypted content components from an encrypted string
     * @param {String} encryptedContent The encrypted string
     * @returns {EncryptedComponents} The extracted components
     * @throws {Error} Throws if the number of components is incorrect
     */
    unpackEncryptedContent: function unpackEncryptedContent(encryptedContent) {
        debug("unpacking encrypted content");
        var components = encryptedContent.split("$");
        // iocane was originally part of Buttercup's core package, and therefore has ties to its archive format.
        // There will be 4 components for pre 0.15.0 archives, and 5 in newer archives. The 5th component
        // is the pbkdf2 round count, which is optional.
        if (components.length < 4 || components.length > 5) {
            throw new Error("Decryption error - unexpected number of encrypted components");
        }
        var pbkdf2Rounds = (components.length > 4) ? parseInt(components[4], 10) : constants.PBKDF2_ROUND_DEFAULT;
        return {
            content: components[0],
            iv: components[1],
            salt: components[2],
            hmac: components[3],
            rounds: pbkdf2Rounds
        };
    }

};
