const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPugPlugin = require("html-webpack-pug-plugin");
const Autoprefixer = require("autoprefixer");

const PATHS = {
    dist: path.join(__dirname, "dist"),
    src: path.join(__dirname, "src"),
    entry: path.join(__dirname, "src", "index.js"),
    views: path.join(__dirname, "src", "views"),
};

function HtmlWebpackPluginForAll(searchDirectory) {
    const srcFiles = fs.readdirSync(searchDirectory);
    const htmlFiles = srcFiles.filter((filename) =>
        filename.match(/\.(html|pug)$/i)
    );
    const result = htmlFiles.map(
        (filename) =>
            new HtmlWebpackPlugin({
                filename: filename.replace(/.pug$/i, ".html"),
                template: path.join(searchDirectory, filename),
            })
    );
    return result;
}

module.exports = {
    mode: "development",
    entry: PATHS.entry,
    output: {
        path: PATHS.dist,
        filename: "bundle.js",
        publicPath: "",
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                use: ["html-loader", "pug-html-loader"],
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
                options: { minimize: true },
            },
            {
                test: /\.tsx?$/i,
                use: ["ts-loader"],
                exclude: ["/node_modules/"],
            },
            {
                test: /\.s[ac]ss?$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [Autoprefixer()],
                            },
                        },
                    },
                    "sass-loader",
                ],
                exclude: ["/node_modules/"],
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [Autoprefixer()],
                            },
                        },
                    },
                ],
                exclude: ["/node_modules/"],
            },
            {
                test: [
                    /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/i,
                    /\.(png|svg|jpg|gif)$/i,
                ],
                use: ["file-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            Assets: path.join(__dirname, "src", "assets"),
        },
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: { postcss: [Autoprefixer()] },
        }),
    ]
        .concat(HtmlWebpackPluginForAll(PATHS.views))
        .concat([new HtmlWebpackPugPlugin()]),
};
