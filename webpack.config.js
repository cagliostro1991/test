const path = require('path');
const webpack = require('webpack');
const env = require('./.env');
const copyWebpackPlugin = require('copy-webpack-plugin');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.js',
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                },
            },
            {
                test: /\.html$/,
                loader: 'raw-loader',
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]',
                },
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.sass$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            indentedSyntax: true,
                        },
                    },
                ],
            },
            {
                test: /\.(woff2|woff|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.jsx', '.json', '.html'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
        },
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
    },
    performance: {
        hints: false,
    },
    devtool: '#eval-source-map',
    plugins: [
        new cleanWebpackPlugin('./dist'),
        new copyWebpackPlugin([{
            from: 'public',
            to: '',
        }]),
        new webpack.DefinePlugin({
            'process.env': env,
        }),
        new htmlWebpackPlugin({
            template: './src/index.html', // HTML Template load
            minify: process.env.NODE_ENV === 'production' ? {
                minifyJS: true,
                minifyCSS: true,
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
            } : false,
        }),
    ],
};

// -------------------
//  Production 
// -------------------
if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    module.exports.plugins = (module.exports.plugins || []).concat([
        new uglifyJsPlugin({
            uglifyOptions: {
                sourceMap: true,
                compress: {
                    warnings: false,
                },
            },
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
    ]);

    // -------------------
    //  Development 
    // -------------------
} else {
    module.exports.mode = 'development';
    module.exports.devServer = {
        port: 3000,
        hot: true,
        host: 'localhost',
        historyApiFallback: true,
        noInfo: false,
        contentBase: './dist',
    };
}