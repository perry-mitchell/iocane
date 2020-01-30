module.exports = config => {
    config.set({
        autoWatch: false,
        basePath: __dirname,
        browsers: ["ChromeHeadless"],
        captureTimeout: 15000,
        client: {
            mocha: {
                timeout: "10000"
            }
        },
        files: [
            "web/index.js",
            "test/web/**/*.spec.js"
        ],
        frameworks: ["mocha", "chai", "sinon"]
    });
};
