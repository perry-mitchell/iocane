const { Session } = require("./Session.js");

/**
 * Start new encryption/decryption session
 * @returns {Session} New crypto session
 */
function createSession() {
    return new Session();
}

/**
 * @module iocane
 */
module.exports = {
    createSession
};
