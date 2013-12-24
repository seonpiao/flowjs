define(function(require,exports,module){
    module.exports = {
        go:function(data,callback){
            Q.http.json2(data.dataURL, {
                onsuccess: function(xhr, obj){
                    callback({data:obj});
                },
                onfailure: function(xhr, err){
                    callback(null);
                }
            });
        }
    };
});
