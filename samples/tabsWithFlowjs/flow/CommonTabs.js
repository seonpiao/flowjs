define(function(require, exports, module) {
    var Class = Flowjs.Class;
    var Flow = Flowjs.Flow;
    var CommonTabsFlow = Class({
        extend:Flow,
        construct:function(options){
            this.callsuper(options);
            this._addStep('获取标签页容器', require('./stepdefinition/getWrapper'));
            this._addStep('获取标签页数据', require('./stepdefinition/getData'));
            this._addStep('获取标签页模板', require('./stepdefinition/getTemplate'));
            this._addStep('渲染标签页', require('./stepdefinition/render'));
            this._addStep('获取相关Dom元素', require('./stepdefinition/getDoms'));
            this._addStep('绑定用户切换事件', require('./stepdefinition/bindEvent'));
            this._addStep('切换到指定页', require('./stepdefinition/goto'));
            this._wrapper = options.wrapper;
            this._dataURL = options.dataURL;
            this._templateURL = options.templateURL;
        },
        methods:{
            //初始化流程
            init:function(){
                var _this = this;
                this._go('获取标签页容器',{wrapper:this._wrapper});
                this._go('获取标签页数据');
                this._go('获取标签页模板');
                this._go('渲染标签页');
                this._go('获取相关Dom元素');
                this._go('绑定用户切换事件',null,{
                    inputs:{
                        'click':function(data){
                            _this._go('切换到指定页',data);
                        }
                    }
                });
                this._go('切换到指定页',{goto: 1});
            }
        }
    });

    module.exports = CommonTabsFlow;
});

