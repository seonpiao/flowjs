define(function(require, exports, module) {
	module.exports = function(url, options, type) {
		var func;
		type = type || "text";
		switch (type) {
			case "json":
				func = Q.http.json2;
				break;
			case "text":
				func = Q.http.text2;
				break;
			default:;
		}
		func(url, options);
	};
});