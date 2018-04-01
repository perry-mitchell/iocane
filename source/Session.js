const Configuration = require("./Configuration.js");
const { getConfiguration } = require("./global.js");

class Session extends Configuration {
    constructor() {
        super();
        // Get options from global
        this._options = Object.assign({}, getConfiguration().options);
    }

    decrypt(text, password) {

    }

    encrypt(text, password) {

    }
}

module.exports = Session;
