define(function(require,exports,module){
    var Class = require('./util/class');
    var Step = require('./step');
    var Begin = Class({
        extend:Step,
        construct:function(options){
            this.callsuper(options);
        },
        abstract:true
    });

    module.exports = Begin;
});
