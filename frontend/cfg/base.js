var path = require('path');

var port = 8000;
var srcPath = path.join(__dirname, '/../src');
var publicPath = '/assets/';

module.exports = {
    port: port,
    debug: true,
    output: {
        path: path.join(__dirname, '/../../public/assets'),
        filename: '[name].js',
        publicPath: publicPath
    },
    devServer: {
        contentBase: './public/',
        historyApiFallback: true,
        hot: true,
        port: port,
        publicPath: publicPath,
        noInfo: false
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {
            src: srcPath,
            actions: srcPath + '/actions/',
            components: srcPath + '/components/',
            sources: srcPath + '/sources/',
            stores: srcPath + '/stores/',
            reducers: srcPath + '/reducers/',
            styles: srcPath + '/styles/',
            config: srcPath + '/config/' + process.env.REACT_WEBPACK_ENV
        }
    },
    module: {
        preLoaders: [
            {
                test: /\.(js|jsx)$/,
                include: path.join(__dirname, 'src'),
                loader: 'eslint-loader'
            }
        ],
        loaders: [
            {
                test: /\.(png|jpg|gif|woff|woff2)$/,
                loader: 'url-loader?limit=8192'
            }
        ]
    }

};
