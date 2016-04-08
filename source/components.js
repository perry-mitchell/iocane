"use strict";

var pbkdf2 = require("pbkdf2");

/**
 * The default PBKDF2 function
 * @param {string} password The password to use
 * @param {string} salt The salt to use
 * @param {number} rounds The number of iterations
 * @param {number} bits The size of the key to generate, in bits
 * @param {string} algo The NodeJS compatible hashing algorithm to use
 * @returns {Promise.<Buffer>} A Promise that resolves with the hash
 */
function pbkdf2_def(password, salt, rounds, bits, algo) {
    return new Promise(function(resolve) {
        (resolve)(pbkdf2.pbkdf2Sync(
            password,
            salt,
            rounds,
            bits / 8,
            algo
        ));
    });
}

let pbkdf2_override;

module.exports = {

    /**
     * Get the current PBKDF2 method
     * @returns {Function} The PBKDF2 function
     */
    getPBKDF2: function() {
        return pbkdf2_override ? pbkdf2_override : pbkdf2_def;
    },

    /**
     * Set the PBKDF2 function to use. Setting undefined puts the default back in use.
     * @param {Function|undefined} fn The PBKDF2 function to use
     * @returns {undefined}
     */
    setPBKDF2: function(fn) {
        pbkdf2_override = fn;
    }

};
