var webpack = require('webpack')
var path = require('path')

module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	context: path.join(__dirname, 'src'),
	entry: [path.join(__dirname, 'src', 'index.js')],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'index.js',

		library: 'react-ui-formalize',
		libraryTarget: 'umd',
	},
	module: {
		rules: [
			{ test: /\.jsx?$/, exclude: /node_modules/, use: ['babel-loader'] },
		],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
		modules: ['node_modules', 'src'],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV),
			},
		}),
	],
	externals: {
		react: 'react',
	},
	devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : '',
	node: {
		//console: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
	},
}
