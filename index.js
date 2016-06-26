var loaderUtils = require("loader-utils");
var mime = require("mime");
module.exports = function(content) {
	this.cacheable && this.cacheable();
	console.log("hello " + this.resourceQuery);
	console.log(content.toString());

	var stringValue = content.toString();
	var replaced = stringValue.replace(/"#4b535e"/, "\"#F00\"");

	return "module.exports = " + JSON.stringify("data:image/svg+xml;base64," + new Buffer(replaced).toString("base64"));
}
module.exports.raw = true;
