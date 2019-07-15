const path = require("path");

module.exports = {
	app: ["babel-polyfill", path.join(__dirname, "../src/App")],
};