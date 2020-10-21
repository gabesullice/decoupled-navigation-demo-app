const fs = require('fs');
const path = require('path');
const process = require('process');

if (!fs.existsSync(path.resolve(__dirname, ".env.js"))) {
  console.log("You must create a .env.js file. See https://github.com/gabesullice/decoupled-navigation-demo-app#front-end-setup.");
  process.exit(1);
}

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
    modules: [
      "node_modules",
    ],
  },
};
