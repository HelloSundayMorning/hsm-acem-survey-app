var path = require('path');
var webpack = require('webpack');

var baseConfig = require('./base');

// Add needed plugins here
var BowerWebpackPlugin = require('bower-webpack-plugin');

module.exports = {
    devtool: 'eval',
    module: {
        preLoaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'isparta-instrumenter-loader',
                include: [
                    path.join(__dirname, '/../src')
                ]
            }
        ],
        loaders: [
            {
                test: /\.(png|jpg|gif|woff|woff2|css|sass|scss|less|styl)$/,
                loader: 'null-loader'
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                include: [
                    path.join(__dirname, '/../src'),
                    path.join(__dirname, '/../test')
                ]
            }
        ]
    },
    resolve: baseConfig.resolve,
    plugins: [
        new BowerWebpackPlugin({
            searchResolveModulesDirectories: false
        }),
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ]
};
