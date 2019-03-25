import path from 'path';
import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';

const distDir = path.resolve(__dirname, 'dist');

const config: webpack.Configuration = {
	entry: './src/index.ts',
	output: {
		filename: 'index.js',
		path: path.resolve(distDir, 'js'),
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
			},
		],
	},

	plugins: [
		new CopyPlugin([
			{
				from: './src/index.html',
				to: distDir,
			},

			{
				from: './src/pdf/*',
				to: path.resolve(distDir, 'pdf'),
				flatten: true,
			},

			{
				from: './src/css/*',
				to: path.resolve(distDir, 'css'),
				flatten: true,
			},
		]),
	],

	devServer: {
		contentBase: distDir,
		compress: true,
		port: 9000,
		open: true,
		writeToDisk: true,
	},

	performance: {
		hints: false,
	},
};

export default config;
