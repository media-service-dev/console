/*
 * This file is part of the @mscs/console package.
 *
 * Copyright (c) 2020 media-service consulting & solutions GmbH
 *
 * For the full copyright and license information, please view the LICENSE
 * File that was distributed with this source code.
 */

const path = require("path");
const nodeExternals = require("webpack-node-externals");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    target: "node",
    entry: "./src/index.ts",
    devtool: "source-map",
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts"],
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    output: {
        libraryTarget: "commonjs2",
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
    },
};
