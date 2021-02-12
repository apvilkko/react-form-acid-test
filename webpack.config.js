const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.ts',
  },
  module: {
    rules: [
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
