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
                        titleContainers:{type:'object'},
                        contentContainers:{type:'object'}
                    }
                };
            }
        }
    });
    
    module.exports = ConditionStep;
});
