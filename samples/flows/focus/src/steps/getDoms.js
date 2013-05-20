define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                var wrapper = data.wrapper;
                var frames = wrapper.down('[data-focus-elem=frame]');
                var smalls = wrapper.down('[data-focus-elem=btn]');
                var cnt = wrapper.down('[data-focus-elem=cnt]');
                callback(null,{frames:frames,smalls:smalls,cnt:cnt});
            }
        }
    };
});
