define(function(require,exports,module){
    module.exports = require('./flow');
    if(typeof window !== 'undefined'){
        window.Flow = module.exports;
    }
});
