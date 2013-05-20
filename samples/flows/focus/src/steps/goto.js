define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                var prev = data.curr;
                var curr = data.goto;
                callback(null,{prev:prev,curr:curr,dir:'none'});
            }
        }
    };
});