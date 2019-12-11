var path = require('path')
var webpack = require('webpack')
var project = require('../package.json')
var vendors = Object.keys(project.dependencies)

module.exports = {
  entry: {
    vendors: vendors,
  },
  output: {
    path: path.resolve(__dirname, '../static'),
    filename: '[name].bundle.js',
    library: '[name]',
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DllPlugin({
      path: path.join(__dirname, '../static', 'manifest.json'),
      name: '[name]',
      filename: '[name].js',
      context: path.join(__dirname, '../static'),
    })
  ],
  node: {
    fs: 'empty',
  }
};
