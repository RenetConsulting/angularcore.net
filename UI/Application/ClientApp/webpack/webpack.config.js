const path = require("path");
const webpack = require("webpack");

module.exports = (env) => {

    const commonConfig = {
        mode: "production",
        stats: {
            modules: false
        },
        entry: './webpack/variables.js',
        output: {
            filename: "variables.js",
            path: path.resolve(__dirname, '../src/assets/'),
            libraryTarget: "var"
        },
        devtool: "none",
        resolve: {
            extensions: [".ts", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\\.ts?$/,
                    exclude: /^node_modules/,
                    loader: "ts-loader",
                    options: {
                        configFile: "./tsconfig.webpack.json"
                    }
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                "VERSION": JSON.stringify(new Date().toISOString())
            })
        ],
        optimization: {
            noEmitOnErrors: true,
            minimize: true
        }
    }

    return [commonConfig];
};