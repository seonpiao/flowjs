define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                if(data.cnt){
                    data.cnt.html(data.data.list[data.curr].title);
                }
                callback();
            }
        }
    };
});