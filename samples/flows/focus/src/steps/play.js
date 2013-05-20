define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                var curr = data.curr;
                var total = data.frames.length;
                var currElem = Q.$(data.frames[data.curr - 1]);
                data.frames.hide();
                currElem.show();
                callback();
            }
        }
    };
});