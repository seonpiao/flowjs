define(function(require,exports,module){
    var Class = require('./util/class');
    var EventPlugin = require('./util/eventPlugin');
    var extend = require('./util/extend');
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
            this.__prev = this.__begin;
            this.__data = new Data();
            this.__interfaces = {};
            this.__pausing = {};
            this.__working = {};
            for(var key in this){
                reserve.push(key);
            }
        },
        methods:{
            //初始化流程
            start:Class.abstractMethod,
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
            _go:function(step,data,options){
                var _this = this;
                if(this.__timer){
                    clearTimeout(this.__timer);
                }
                if(typeof step == 'string'){
                    var stepName = step;
                    step = this.__stepInstances[step];
                }
                //已实现的步骤
                if(step){
                    if(options){
                        if(step instanceof Condition){
                            step.cases(options);
                        }
                        if(step instanceof Input){
                            step.inputs(options);
                        }
                    }
                    this.__queue.enqueue({step:step,data:data});
                    if(this.__prev){
                        this.__prev.next(step);
                    }
                    this.__prev = step;
                    if(this.__sync){
                        var item = this.__queue.dequeue();
                        var stepData = this.__getStepData(item.step);
                        extend(stepData,item.data);
                        this.__process(item.step,stepData);
                        this.__timer = setTimeout(function(){
                            //执行到此，说明一个流程链已经完成，当前步骤为该流程链的末端，不允许再有下一步了
                            step.end();
                        },0);
                    }
                    else{
                        this.__timer = setTimeout(function(){
                            //执行到此，说明一个流程链已经完成，当前步骤为该流程链的末端，不允许再有下一步了
                            step.end();
                            _this.__start();
                        },0);
                    }
                }
                //未实现的步骤直接跳过
                else{
                    this.__timer = setTimeout(function(){
                        _this.__prev.end();
                        _this.__start();
                    },0);
                }
            },
            _pause:function(){
                for(var key in this.__working){
                    if(this.__working.hasOwnProperty(key)){
                        this.__working[key].pause();
                        this.__pausing[key] = this.__working[key];
                        delete this.__working[key];
                    }
                }
                this.__queue.clear();
                //查看是否有泄露
                // console.log(Object.keys(this.__working));
                // console.log(Object.keys(this.__pausing));
            },
            _resume:function(){
                for(var key in this.__pausing){
                    if(this.__pausing.hasOwnProperty(key)){
                        this.__pausing[key].resume();
                        this.__working[key] = this.__pausing[key];
                        delete this.__pausing[key];
                    }
                }
                //查看是否有泄露
                // console.log(Object.keys(this.__working));
                // console.log(Object.keys(this.__pausing));
            },
            _sync:function(callback){
                this.__sync = true;
                callback();
                this.__sync = false;
            },
            _steps:function(){
                return this.__steps;
            },
            _addStep:function(name,StepClass){
                this.__steps[name] = StepClass;
            },
            _addInterface:function(name,fn){
                if(reserve.indexOf(name) != -1){
                    throw new Error('Reserve property : ' + name);
                }
                this[name] = fn;
                this.__interfaces[name] = fn;
            },
            _getData:function(keys){
                return this.__data.getData(keys);
            },
            __start:function(){
                var item = this.__queue.dequeue();
                if(item){
                    var data = this.__getStepData(item.step);
                    extend(data,item.data);
                    this.__process(item.step,data);
                }
            },
            __process:function(step,data){
                this.__working[step.data().__id] = step;
                this.__enter(step,data,function(result){
                    delete this.__working[step.data().__id];
                    if(result){
                        this.__saveData(result);
                    }
                    //在同步状态下，由go来执行下一步，而不需要_process来递归执行下一步
                    if(!this.__sync){
                        var next = this.__getNext(step);
                        if(next){
                            this.__process(next.step,next.data);
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
                var item = this.__queue.dequeue();
                if(item){
                    var data = this.__getStepData(item.step);
                    extend(data,item.data);
                    next = {
                        step:item.step,
                        data:data
                    };
                }
                else{
                    var ns = step.next();
                    if(ns){
                        next = {
                            step:ns,
                            data:this.__getStepData(ns)
                        };
                    }
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
                return this.__data.getData(dataNames);
            },
            __enter:function(step,data,callback){
                var _this = this;
                var enterData = {};
                extend(enterData,data);
                step.enter(enterData,function(err,result){
                    if(result == enterData){
                        var err = 'Can not use enterData as result';
                        tool.error(err);
                        throw new Error(err);
                    }
                    for(var key in enterData){
                        delete enterData[key];
                    }
                    step.__result = result;
                    callback.call(_this,result);
                });
            }
        }
    });
    
    module.exports = Flow;
});
