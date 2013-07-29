define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                Q.http.json2(data.dataURL, {
                    onsuccess: function(xhr, obj){
                        callback(null,{data:obj});
                    },
                    onfailure: function(xhr, err){
                        callback(err, null);
                    }
                });
            }
        }
    };
});
