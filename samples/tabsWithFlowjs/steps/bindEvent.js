define(function(require,exports,module){
    module.exports = {
        go:function(data,callback,trigger){
            var _this = this;
            var wrapper = data.wrapper;
            var titleContainers = data.titleContainers;
            var contentContainers = data.contentContainers;

            titleContainers.forEach(function(title, i){
                title = Q.$(title);
                title.on("click", function(e){
                    var contentWrapper = Q.$(contentContainers[i]);
                    var contentReady = contentWrapper.attr("data-tabs-contentready");
                    var curr = i + 1;
                    if(contentReady){
                        trigger({goto:curr},'show');
                    }else{
                        trigger({
                            goto: curr,
                            wrapper: contentWrapper
                        },'showWithRender');
                    }
                });
            });

            callback(data);
        }
    };
});