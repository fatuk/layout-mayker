const path = require('path');

module.exports = {
  mode: 'production',
  watch: true,
  watchOptions: {
    poll: 1000,
    ignored: /node_modules/,
  },
  entry: './code.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'code.js',
    path: path.resolve(__dirname, './'),
  },
};
