define(function(require,exports,module){
    var Class = require('./util/class');
    var Condition = require('./condition');
    var extend = require('./util/extend');
    var Input = Class({
        extend:Condition,
        construct:function(options){
            options = options || {};
            this.callsuper(options);
            this._inputs = options.inputs || {};
            this._binded = false;
        },
        methods:{
            //为了该步骤可重入，并且不会重复绑定事件
            _once:function(callback){
                if(!this._binded){
                    this._binded = true;
                    callback();
                }
            },
            inputs:function(data){
                var tmp = {};
                tmp.cases = data.inputs;
                return this.cases(tmp);
            }
        }
    });

    module.exports = Input;
});