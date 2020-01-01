const path = require("path");

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
        libraryTarget: "umd"
    },

    resolve: {
        extensions: [".ts", ".js", ".json"]
    }
};
