const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Decide if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Create a CSS file in production but inlines the styles in development
const extractSass = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: !isProduction,
});

module.exports = {
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
      use: extractSass.extract({
        use: [{
          loader: 'css-loader',
          options: {
            modules: true,
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
      title: 'Opsview Web',
    }),
    extractSass,
  ],
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
