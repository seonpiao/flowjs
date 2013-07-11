define(function(require,exports,module){
	var template = require('../lib/artTemplate/template');
    module.exports = {
        methods:{
            _process:function(data,callback){
            	var contentWrapper = data.contentWrapper;
                var contentDataURL = contentWrapper.attr("data-tabs-contentdataurl");
                var contentTemplateURL = contentWrapper.attr("data-tabs-contenttemplateurl");
                callback(null, {
                    contentDataURL: contentDataURL,
                    contentTemplateURL: contentTemplateURL
                });
            }
        }
    };
});