define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                callback(null,{curr:1,prev:1});
            }
        }
    };
});