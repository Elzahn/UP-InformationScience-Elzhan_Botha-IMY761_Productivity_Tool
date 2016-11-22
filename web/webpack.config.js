var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    debug: true,
    target: 'node',
    // maps
    entry: {
        'bootstrapper': './ts/bootstrapper.ts'
    },
    node: {
        __filename: true,
        __dirname: true
    },
    output: {
        path: __dirname + '/build/',
        publicPath: 'build/',
        filename: '[name].js',
        sourceMapFilename: '[name].js.map'
    },
    resolve: {
        extensions: ['', '.ts', '.js', '.json', '.css', '.html']
    },
    module: {
        loaders: [{
            test:/\.tsx?$/,
            loader: 'ts',
            exclude: [/node_modules/]
        }, {
            test: /\.html$/,
            loader: 'html'
        }]
    },
    externals: [
        (function () {
            var IGNORES = [
                'electron'
            ];
            return function (context, request, callback) {
                if (IGNORES.indexOf(request) >= 0) {
                    return callback(null, "require('" + request + "')");
                }
                return callback();
            };
        })()
    ]
};
