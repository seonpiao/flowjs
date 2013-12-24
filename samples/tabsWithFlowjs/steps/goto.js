define(function(require,exports,module){
    module.exports = {
        go:function(data, callback){
            var curr = data.goto || 1;
            var titleContainers = data.titleContainers;
            var contentContainers = data.contentContainers;

            titleContainers.removeClass("current");
            Q.$(titleContainers[curr - 1]).addClass("current");

            contentContainers.removeClass("current");
            var contentWrapper = Q.$(contentContainers[curr - 1]);
            contentWrapper.addClass("current");

            callback({curr:curr,contentWrapper:contentWrapper});
        }
    };
});