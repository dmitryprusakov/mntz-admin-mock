const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function (env, { mode }) {
  return {
    mode: mode || 'development',
    devtool: 'source-map',
    entry: './src/index.tsx',
    devServer: {
      port: 8080,
      historyApiFallback: true,
      client: {
        overlay: false,
      },
      proxy: {
        '/api/json/**': {
          target: 'https://641084477b24bb91f21fd1e1.mockapi.io',
          changeOrigin: true,
          secure: false,
        },
      }
    },
    output: {
      publicPath: '/mntz-admin-mock/',
      filename: path.join('js', `bundle${mode === "production" ? ".[fullhash]" : ""}.js`),
      chunkFilename: path.join('js', 'chunks', '[name].[contenthash].js'),
    },
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.less'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-react', '@babel/preset-typescript'],
          },
        },
        {
          test: /\.less$/i,
          use: [
            {
              loader: mode !== "production" ? "style-loader" : MiniCssExtractPlugin.loader,
            },
            'css-loader',
            {
              loader: "less-loader",
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                  modifyVars: {
                    'primary-color': '#3772FF',
                    'link-color': '#3772FF',
                    // 'border-radius-base': '12px',
                  },
                },
              }
            }
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: mode !== "production" ? "style-loader" : MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: {
                  localIdentName: mode === "production" ? "[local]-[hash:base64:5]" : "[path]__[local]--[hash:base64:5]",
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new ESLintPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "src/locales",
            to: "locales",
          },
          {
            from: "public/manifest.json",
          },
          {
            from: "public/images",
            to: "images"
          },
          {
            from: "icons",
            to: "icons",
          }
        ],
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        publicPath: '/mntz-admin-mock/',
        minify: mode === 'production' && {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
    ].concat(mode !== 'production' ? [] : [
      new MiniCssExtractPlugin({
        filename: path.join("css", `bundle${mode === "production" ? ".[fullhash]" : ""}.css`),
        chunkFilename: path.join("css", "chunks", "[name].[contenthash].css"),
      }),
    ]),
  };
};
