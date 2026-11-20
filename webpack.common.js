const path = require('path');
const stdLibBrowser = require('node-stdlib-browser');
const { NodeProtocolUrlPlugin } = require('node-stdlib-browser/helpers/webpack/plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    alias: stdLibBrowser,
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        // quizdown's package.json has "type": "module" but its prebuilt files are UMD;
        // parse them as CommonJS/auto so webpack does not treat them as strict ESM.
        test: /node_modules[\\/]quizdown[\\/]public[\\/]build[\\/].*\.js$/,
        type: 'javascript/auto',
        resolve: { fullySpecified: false },
      },
      {
        // Docsify's theme stylesheets are linked from index.html. Emitting them next
        // to main.js keeps them at the installed docsify version, with no CDN.
        test: /docsify[\\/]dist[\\/]themes[\\/].*\.min\.css$/,
        type: 'asset/resource',
        generator: { filename: 'themes/[name][ext]' },
      },
      {
        test: /\.[jt]s$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          },
        },
      },
    ],
  },
  plugins: [
    new NodeProtocolUrlPlugin(),
    new webpack.ProvidePlugin({
      process: stdLibBrowser.process,
      Buffer: [stdLibBrowser.buffer, 'Buffer'],
    }),
  ],
};
