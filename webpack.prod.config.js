const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { vendorExcludeModules, reactUI, react } = require("./configs/chunks");

module.exports = (env, argv) => ({
	mode: argv.mode,
	devtool: argv.mode === "development" ? "eval-source-map" : "none",
	entry: {
		app: ["babel-polyfill", path.join(__dirname, "./src/index")],
		app1: [path.join(__dirname, "./src/index1")],
	},
	output: {
		path: path.join(__dirname, "./bundles"),
		filename: "[name]/[name].js",
		publicPath: "/theme/bundles/",
	},
	module: {
		rules: [
			{
				test: /\.js|jsx$/,
				exclude: /node_modules/,
				use: "babel-loader",
			},
			{
				type: "javascript/auto",
				test: /\.json$/,
				use: "json-loader",
			},
			{
				test: /\.css$/,
				use: [
					{ loader: "style-loader" },
					{
						loader: "css-loader",
						options: {
							modules: false,
						},
					},
				],
			},
			{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							modules: false,
							minimize: true,
						},
					},
					{
						loader: "less-loader",
					},
				],
			},
			{
				test: /\.sass|scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							modules: false,
							minimize: true,
						},
					},
					{
						loader: "sass-loader",
					},
				],
			},
			{
				test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
				use: "url-loader?limit=300000&name=[name]-[hash].[ext]!img?progressive=true",
			},
		],
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: false,
			}),
			new OptimizeCSSAssetsPlugin({}),
		],
		splitChunks: {
			cacheGroups: {
				commons: {
					test(module) {
						if (!module.context.includes("node_modules")) {
							return false;
						}
						return !vendorExcludeModules.some(str => module.context.includes(str));
					},
					name: "vendors",
					chunks: "all",
					reuseExistingChunk: true,
				},
				reactUI: {
					test(module) {
						return reactUI.some(str => module.context.includes(str));
					},
					name: "reactUI",
					chunks: "all",
					reuseExistingChunk: true,
				},
				react: {
					test(module) {
						return react.some(str => module.context.includes(str));
					},
					name: "react",
					chunks: "all",
					reuseExistingChunk: true,
					enforce: true,
				},
			},
		},
	},
	plugins: [
		new CleanWebpackPlugin([
			path.resolve("./bundles/"),
		], { root: path.dirname(__dirname), verbose: true }),
		new MiniCssExtractPlugin({
			filename: "./bundles/[name]/[name].css",
		}),
	],
});
