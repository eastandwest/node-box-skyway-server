var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var path = require('path')
  , _entry;
const PORT = 8080

switch(process.env.NODE_ENV) {
  case "test":
  default:
    _entry = {
      "skyway-box-react-folder": "./client_libs/entry-folder.jsx",
      "skyway-box-react-file": "./client_libs/entry-file.jsx"
    };
    break;
}

module.exports = {
  entry: _entry,
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "public/scripts"),
    publicPath: "public/scripts",
    filename: process.env.NODE_ENV === "production" ? "[name].build.min.js" : "[name].build.js"
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /(node_modules)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['react', 'es2015']
        }
      },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!sass?sourceMap')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!less?sourceMap')
      },
      {
        test: /\.(woff|svg|ttf|eot)([\?]?.*)$/,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  },
  devServer:{
    port: process.env.PORT || PORT
  }
}
