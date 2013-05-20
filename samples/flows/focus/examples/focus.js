define(function(require, exports, module) {

    var Flow = require('../src/flow/CommonFocus');

    var wrapper = Q.$('[data-widget-focus=slidefocus]');

    var flow = new Flow({wrapper:wrapper});

    var steps = {
        '获取焦点图容器':require('../src/steps/getWrapper'),
        '获取焦点图数据':require('../src/steps/getData'),
        '获取焦点图模板':require('../src/steps/getTemplate'),
        '渲染焦点图':require('../src/steps/render'),
        '启动焦点图轮播':require('../src/steps/start'),
        '切换焦点图':require('../src/steps/fadePlay'),
        '获取相关Dom元素':require('../src/steps/getDoms'),
        '高亮缩略图':require('../src/steps/highlight'),
        '延迟':require('../src/steps/delay'),
        '绑定用户切换事件':require('../src/steps/bindEvent'),
        '计算下一帧的帧数':require('../src/steps/next'),
        '切换焦点图标题':require('../src/steps/changeTitle'),
        '播放到指定的帧数':require('../src/steps/goto')
    };

    for (var stepName in steps){
        if(steps.hasOwnProperty(stepName)){
            flow.implement(stepName,steps[stepName]);
        }
    }

    module.exports = flow;

    window.focus = module.exports;
});

