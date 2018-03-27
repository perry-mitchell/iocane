const pbkdf2 = require("pbkdf2");

/**
 * The default PBKDF2 function
 * @param {String} password The password to use
 * @param {String} salt The salt to use
 * @param {Number} rounds The number of iterations
 * @param {Number} bits The size of the key to generate, in bits
 * @param {String} algo The NodeJS compatible hashing algorithm to use
 * @returns {Promise.<Buffer>} A Promise that resolves with the hash
 */
function pbkdf2(password, salt, rounds, bits, algo) {
    return new Promise((resolve, reject) => {
        pbkdf2(password, salt, rounds, bits / 8, algo, (err, key) => {
            if (err) {
                return reject(err);
            }
            return resolve(key);
        });
    });
}

module.exports = {
    pbkdf2
};
