const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require("dotenv-webpack");

module.exports = {
    //mode: 'production',
    mode: 'development',
    entry: ["regenerator-runtime/runtime.js", './index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[chunkhash].js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react', '@babel/preset-env']
                },
            },
            {
                test: /.s?css$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
                //MiniCssExtractPlugin.loader
            },
            {
                test: /.(png|jpe?g|svg)$/,
                loader: 'file-loader',
            },
            {
                test: /.(raw|csv)$/,
                use: 'raw-loader',
            },
        ]
    }, resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    // optimization: {
    //     minimize: true,
    //     chunkIds: "size",
    //     moduleIds: "size",
    //     mangleExports: "size",
    //     minimizer: [
    //         new TerserPlugin({
    //             parallel: true,
    //         }), new CssMinimizerPlugin(),],
    //     concatenateModules: true,
    //     emitOnErrors: true,
    //     flagIncludedChunks: true,
    //     innerGraph: true,
    //     mergeDuplicateChunks: true,
    //     nodeEnv: "production", //"development", //production
    //     portableRecords: true,
    //     providedExports: true,
    //     usedExports: true,
    //     realContentHash: true,
    //     removeAvailableModules: true,
    //     removeEmptyChunks: true,
    //     runtimeChunk: "single",
    //     sideEffects: true,
    // },
    plugins: [
        new htmlWebpackPlugin({ template: './public/index.html', favicon: './public/favicon.ico' }),
        new MiniCssExtractPlugin(),
        new Dotenv({
            systemvars: true,
        }),
    ],
    //devtool: 'inline-source-map',
    devServer: {
        port: 8001,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                pathRewrite: { '^/api': '' },
            }
        },
        //contentBase: path.join(__dirname, 'dist'),
        //compress: true,
        historyApiFallback: true,
        hot: true,
        https: false,
        //noInfo: true,
    },
}