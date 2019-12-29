const path = require("path");

const isTesting = process.env.NODE_ENV === "testing";

module.exports = {
    entry: path.resolve(__dirname, "./source/index.web.ts"),

    module: {
        rules: [
            {
                test: /\.[jt]s$/,
                loader: "babel-loader"
            }
        ]
    },

    node: {
        buffer: "empty",
        crypto: "empty"
    },

    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "./web"),
        library: "iocane",
        libraryTarget: isTesting ? "umd" : "commonjs"
    },

    resolve: {
        extensions: [".ts", ".js", ".json"]
    }
};
