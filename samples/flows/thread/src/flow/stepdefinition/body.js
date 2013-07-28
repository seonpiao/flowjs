define(function(require,exports,module){
    var Class = Flowjs.Class;
    var Step = Flowjs.Input;
    var ConditionStep = Class({
        extend:Step,
        construct:function(options){
            this.callsuper(options);
        },
        isAbstract:true
    });
    
    module.exports = ConditionStep;
});
