var webpack = require('webpack')
var path = require('path')

module.exports = {
	entry: ['./src/index.js'],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'index.js',

		library: 'react-ui-form',
		libraryTarget: 'umd'
	},
	module: {
		loaders: [
			{ test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel'] },
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx', '.json'],
		modulesDirectories: ['node_modules', 'src']
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		})
	],
	externals: {
		"react": "react"
	},
	devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : '',
	node: {
		//console: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	}
}
