var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'canimation.min.js',
		publicPath: "/dist"
	},
	devServer: {
    contentBase: false,
    compress: true,
    hot: true,
    port: 3000
  },
	module: {
		loaders: [
			{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ],

    plugins: [
      new webpack.optimize.UglifyJsPlugin()
    ]
  }
}