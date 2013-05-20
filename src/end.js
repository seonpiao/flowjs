define(function(require,exports,module){
    var Class = require('./util/class');
    var Step = require('./step');
    var End = Class({
        extend:Step,
        construct:function(options){
            this.callsuper(options);
        }
    });
    
    module.exports = End;
});
