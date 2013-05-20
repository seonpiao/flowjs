define(function(require,exports,module){
    var Class = Flowjs.Class;
    var Step = Flowjs.Input;
    var ConditionStep = Class({
        extend:Step,
        construct:function(options){
            this.callsuper(options);
        },
        methods:{
            _describeData:function(){
                return {
                    input:{
                        frames:{type:'object'},
                        smalls:{type:'object'},
                        wrapper:{type:'object'}
                    }
                };
            }
        }
    });
    
    module.exports = ConditionStep;
});
