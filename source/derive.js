"use strict";

var constants = require("./constants.js"),
    config = require("./config.js"),
    generators = require("./generators.js"),
    components = require("./components.js"),
    debug = require("debug");

var getConfigValue = config.getConfigValue;

function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sanitiseRounds(rounds) {
    return rounds || getRandomInRange(
        getConfigValue("derivedKeyIterationsMin"),
        getConfigValue("derivedKeyIterationsMax")
    );
}

function sanitiseSalt(salt) {
    return salt && Promise.resolve(salt) ||
        generators.generateSalt(constants.SALT_LENGTH);
}

var lib = module.exports = {

    /**
     * Derive a key from a file, using its filename or contents
     * @param {string|Buffer} filenameOrBuffer The filename or contents of the file
     * @param {string=} salt The salt
     * @param {number=} rounds The number of rounds
     * @returns {Promise.<DerivedKeyInfo>} A promise that resolves with derived key info
     */
    deriveFromFile: function(filenameOrBuffer, salt, rounds) {
        debug("derive key from file");
        return generators.generateFileHash(filenameOrBuffer)
            .then(function(hash) {
                return lib.deriveFromPassword(hash, salt, rounds);
            });
    },

    /**
     * Derived key info
     * @typedef DerivedKeyInfo
     * @property {String} salt - The salt used
     * @property {Buffer} key - The derived key
     * @property {Buffer} hmac - The HMAC
     * @property {Number} rounds - The number of rounds used
     */

    /**
     * Derive a key from a password
     * @param {String} password The password to derive from
     * @param {String=} saltRaw The salt (Optional)
     * @param {Number=} rounds The number of iterations
     * @returns {Promise.<DerivedKeyInfo>} A promise that resolves with an object (DerivedKeyInfo)
     */
    deriveFromPassword: function(password, saltRaw, rounds) {
        debug("derive key from password");
        let salt;
        rounds = sanitiseRounds(rounds);
        const bits = (constants.PASSWORD_KEY_SIZE + constants.HMAC_KEY_SIZE)  * 8;
        const pbkdf2Gen = components.getPBKDF2();
        return sanitiseSalt(saltRaw)
            .then(sanitisedSalt => {
                salt = sanitisedSalt;
            })
            .then(() => pbkdf2Gen(
                password,
                salt,
                rounds,
                bits,
                constants.DERIVED_KEY_ALGORITHM
            ))
            .then((derivedKeyData) => derivedKeyData.toString("hex"))
            .then(function(derivedKeyHex) {
                const dkhLength = derivedKeyHex.length;
                const keyBuffer = new Buffer(derivedKeyHex.substr(0, dkhLength / 2), "hex");
                const hmacBuffer = new Buffer(derivedKeyHex.substr(dkhLength / 2, dkhLength / 2), "hex");
                return {
                    salt: salt,
                    key: keyBuffer,
                    hmac: hmacBuffer,
                    rounds: rounds
                };
            });
    }

};
