const Configuration = require("./Configuration.js");

const __instance = new Configuration();

function getConfiguration() {
    return __instance;
}

module.exports = {
    getConfiguration
};
