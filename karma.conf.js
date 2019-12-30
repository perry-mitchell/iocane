module.exports = config => {
    config.set({
        autoWatch: false,
        basePath: __dirname,
        browsers: ["ChromeHeadless"],
        captureTimeout: 15000,
        files: [
            "web/index.js",
            "test/web/node-sample.js",
            "test/web/**/*.spec.js"
        ],
        frameworks: ["mocha", "chai", "sinon"]
    });
};
