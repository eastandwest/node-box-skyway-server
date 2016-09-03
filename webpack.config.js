var webpack = require('webpack')

var path = require('path')
  , _entry;
const PORT = 8080

switch(process.env.NODE_ENV) {
  case "test":
  default:
    _entry = {
      "skyway-box-react-folder": "./client_libs/entry-folder.js",
      "skyway-box-react-file": "./client_libs/entry-file.js"
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
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  devServer:{
    port: process.env.PORT || PORT
  }
}
