var assert = require("assert");
var constants = require("./constants.js");

/**
 * Configuration store
 * @type {Object}
 * @private
 */
var __config = {
    derivedKeyIterationsMin:                constants.DEFAULT_DERIVED_KEY_ITERATIONS_MIN,
    derivedKeyIterationsMax:                constants.DEFAULT_DERIVED_KEY_ITERATIONS_MAX
};

/**
 * Get a configuration value
 * @throws {Error} Throws if the key does not exist
 * @see __config
 * @param {String} key The key to get the value for
 * @returns {*} The value from the configuration
 */
function getConfigValue(key) {
    if (__config.hasOwnProperty(key) !== true) {
        throw new Error(`Unknown property key: ${key}`);
    }
    return __config[key];
}

/**
 * Set the min and max key derivation rounds
 * The higher the better
 * @param {Number} min The minimum interation count
 * @param {Number} max The maximum interation count
 * @throws {Error} Throws if the iteration values are invalid
 * @throws {Error} Throws if the iteration max is less than or equal to min
 */
function setDerivedKeyIterationRange(min, max) {
    assert(typeof min === "number", "Minimun iteration count should be a number");
    assert(typeof max === "number", "Maximum iteration count should be a number");
    assert(max > min, "Maximum iteration count should be greater than the minimum");
    assert(min > 0, "Minimum iteration count should be greater than 0");
    __config.derivedKeyIterationsMin = min;
    __config.derivedKeyIterationsMax = max;
}

module.exports = {
    getConfigValue,
    setDerivedKeyIterationRange
};
