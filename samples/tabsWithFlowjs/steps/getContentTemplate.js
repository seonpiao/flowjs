define(function(require,exports,module){
    module.exports = {
        go:function(data,callback){
            Q.http.text2(data.contentTemplateURL, {
        		onsuccess: function(xhr, template){
	                callback({contentTemplate:template});
        		},
        		onfailure: function(xhr, err){
        			callback(null);
        		}
        	});
        }
    };
});

