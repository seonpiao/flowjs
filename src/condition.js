define(function(require,exports,module){
    var Class = require('./util/class');
    var Step = require('./step');
    var extend = require('./util/extend');
    var Condition = Class({
        extend:Step,
        construct:function(options){
            options = options || {};
            this.callsuper(options);
            this._cases = options.cases || {};
            this._default = options.defaultCase;
        },
        isAbstract:true,
        methods:{
            _select:function(condition,data){
                var fn = this._cases[condition] || this._default;
                var _this = this;
                setTimeout(function(){
                    if(_this._newflow){
                        _this._newflow();
                    }
                    fn(data);
                },0);
            },
            cases:function(data){
                if(data){
                    if(data.cases){
                        extend(this._cases,data.cases);
                    }
                    if(data.defaultCase){
                        this._default = data.defaultCase;
                    }
                    if(data.newflow){
                        this._newflow = data.newflow;
                    }
                }
                else{
                    return {
                        defaultCase:this._default,
                        cases:this._cases
                    };
                }
            }
        }
    });

    module.exports = Condition;
});
