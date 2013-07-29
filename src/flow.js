define(function(require,exports,module){
    var Class = require('./util/class');
    var EventPlugin = require('./util/eventPlugin');
    var extend = require('./util/deepExtend');
    var Begin = require('./begin');
    var Step = require('./step');
    var Input = require('./input');
    var Condition = require('./condition');
    var Queue = require('./util/queue');
    var Data = require('./util/flowData');
    var tool = require('./util/tool');
    var reserve = [];
    var Flow = Class({
        plugins:[new EventPlugin()],
        construct:function(options){
            options = options || {};
            this.__begin = new Begin({description:'Begin',struct:{}});
            this.__steps = options.steps || {}; //step class
            this.__stepInstances = {}; //step instance
            this.__queue = new Queue();
            this.__timer = null;
            // this.__prev = this.__begin;//上一个步骤
            this.__data = new Data();
            this.__interfaces = {};
            this.__pausing = {};
            this.__working = {};
            this.__stepCount = 0;
            this.__subs = {};
            for(var key in this){
                reserve.push(key);
            }
        },
        isAbstract:true,
        methods:{
            //初始化流程
            init:Class.abstractMethod,
            implement:function(stepName,options){
                var StepClass = Class({
                    extend:this.__steps[stepName],
                    construct:options.construct || function(options){
                        this.callsuper(options);
                    },
                    methods:options.methods
                });
                this.__stepInstances[stepName] = new StepClass({description:stepName});
            },
            //销毁流程，释放资源
            destroy:function(){
                var ins = this.__stepInstances;
                for(var stepName in ins){
                    if(ins.hasOwnProperty(stepName)){
                        var step = ins[stepName];
                        var stepData = this.__getStepData(step);
                        try{step.destroy(stepData);}catch(e){}
                    }
                }
            },
            _go:function(step,data,options){
                var _this = this;
                //
                if(this.__timer && this.__prev){
                    clearTimeout(this.__timer);
                }
                if(typeof step == 'string'){
                    if(this.__subs[step]){
                        this.__subs[step].apply(this,arguments);
                        return;
                    }
                    var stepName = step;
                    step = this.__stepInstances[step];
                }
                //已实现的步骤
                if(step){
                    if(options){
                        if(step instanceof Condition && !(step instanceof Input)){
                            options.newflow = this.__newflow.bind(this);
                            step.cases(options);
                            //条件步骤一定是一段流程的终点
                            step.end();
                        }
                        if(step instanceof Input){
                            options.newflow = this.__newflow.bind(this);
                            step.inputs(options);
                        }
                    }
                    step.__paramData = data;
                    if(!this.__prev){
                        this.__queue.enqueue({step:step});
                    }
                    if(this.__prev){
                        this.__prev.next(step);
                    }
                    this.__prev = step;
                    if(this.__sync){
                        var stepData = this.__getStepData(step);
                        extend(stepData,step.__paramData);
                        try{
                            this.__process(step,stepData);
                        }
                        catch(e){
                            // _this.__queue.clear();
                            throw e;
                        }
                        this.__timer = setTimeout(function(){
                            //执行到此，说明一个流程链已经完成，当前步骤为该流程链的末端，不允许再有下一步了
                            step.end();
                            // _this.__queue.clear();
                        },0);
                    }
                    else{
                        this.__timer = setTimeout(function(){
                            //执行到此，说明一个流程链已经完成，当前步骤为该流程链的末端，不允许再有下一步了
                            step.end();
                            _this.__start();
                            // _this.__queue.clear();
                        },0);
                    }
                }
                //未实现的步骤直接跳过
                else{
                    this.__timer = setTimeout(function(){
                        if (_this.__prev) {
                            _this.__prev.end();
                        }
                        _this.__start();
                        // _this.__queue.clear();
                    },0);
                }
            },
            _sync:function(callback){
                this.__sync = true;
                callback();
                this.__sync = false;
            },
            _sub:function(subName,fn){
                this.__subs[subName] = fn;
            },
            _addStep:function(name,StepClass){
                this.__steps[name] = StepClass;
            },
            _addInterface:function(name,fn){
                if(reserve.indexOf(name) != -1){
                    throw new Error('Reserve property : ' + name);
                }
                this[name] = function(){
                    this.__newflow();
                    return fn.apply(this,arguments);
                };
                this.__interfaces[name] = fn;
            },
            _getData:function(keys){
                return this.__data.getData(keys);
            },
            /**
             * 启动一个新的流程，避免与之前的流程发生衔接
             * @return {[type]} [description]
             */
            __newflow:function(){
                this.__prev = null;
            },
            __start:function(){
                var item = this.__queue.dequeue();
                if(item){
                    var data = this.__getStepData(item.step);
                    extend(data,item.step.__paramData);
                    this.__process(item.step,data);
                }
            },
            __process:function(step,data){
                tool.log('步骤开始：' + step.data().description);
                this.__working[step.data().__id] = step;
                this.__enter(step,data,function(result){
                    tool.log('步骤结束：' + step.data().description);
                    delete this.__working[step.data().__id];
                    if(result){
                        this.__saveData(result);
                    }
                    //在同步状态下，由go来执行下一步，而不需要_process来递归执行下一步
                    if(!this.__sync){
                        var next = this.__getNext(step);
                        if(next){
                            tool.log('即将开始下一步：' + next.step.data().description);
                            this.__stepCount++;
                            if(this.__stepCount < 20){
                                this.__process(next.step,next.data);
                            }
                            //为了防止栈溢出，连续执行20步后，就退出当前调用栈
                            else{
                                this.__stepCount = 0;
                                var _this = this;
                                setTimeout(function(){
                                    _this.__process(next.step,next.data);
                                },0);
                            }
                        }
                    }
                });
            },
            __saveData:function(result){
                for(var key in result){
                    if(result.hasOwnProperty(key)){
                        this.__data.setData(key,result[key]);
                    }
                }
            },
            __getNext:function(step){
                var result = step.__result,next = null;
                var ns = step.next();
                if(ns){
                    var stepData = this.__getStepData(ns);
                    extend(stepData,ns.__paramData);
                    next = {
                        step:ns,
                        data:stepData
                    };
                }
                return next;
            },
            __getStepData:function(step){
                var struct = step.getStruct();
                var dataNames = [];
                if(struct && struct.input){
                    for(var key in struct.input){
                        if(struct.input.hasOwnProperty(key)){
                            dataNames.push(key);
                        }
                    }
                }
                return extend({},this.__data.getData(dataNames));
            },
            __enter:function(step,data,callback){
                var _this = this;
                var enterData = {};
                extend(enterData,data);
                var entered = false;
                step.enter(enterData,function(err,result){
                    if(entered) return;
                    entered = true;
                    var stepData = extend({},result);
                    for(var key in enterData){
                        delete enterData[key];
                    }
                    step.__result = stepData;
                    callback.call(_this,stepData);
                });
            }
        }
    });
    
    module.exports = Flow;
});
