"use strict";

// var Crypto = require("crypto"),
const hashFile = require("hash_file");

const constants = require("./constants.js");
const debug = require("./debug.js");

var lib = module.exports = {

    /**
     * Generate a file hash using a filename or buffer
     * @param {string|Buffer} filenameOrBuffer The name of a file to generate a hash for, or a buffer containing
     *      the contents of a file
     * @returns {Promise.<string>} Returns a promise that resolves with the hash string
     */
    generateFileHash: function(filenameOrBuffer) {
        debug("generate file hash");
        return new Promise(function(resolve, reject) {
            hashFile(filenameOrBuffer, constants.FILE_HASH_ALGORITHM, function(err, hash) {
                if (err) {
                    debug("error hashing file");
                    reject(err);
                } else {
                    debug("generated hash from file");
                    resolve(hash);
                }
            });
        });
    },

    /**
     * Generate an IV
     * @returns {Promise.<Buffer>} A promise that resolves with a buffer
     */
    generateIV: function() {
        debug("generate IV");
        const components = require("./components.js");
        const generate = components.getIVGenerationTool();
        return generate();
    },

    /**
     * Generate a salt of a certain length
     * @param {Number} length The length of the string to generate
     * @returns {Promise.<String>} A promise that resolves with a salt string
     */
    generateSalt: function(length) {
        debug("generate salt");
        const components = require("./components.js");
        const generate = components.getSaltGenerationTool();
        return generate(length);
    }

};
