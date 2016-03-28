(function(module) {

    "use strict";

    var Crypto = require("crypto");

    var lib = module.exports = {

        generateIV: function() {
            return new Buffer(Crypto.randomBytes(16));
        },

        generateSalt: function(length) {
            var genLen = length % 2 ? length + 1 : length;
            return Crypto.randomBytes(genLen / 2).toString("hex").substring(0, length);
        }

    };

})(module);
