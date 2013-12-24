define(function(require,exports,module){
    module.exports = {
        go:function(data,callback){
            Q.http.text2(data.templateURL, {
        		onsuccess: function(xhr, template){
	                callback({template:template});
        		},
        		onfailure: function(xhr, err){
        			callback(null);
        		}
        	});
        }
    };
});

