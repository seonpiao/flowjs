define(function(require,exports,module){
    var Class = require('./util/class');
    var ConditionStep = require('./condition');
    var Input = require('./input');
    var pathes = 0;
    var Drawer = Class({
        construct:function(options){
            this._flow = options.flow;
            this._canvas = options.canvas;
            this._svg = d3.select(this._canvas).append('svg');
            var _this = this;
            this._flow._enter = function(step,data,callback){
                step.__drawerdata = step.__drawerdata || {};
                if(!step.__drawerdata.uid){
                    step.__drawerdata.uid = Date.now();
                }
                else{
                    return;
                }
                if(step instanceof ConditionStep){
                    _this._drawCondition(step);
                    var cases = step.cases();
                    cases.defaultCase();
                    for(var key in cases.cases){
                        cases.cases[key]();
                    }
                }
                else if(step instanceof Input){
                    setTimeout(function(){
                        _this._drawInput(step);
                        var inputs = step.inputs();
                        for(var key in inputs){
                            console.log('Input : ' + key);
                            inputs[key]();
                        }
                    },0);
                }
                else{
                    _this._drawStep(step);
                }
                callback.call(this);
            }
        },
        methods:{
            //初始化流程
            start:function(){
                this._flow.start();
            },
            _drawStep:function(step){
                var g = this._svg.append('g');
                g.attr('y',20);
                g.append('rect')
                g.append('text').text(step.data().description);
            },
            _drawCondition:function(step){
                var g = this._svg.append('g');
                g.append('rect')
                g.append('text').text(step.data().description);
            },
            _drawInput:function(step){
                var g = this._svg.append('g');
                g.append('rect')
                g.append('text').text(step.data().description);
            }
        }
    });
    
    module.exports = Drawer;
});
