define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                var _this = this;
                var wrapper = data.wrapper;
                var titleContainers = data.titleContainers;
                var contentContainers = data.contentContainers;

                this._once(function(){
                    titleContainers.forEach(function(title, i){
                        title = Q.$(title);
                        title.on("click", function(e){
                            var contentWrapper = Q.$(contentContainers[i]);
                            var contentReady = contentWrapper.attr("data-tabs-contentready");
                            var curr = i + 1;
                            if(contentReady){
                                _this._select('show', {goto:curr});
                            }else{
                                _this._select('showWithRender', {
                                    goto: curr,
                                    wrapper: contentWrapper
                                });
                            }
                        });
                    });
                });
                callback();
            }
        }
    };
});