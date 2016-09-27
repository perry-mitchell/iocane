(function(module) {

    "use strict";

    var config = require("./config.js"),
        generators = require("./generators.js"),
        components = require("./components.js");

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

        /**
         * Derive a key from a file, using its filename or contents
         * @param {string|Buffer} filenameOrBuffer The filename or contents of the file
         * @param {string=} salt The salt
         * @param {number=} rounds The number of rounds
         */
        deriveFromFile: function(filenameOrBuffer, salt, rounds) {
            return generators.generateFileHash(filenameOrBuffer)
                .then(function(hash) {
                    return lib.deriveFromPassword(hash, salt, rounds);
                });
        },

        /**
         * Derived key info
         * @typedef DerivedKeyInfo
         * @property {string} salt - The salt used
         * @property {Buffer} key - The derived key
         * @property {Buffer} hmac - The HMAC
         * @property {number} rounds - The number of rounds used
         */

        /**
         * Derive a key from a password
         * @param {string} password The password to derive from
         * @param {string=} salt The salt (Optional)
         * @param {number=} rounds The number of iterations
         * @returns {Promise.<DerivedKeyInfo>} A promise that resolves with an object (DerivedKeyInfo)
         */
        deriveFromPassword: function(password, salt, rounds) {
            rounds = sanitiseRounds(rounds);
            salt = sanitiseSalt(salt);
            let bits = (config.PASSWORD_KEY_SIZE + config.HMAC_KEY_SIZE)  * 8;
            return components.getPBKDF2()(
                    password,
                    salt,
                    rounds,
                    bits,
                    config.DERIVED_KEY_ALGORITHM
                )
                .then((derivedKeyData) => derivedKeyData.toString("hex"))
                .then(function(derivedKeyHex) {
                    let dkhLength = derivedKeyHex.length,
                        keyBuffer = new Buffer(derivedKeyHex.substr(0, dkhLength / 2), "hex"),
                        hmacBuffer = new Buffer(derivedKeyHex.substr(dkhLength / 2, dkhLength / 2), "hex");
                    return {
                        salt: salt,
                        key: keyBuffer,
                        hmac: hmacBuffer,
                        rounds: rounds
                    };
                });
        }

    };

})(module);
