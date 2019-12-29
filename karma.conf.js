// const path = require("path");

module.exports = config => {
    config.set({
        autoWatch: false,
        basePath: __dirname,
        browsers: ["ChromeHeadless"],
        captureTimeout: 15000,
        files: [
            "web/index.js",
            "test/web/**/*.spec.js"
        ],
        frameworks: ["mocha", "chai", "sinon"]
    });
};
