const path = require('path');
// const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './dist/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    mode: 'development',
    watch: true,
    //   plugins: [
    //     new htmlWebpackPlugin({
    //       filename: 'index.html',
    //       template: './src/index.html'
    //     })
    //   ],
    module: {
        rules: [{
            test: /index.js/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    }
};