define(function(require,exports,module){
    module.exports = {
        go:function(data,callback){
            Q.http.json2(data.contentDataURL, {
                onsuccess: function(xhr, obj){
                    callback({contentData:obj});
                },
                onfailure: function(xhr, err){
                    callback(null);
                }
            });
        }
    };
});
