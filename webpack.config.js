const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.ts',
  },
  target: ['web', 'es5'], // transform arrow functions in webpackBootstrap so that this works in ie
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'node_modules', 'react-hook-form')],
      },
      {
        test: /\.(ts|tsx)$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: { extensions: ['.js', '.jsx', '.tsx', '.ts', '.json'] },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Form Acid Test',
    }),
  ],
  devServer: {
    compress: true,
    port: 9000,
  },
}
