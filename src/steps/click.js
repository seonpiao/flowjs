define(function(require,exports,module){
    var Class = require('../util/class');
    var InputStep = require('../input');
    var Step = Class({
        extend:InputStep,
        construct:function(options){
            this.callsuper(options);
        },
        methods:{
            enter:function(data,callback){
                var _this = this;
                this._wait(function(){
                    var btn = Q.$('input');
                    btn.on('click',function(){
                        var fn = _this._inputs['click'];
                        fn.call(_this);
                    });
                });
                callback();
            }
        }
    });
    
    module.exports = Step;
});
