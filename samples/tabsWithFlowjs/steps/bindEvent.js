define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                var _this = this;
                var wrapper = data.wrapper;
                var titles = data.titles;
                var contents = data.contents;

                this._once(function(){
                    titles.forEach(function(title, i){
                        title = Q.$(title);
                        title.on("click", function(e){
                            var curr = i + 1;
                            _this._select('click', {goto:curr});
                        });
                    });
                });
                callback();
            }
        }
    };
});