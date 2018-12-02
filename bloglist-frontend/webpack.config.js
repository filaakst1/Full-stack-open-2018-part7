const path = require('path')
const webpack = require('webpack')

const config = (env, argv) => {
  console.log('argv', argv.mode)

  const backend_url = argv.mode === 'production'
    ? 'https://filaakst1-full-stack-open-2018-part7-backend.now.sh'
    : 'http://localhost:3003'
  return {
    entry: ['@babel/polyfill','./src/index.js'],
    output: {
      path: path.resolve( __dirname, 'dist'),
      filename: 'main.js'
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      compress: true,
      port: 3000
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            query: {
              presets: [
                '@babel/preset-env',
                '@babel/react'
              ],
              plugins: [
                require('babel-plugin-transform-class-properties'),
              ]
            }
          }
        },
        {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url)
      })
    ]    

  }
}
module.exports = config