const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Decide if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Create a CSS file in production but inlines the styles in development
const extractSassAndCss = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: !isProduction,
});

const config = {
  // Our mounting file
  entry: './src/index.js',
  output: {
    // We output to `./dist`, this is where all static assets go when they are
    // generated by Webpack
    path: `${__dirname}/dist`,
    // The name of our bundle
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      // Matches any .js files
      test: /\.js$/,
      exclude: /node_modules/,
      // We use babel to load these files. In .babelrc we use the `env` plugin
      // to give us the most recent next generation JavaScript features that are
      // then transpiled using this plugin
      loader: 'babel-loader',
    }, {
      // Matches any .scss files
      test: /\.scss$/,
      // Use our defined plugin to load the SASS through the css loader which
      // sorts out CSS Modules and minimising
      use: extractSassAndCss.extract({
        use: [{
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[name]__[local]--[hash:base64:5]',
            minimize: true,
          },
        }, {
          // The sass loader interprets and compiles the sass using node-sass
          loader: 'sass-loader',
        }],
        // We fallback to this if the extractSass plugin is disabled. This will
        // inline the styles instead of creating a new file for them. We do this
        // to ensure the CSS can load even if the JavaScript can't
        // #progressivewebapp
        fallback: 'style-loader',
      }),
    }, {
      test: /\.css$/,
      // Pull the CSS out for plain old CSS and stick it in a file
      use: extractSassAndCss.extract({
        use: ['css-loader'],
        fallback: 'style-loader',
      }),
    }, {
      // Bring all our file content
      test: /\.(png|jpg|jpeg|svg|gif)/,
      use: [{
        loader: 'url-loader',
        options: {
          // Ensure only files smaller than ~4mb are turned into data urls and others are handled as
          // normal files
          limit: 4096,
        },
      }],
    }],
  },
  // The sourcemap helps us debug in production by creating a file that we can
  // use to rebuild our JavaScript source tree to make it readable instead of a
  // minified mess!
  devtool: isProduction ? 'cheap-module-source-map' : 'eval',
  plugins: [
    // This generates our index.html file and adds in the script tag for the
    // `bundle.js` file
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      favicon: './src/assets/favicon.ico',
      title: 'Opsview Web',
    }),
    extractSassAndCss,
  ],
  devServer: {
    // Used for resolving an error when binding to 0.0.0.0
    disableHostCheck: true,
    host: '0.0.0.0',
  },
};

if (process.env.OPSVIEW_URL) {
  config.devServer.proxy = {
    '/rest': {
      target: process.env.OPSVIEW_URL,
    },
  };
}

module.exports = config;
