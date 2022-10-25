const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const plugins = [];
if (process.env.ANALYSE === "bundle") {
    plugins.push(new BundleAnalyzerPlugin());
}

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

    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "./web"),
        library: "iocane",
        libraryTarget: "umd"
    },

    plugins,

    resolve: {
        extensions: [".ts", ".js", ".json"],
        fallback: {
            Buffer: false,
            crypto: false,
            stream: false,
            util: false
        }
    }
};
