define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data, callback){
                var curr = data.goto;
                var titleContainers = data.titleContainers;
                var contentContainers = data.contentContainers;

                titleContainers.removeClass("current");
                Q.$(titleContainers[curr - 1]).addClass("current");

                contentContainers.removeClass("current");
                var contentWrapper = Q.$(contentContainers[curr - 1]);
                contentWrapper.addClass("current");

                callback(null,{curr:curr,contentWrapper:contentWrapper});
            }
        }
    };
});