var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');

var baseConfig = require('./base');

// Add needed plugins here
var BowerWebpackPlugin = require('bower-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');

var config = _.merge({
    entry: {
        app: './src/components/run.js',
        index: './src/index.html'
    },
    cache: false,
    devtool: 'sourcemap',
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new BowerWebpackPlugin({
            searchResolveModulesDirectories: false
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
        new ManifestPlugin()
    ]
}, baseConfig);

config.module.loaders.push({
    test: /\.(js|jsx)$/,
    loader: 'babel',
    include: path.join(__dirname, '/../src')
}, {
    test: /\.css$/,
    loader: 'file!extract!css'
}, {
    test: /\.scss/,
    loader: 'file?name=[hash].css!extract!css!sass?outputStyle=expanded'
}, {
    test: /\.html$/,
    loader: 'file?name=[name].[ext]!extract!html?attrs=link:href script:src img:src'
});

module.exports = config;
