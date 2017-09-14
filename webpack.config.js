var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var env = process.env.WEBPACK_ENV || 'dev';
var WebpackDevServer = require('webpack-dev-server');
var path = require('path');

const ROOT_PATH = path.resolve(__dirname);

var appName = 'app';
var host = '0.0.0.0';
var port = '8000';

var plugins = [], outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = appName + '.min.js';
} else {
  outputFile = appName + '.js';
}

var config = {
  entry: './client/src/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/client/lib',
    filename: outputFile,
    publicPath: __dirname + '/client/example'
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=20000',
        include: path.resolve(ROOT_PATH, 'client/src/assets/img')
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      /*{
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }*/
    ]
  },
  resolve: {
    root: path.resolve('./client/src'),
    extensions: ['', '.js', '.jsx'],
    assets: path.resolve('./client/src/assets'),
    styles: path.resolve('./client/src/styles'),
    services: path.resolve('./client/src/services')
  },
  plugins: plugins
};

if (env === 'dev') {
  new WebpackDevServer(webpack(config), {
    contentBase: './client/example',
    hot: true,
    debug: true
  }).listen(port, host, function (err, result) {
    if (err) {
      console.log(err);
    }
  });
  console.log('-------------------------');
  console.log('Local web server runs at http://' + host + ':' + port);
  console.log('-------------------------');
}

module.exports = config;
