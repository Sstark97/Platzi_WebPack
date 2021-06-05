const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const DotEnv = require('dotenv-webpack');
const { webpack }  = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name][contenthash].js',
        assetModuleFilename: 'assets/images/[hash][ext][query]' 
    },
    mode: 'development',
    watch:true,
    resolve: {
        extensions: ['.js'],
        alias: {
            '@utils': path.resolve(__dirname,'src/utils/'),
            '@templates': path.resolve(__dirname,'src/templates/'),
            '@styles': path.resolve(__dirname,'src/styles/'),
            '@images': path.resolve(__dirname,'src/assets/images/')
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },

            {
                test: /\.css|.styl$/i,
                use: [MiniCssExtractPlugin.loader,
                'css-loader',
                'stylus-loader'
                ]

            }, {
                test: /\.png/,
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2)$/,
                use: {
                    loader: 'url-loader',
                    options : {
                        limit: 10000,
                        mimetype: "application/font-woff",
                        name: "[name].[contenthash].[ext]",
                        outputPath: "./assets/font",
                        publicPath: "../assets/fonts",
                        esModule: false
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            inject: true,
            template: './public/index.html',
            filename: './index.html',
            templateParameters(compilation, assets, options) {
                return {
                  compilation: compilation,
                  webpack: compilation.getStats().toJson(),
                  webpackConfig: compilation.options,
                  htmlWebpackPlugin: {
                    files: assets,
                    options: options
                  },
                  process,
                };
            }
        }),

        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"),
                    to: "assets/images"
                }
            ]
        }),
        new DotEnv(),
        new webpack.DefinePlugin({
            "process.env.API": JSON.stringify(process.env.API)
        })
    ]
}