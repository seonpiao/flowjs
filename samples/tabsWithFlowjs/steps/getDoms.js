define(function(require,exports,module){
    module.exports = {
        go:function(data,callback){
            var wrapper = data.wrapper;
            var titles = wrapper.down('[data-tabs-elem=title]');
            var contents = wrapper.down('[data-tabs-elem=content]');
            callback({
                titleContainers: titles,
                contentContainers:contents
            });
        }
    };
});
