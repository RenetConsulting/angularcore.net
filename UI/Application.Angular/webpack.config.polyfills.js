/*
In the DOS prompt run:
	webpack --config webpack.config.polyfills.js
*/
const path = require('path');
const webpack = require('webpack');
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

const polyfills = [
	'core-js/es6/symbol',
	'core-js/es6/object',
	'core-js/es6/function',
	'core-js/es6/parse-int',
	'core-js/es6/parse-float',
	'core-js/es6/number',
	'core-js/es6/math',
	'core-js/es6/string',
	'core-js/es6/date',
	'core-js/es6/array',
	'core-js/es6/regexp',
	'core-js/es6/map',
	'core-js/es6/weak-map',
	'core-js/es6/set',

	'core-js/es6/reflect',
	'core-js/es7/reflect',

	'core-js/client/shim.min.js',
	'classlist.js/classList.min.js',
	'intl',
	'web-animations-js',
	'js-polyfills',
	'blob.js',
	'formdata-polyfill',
];

module.exports = (env) => {
	const isDevBuild = !(env && env.prod);
	const sharedConfig = {
		devtool: 'nosources-source-map',
		stats: { modules: false },
		resolve: { extensions: ['.js'] },
		output: { path: path.join(__dirname, 'wwwroot', 'dist') },
		entry: {
			'polyfills': polyfills
		},
		output: {
			publicPath: '/dist/',
			path: path.join(__dirname, 'wwwroot', 'dist'),
			filename: '[name].js'
		},
		plugins: [
			new webpack.NoEmitOnErrorsPlugin(),
			// has bug https://stackoverflow.com/questions/44781415/angular-build-breaks-when-using-prod-flag
			new UglifyjsWebpackPlugin({
				compress: false,
				mangle: false,
				comments: false
			})
		]
	};

	return [sharedConfig];
}