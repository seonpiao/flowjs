define(function(require,exports,module){
	var template = require('../lib/artTemplate/template');
    module.exports = {
        go:function(data,callback){
        	var contentWrapper = data.contentWrapper;
            var contentDataURL = contentWrapper.attr("data-tabs-contentdataurl");
            var contentTemplateURL = contentWrapper.attr("data-tabs-contenttemplateurl");
            callback({
                contentDataURL: contentDataURL,
                contentTemplateURL: contentTemplateURL
            });
        }
    };
});