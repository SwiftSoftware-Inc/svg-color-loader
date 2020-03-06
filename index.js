var SVGO = require("svgo");
var { rgbToHex, parseQueryString } = require('./util')

module.exports = async function(content) {
	this.cacheable && this.cacheable()
	var callback = this.async()

	var params = parseQueryString(this.resourceQuery)

	// Assert that we have a fill parameter
	if (!params.fill) {
		callback(new Error("No fill parameter provided for SVG: " + this.resourcePath))
		return 
	}
	
	var fillColor = rgbToHex(...params.fill.split("|"))
	
	var svgoWithPlugins = new SVGO({
		plugins: [
			{
				"ReFillColors": {
					type: "perItem",
					fn: function(item) {
						if (item.isElem(["circle", "ellipse", "line", "path", "polygon", "polyline", "rect"]))
							item.addAttr({ name: "fill", value: fillColor, prefix: "", local: "fill" });
					}
				}
			},
			{
				"ViewBoxToWidthHeight": {
					type: "perItem",
					fn: function(item) {
						//A lot of code here came from: https://github.com/svg/svgo/blob/master/plugins/removeViewBox.js
						var regViewBox = /^0\s0\s([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)\s([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)$/;
						if (item.isElem("svg") && item.hasAttr("viewBox")) {
							var match = item.attr("viewBox").value.match(regViewBox);
							if (match) {
								var width = match[1];
								var height = match[3];
					
								item.addAttr({ name: "width", value: width, prefix: "", local: "width" });
								item.addAttr({ name: "height", value: height, prefix: "", local: "height" });
					
								item.removeAttr("viewBox");
							}
						}
					}
				}
			}
		]
	})
	
	try {
		var result = await svgoWithPlugins.optimize(content.toString());
		callback(null, "module.exports = " + JSON.stringify("data:image/svg+xml;base64," + Buffer.from(result.data).toString("base64")))
	} catch (e) {
		callback(e)
	}
}

module.exports.raw = true;