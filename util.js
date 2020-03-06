function toHex(value) {
	var hex = parseInt(value).toString(16);
	return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + toHex(r) + toHex(g) + toHex(b);
}

function parseQueryString(queryString) {
	var parts = queryString
		.substring(1) //remove leading ?
		.split("&")

	return parts.reduce((output, val) => {
		var arr = val.split("=");
		//Handle query string parameters with no value as ""
		output[arr[0].toLowerCase()] = arr.length === 1 ? "" : unescape(arr[1]);
		return output
	}, {});
}

module.exports = {
    rgbToHex,
    parseQueryString,
}