define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                var smalls = data.smalls;
                smalls.removeClass('selected');
                Q.$(smalls[data.curr - 1]).addClass('selected');
                callback();
            }
        }
    };
});