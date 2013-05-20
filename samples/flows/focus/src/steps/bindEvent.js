define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                var smalls = data.smalls;
                var _this = this;
                var wrapper = data.wrapper;
                var prev = wrapper.down('[data-focus-elem=prev]');
                var next = wrapper.down('[data-focus-elem=next]');
                var imgwrapper = wrapper.down('[data-focus-elem=imgwrapper]');
                this._once(function(){
                    smalls.on("mouseover",function(e){
                        var target = Q.$(Q.event.get(e).target);
                        if(target.attr('data-focus-index')){
                            var curr = parseInt(target.attr('data-focus-index'),10);
                            _this._select('click',{goto:curr});
                        }
                    });
                    if(imgwrapper){
                        imgwrapper.on('mouseenter',function(){
                            _this._select('mouseonfocus');
                        });
                        imgwrapper.on('mouseleave',function(){
                            _this._select('mouseoutfocus');
                        });
                    }
                    if(prev){
                        prev.on('click',function(){
                            _this._select('prev');
                        });
                    }
                    if(next){
                        next.on('click',function(){
                            _this._select('next');
                        });
                    }
                });
                callback();
            }
        }
    };
});