define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                var delay = 6000;
                if(this._timer){
                    clearTimeout(this._timer);
                }
                this._timer = setTimeout(function(){
                    callback();
                },delay);
            }
        }
    };
});