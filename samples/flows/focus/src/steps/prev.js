define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                var total = data.frames.length;
                var prev = data.curr;
                var curr = data.curr - 1;
                if(curr < 1){
                    curr = total;
                }
                console.log(curr);
                callback(null,{curr:curr,prev:prev,dir:'prev'});
            }
        }
    };
});