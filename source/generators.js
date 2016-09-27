(function(module) {

    "use strict";

    var Crypto = require("crypto"),
        hashFile = require("hash_file");

    var config = require("./config.js");

    var lib = module.exports = {

        /**
         * Generate a file hash using a filename or buffer
         * @param {string|Buffer} filenameOrBuffer The name of a file to generate a hash for, or a buffer containing
         *      the contents of a file
         * @returns {Promise.<string>} Returns a promise that resolves with the hash string
         */
        generateFileHash: function(filenameOrBuffer) {
            return new Promise(function(resolve, reject) {
                hashFile(filenameOrBuffer, config.FILE_HASH_ALGORITHM, function(err, hash) {
                    if (err) {
                        (reject)(err);
                    } else {
                        (resolve)(hash);
                    }
                });
            });
        },

        generateIV: function() {
            return new Buffer(Crypto.randomBytes(16));
        },

        generateSalt: function(length) {
            var genLen = length % 2 ? length + 1 : length;
            return Crypto.randomBytes(genLen / 2).toString("hex").substring(0, length);
        }

    };

})(module);
