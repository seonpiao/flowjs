define(function(require,exports,module){
    var Class = Flowjs.Class;
    var Step = Flowjs.Step;
    var FocusTemplate = Class({
        extend:Step,
        construct:function(options){
            this.callsuper(options);
        }
    });
    
    module.exports = FocusTemplate;
});
