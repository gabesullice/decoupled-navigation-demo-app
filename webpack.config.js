const path = require('path');

module.exports = {
  mode: 'development',
  entry: "./src/app",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [{
      test: /\.(js|jsx)/,
      exclude: /node_modules/,
      use: [{
        loader: "babel-loader",
      }],
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
