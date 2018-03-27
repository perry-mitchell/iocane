const { getConfiguration } = require("./global.js");
const Session = require("./Session.js");

function configure() {
    return getConfiguration();
}

function createSession() {
    return new Session();
}

module.exports = {
    configure,
    createSession
};
