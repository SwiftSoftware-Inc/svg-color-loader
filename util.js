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
    parseQueryString,
}