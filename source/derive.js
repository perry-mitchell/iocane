(function(module) {

    "use strict";

    var pbkdf2 = require("pbkdf2");

    var config = require("./config.js"),
        generators = require("./generators.js");

    function getRandomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function sanitiseRounds(rounds) {
        return rounds || getRandomInRange(
            config.DERIVED_KEY_ITERATIONS_MIN,
            config.DERIVED_KEY_ITERATIONS_MAX
        );
    }

    function sanitiseSalt(salt) {
        return salt || generators.generateSalt(config.SALT_LENGTH);
    }

    var lib = module.exports = {

        deriveFromFile: function(filename, salt, rounds) {
            return generators.generateFileHash(filename)
                .then(function(hash) {
                    return lib.deriveFromPassword(hash, salt, rounds);
                });
        },

        deriveFromPassword: function(password, salt, rounds) {
            rounds = sanitiseRounds(rounds);
            salt = sanitiseSalt(salt);
            return new Promise(function(resolve) {
                let derivedKey = pbkdf2.pbkdf2Sync(
                    password,
                    salt,
                    rounds,
                    config.PASSWORD_KEY_SIZE + config.HMAC_KEY_SIZE, // size
                    config.DERIVED_KEY_ALGORITHM
                );
                // Get key and split it into 2 buffers: 1 for the password, 1 for the HMAC key
                var derivedKeyHex = derivedKey.toString("hex"),
                    dkhLength = derivedKeyHex.length,
                    keyBuffer = new Buffer(derivedKeyHex.substr(0, dkhLength / 2), "hex"),
                    hmacBuffer = new Buffer(derivedKeyHex.substr(dkhLength / 2, dkhLength / 2), "hex");
                (resolve)({
                    salt: salt,
                    key: keyBuffer,
                    hmac: hmacBuffer,
                    rounds: rounds
                });
            });
        }

    };

})(module);
