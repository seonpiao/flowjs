define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                Q.http.json2(data.contentDataURL, {
                    onsuccess: function(xhr, obj){
                        callback(null,{contentData:obj});
                    },
                    onfailure: function(xhr, err){
                        callback(err, null);
                    }
                });
            }
        }
    };
});
