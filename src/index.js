define(function(require,exports,module){
    module.exports = {
        V:'0.4.2',
        Class:require('./util/class'),
        Flow:require('./flow')
    };
    if(typeof window !== 'undefined'){
        window.Flowjs = module.exports;
    }
});
