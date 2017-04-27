"use strict";

var constants = require("./constants.js"),
    debug = require("./debug.js");

var lib = module.exports = {

    packEncryptedContent: function(encryptedContent, iv, salt, hmacFinal, rounds) {
        debug("pack encrypted content");
        return [encryptedContent, iv, salt, hmacFinal, rounds].join("$");
    },

    unpackEncryptedContent: function(encryptedContent) {
        debug("unpack encrypted content");
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
