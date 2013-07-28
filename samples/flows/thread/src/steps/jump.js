define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                if(!this._count){
                    this._count = 0;
                }
                this._count++;
                if(this._count > 2000){
                    this._select('yes');
                }
                else{
                    this._select('no');
                }
                callback();
            }
        }
    };
});