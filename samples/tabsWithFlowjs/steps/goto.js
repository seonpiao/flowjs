define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data, callback){
                var curr = data.goto;
                var titles = data.titles;
                var contents = data.contents;

                titles.removeClass("current");
                Q.$(titles[curr - 1]).addClass("current");

                contents.removeClass("current");
                Q.$(contents[curr - 1]).addClass("current");

                callback(null,{curr:curr});
            }
        }
    };
});