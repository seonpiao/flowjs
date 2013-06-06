define(function(require,exports,module){
    var Class = Flowjs.Class;
    var Step = Flowjs.Input;
    var ConditionStep = Class({
        extend:Step,
        construct:function(options){
            this.callsuper(options);
        },
        isAbstract:true,
        methods:{
            _describeData:function(){
                return {
                    input:{
                        titles:{type:'object'},
                        contents:{type:'object'}
                    }
                };
            }
        }
    });
    
    module.exports = ConditionStep;
});
