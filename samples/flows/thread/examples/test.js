define(function(require, exports, module) {

    var Flow = require('../src/flow/CommonFocus');

    var wrapper = Q.$('[data-widget-focus=slidefocus]');

    var flow = new Flow({wrapper:wrapper});

    var steps = {
        '循环体':require('../src/steps/body'),
        '是否跳出循环':require('../src/steps/jump')
    };

    for (var stepName in steps){
        if(steps.hasOwnProperty(stepName)){
            flow.implement(stepName,steps[stepName]);
        }
    }

    module.exports = flow;

    window.focus = module.exports;
});

