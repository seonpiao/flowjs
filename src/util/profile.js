define(function (require, exports, module) {
    var timers = {};
    var totals = {};
    var starts = {};
    module.exports = {
        start:function (desc) {
            starts[desc] = new Date();
        },
        sum:function(desc,options){
            options = options || {};
            var timeout = options.timeout || 1000;
            if(!totals[desc]){
                totals[desc] = 0;
            }
            var _this = this;
            if(timers[desc]){
                clearTimeout(timers[desc]);
            }
            var now = new Date();
            totals[desc] += (now - starts[desc]);
            timers[desc] = setTimeout(function(){
                console.log(desc + ' cost ' + totals[desc]);
                totals[desc] = 0;
            },timeout);
        },
        stop:function(desc){
            console.log(desc + ' cost ' + (new Date() - starts[desc]));
        }
    };
});