define(function(require, exports, module) {
    var CommonTabsFlow = Q.Class('A',{
        construct:function(options){
            this._flow = new Flow();
            this._flow.addStep('获取标签页容器', require('./stepdefinition/getWrapper'));
            this._flow.addStep('获取标签页数据', require('./stepdefinition/getData'));
            this._flow.addStep('获取标签页模板', require('./stepdefinition/getTemplate'));
            this._flow.addStep('渲染标签页', require('./stepdefinition/render'));
            this._flow.addStep('获取相关Dom元素', require('./stepdefinition/getDoms'));
            this._flow.addStep('绑定用户切换事件', require('./stepdefinition/bindEvent'));
            this._flow.addStep('切换到指定页', require('./stepdefinition/goto'));
            this._flow.addStep('解析指定页参数', require('./stepdefinition/parseContentParams'));
            this._flow.addStep('获取内容数据', require('./stepdefinition/getContentData'));
            this._flow.addStep('获取内容模板', require('./stepdefinition/getContentTemplate'));
            this._flow.addStep('渲染内容', require('./stepdefinition/renderContent'));
            this._wrapper = options.wrapper;
            this._dataURL = options.dataURL;
            this._templateURL = options.templateURL;
        },
        methods:{
            //初始化流程
            init:function(){
                var _this = this;
                this._flow.begin({
                    wrapper:this._wrapper,
                    dataURL:this._dataURL,
                    templateURL:this._templateURL
                });
                this._flow.go('获取标签页容器');
                this._flow.go('获取标签页数据');
                this._flow.go('获取标签页模板');
                this._flow.go('渲染标签页');
                this._flow.go('获取相关Dom元素');

                this._flow.go('绑定用户切换事件',{
                    events:{
                        'show':function(data){
                            _this._flow.begin(data);
                            _this._flow.go('切换到指定页');
                        },
                        'showWithRender':function(data){
                            _this._flow.begin(data);
                            _this._flow.go('切换到指定页');
                            _this._flow.go('解析指定页参数');
                            _this._flow.go('获取内容数据');
                            _this._flow.go('获取内容模板');
                            _this._flow.go('渲染内容');
                        }
                    }
                });
                // this._showWithRender({goto: 1});
            }
        }
    });

    module.exports = CommonTabsFlow;
});

