define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                Q.http.text2(data.contentTemplateURL, {
            		onsuccess: function(xhr, template){
		                callback(null,{contentTemplate:template});
            		},
            		onfailure: function(xhr, err){
            			callback(err, null);
            		}
            	});
            }
        }
    };
});

