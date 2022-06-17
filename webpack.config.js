const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
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
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
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
    },
    optimization: {
        minimize: true,
        chunkIds: "size",
        moduleIds: "size",
        mangleExports: "size",
        minimizer: [
            new TerserPlugin({
                parallel: true,
            }), new CssMinimizerPlugin(),],
        concatenateModules: true,
        emitOnErrors: true,
        flagIncludedChunks: true,
        innerGraph: true,
        mergeDuplicateChunks: true,
        nodeEnv: "production", //"development", //production
        portableRecords: true,
        providedExports: true,
        usedExports: true,
        realContentHash: true,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        runtimeChunk: "single",
        sideEffects: true,
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    plugins: [
        new htmlWebpackPlugin({ template: './public/index.html', favicon: './public/favicon.ico' }),
        new MiniCssExtractPlugin(),
    ],
}
