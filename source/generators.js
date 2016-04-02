(function(module) {

    "use strict";

    var Crypto = require("crypto"),
        hashFile = require("hash_file");

    var config = require("./config.js");

    var lib = module.exports = {

        generateFileHash: function(filename) {
            return new Promise(function(resolve, reject) {
                hashFile(filename, config.FILE_HASH_ALGORITHM, function(err, hash) {
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
