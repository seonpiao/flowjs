define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                var wrapper = data.wrapper;
                var titles = wrapper.down('[data-tabs-elem=title]');
                var contents = wrapper.down('[data-tabs-elem=content]');
                callback(null, {
                    titles: titles,
                    contents:contents
                });
            }
        }
    };
});
