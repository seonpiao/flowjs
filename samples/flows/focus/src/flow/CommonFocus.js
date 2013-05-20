define(function(require, exports, module) {
    var Class = Flowjs.Class;
    var Flow = Flowjs.Flow;
    var CommonFocusFlow = Class({
        extend:Flow,
        construct:function(options){
            this.callsuper(options);
            this._addStep('获取焦点图容器',require('./stepdefinition/getWrapper'));
            this._addStep('获取焦点图数据',require('./stepdefinition/getData'));
            this._addStep('获取焦点图模板',require('./stepdefinition/getTemplate'));
            this._addStep('渲染焦点图',require('./stepdefinition/render'));
            this._addStep('获取相关Dom元素',require('./stepdefinition/getDoms'));
            this._addStep('启动焦点图轮播',require('./stepdefinition/start'));
            this._addStep('切换焦点图',require('./stepdefinition/play'));
            this._addStep('高亮缩略图',require('./stepdefinition/highlight'));
            this._addStep('延迟',require('./stepdefinition/delay'));
            this._addStep('播放到指定的帧数',require('./stepdefinition/goto'));
            this._addStep('计算下一帧的帧数',require('./stepdefinition/next'));
            this._addStep('计算上一帧的帧数',require('./stepdefinition/prev'));
            this._addStep('切换焦点图标题',require('./stepdefinition/changeTitle'));
            this._addStep('绑定用户切换事件',require('./stepdefinition/bindEvent'));
            this._wrapper = options.wrapper;
        },
        methods:{
            //初始化流程
            start:function(){
                var _this = this;
                this._go('获取焦点图容器',{wrapper:this._wrapper});
                this._go('获取焦点图数据');
                this._go('获取焦点图模板');
                this._go('渲染焦点图');
                this._go('获取相关Dom元素');
                this._go('绑定用户切换事件',null,{
                    inputs:{
                        'click':function(data){
                            _this._go('播放到指定的帧数',data);
                            _this._go('切换焦点图');
                        },
                        'mouseonfocus':function(){
                            _this._pause();
                        },
                        'mouseoutfocus':function(){
                            _this._go('延迟');
                        },
                        'prev':function(){
                            _this._go('计算上一帧的帧数');
                            _this._go('切换焦点图');
                        },
                        'next':function(){
                            _this._go('计算下一帧的帧数');
                        }
                    }
                });
                this._go('启动焦点图轮播');
                this._go('切换焦点图');
                this._go('高亮缩略图');
                this._go('切换焦点图标题');
                this._go('延迟');
                this._go('计算下一帧的帧数');
                this._go('切换焦点图');
                this._addInterface('goto',function(n){
                    this._go('播放到指定的帧数',{goto:n});
                    this._go('切换焦点图');
                });
            }
        }
    });

    module.exports = CommonFocusFlow;
});

