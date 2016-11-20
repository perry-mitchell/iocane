"use strict";

var Crypto = require("crypto"),
    hashFile = require("hash_file");

var config = require("./config.js"),
    debug = require("./debug.js");

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
            hashFile(filenameOrBuffer, config.FILE_HASH_ALGORITHM, function(err, hash) {
                if (err) {
                    debug("error hashing file");
                    (reject)(err);
                } else {
                    debug("generated hash from file");
                    (resolve)(hash);
                }
            });
        });
    },

    generateIV: function() {
        debug("generate IV");
        return new Buffer(Crypto.randomBytes(16));
    },

    generateSalt: function(length) {
        debug("generate salt");
        var genLen = length % 2 ? length + 1 : length;
        return Crypto.randomBytes(genLen / 2).toString("hex").substring(0, length);
    }

};
