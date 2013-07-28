define(function(require, exports, module) {
    var Class = Flowjs.Class;
    var Flow = Flowjs.Flow;
    var CommonFocusFlow = Class({
        extend:Flow,
        construct:function(options){
            this.callsuper(options);
            this._addStep('循环体',Flowjs.Step);
            this._addStep('是否跳出循环',Flowjs.Condition);
        },
        methods:{
            //初始化流程
            init:function(){
                var _this = this;
                this._go('循环体');
                this._go('是否跳出循环',null,{
                    cases:{
                        'yes':function(){
                            var d2 = Date.now();
                        },
                        'no':function(){
                            _this._go('循环体');
                        }
                    }
                });
            }
        }
    });

    module.exports = CommonFocusFlow;
});

