define(function(require, exports, module) {

    var Flow = require('./flow/CommonTabs');

    var wrapper = Q.$('[data-widget-tabs=tabs]');

    var flow = new Flow({
        wrapper: wrapper,
        dataURL: '../data/jobs.json',
        templateURL: '../templates/tabs.html'
    });

    var steps = {
        '获取标签页容器':require('./steps/getWrapper'),
        '获取标签页数据':require('./steps/getData'),
        '获取标签页模板':require('./steps/getTemplate'),
        '渲染标签页':require('./steps/render'),
        '获取相关Dom元素':require('./steps/getDoms'),
        '绑定用户切换事件':require('./steps/bindEvent'),
        '切换到指定页':require('./steps/goto')
    };

    for (var stepName in steps){
        if(steps.hasOwnProperty(stepName)){
            flow.implement(stepName,steps[stepName]);
        }
    }

    module.exports = flow;

    window.focus = module.exports;
});

