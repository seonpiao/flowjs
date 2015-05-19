define(function(require, exports, module) {
    var Class = require('./util/class');
    var extend = require('./util/deepExtend');
    var isObject = function(arg) {
        return Object.prototype.toString.call(arg) == '[object Object]';
    };
    var isArray = Array.isArray || function(arg) {
        return Object.prototype.toString.call(arg) == '[object Array]';
    };
    var toArray = function(obj) {
        return Array.prototype.slice.call(obj, 0);
    };
    var EventPlugin = require('./util/eventPlugin');
    var log = require('./util/tool').log;
    var Flow = Class({
        construct: function(options) {
            options = options || {};
            this.__steps = {}; //step instance
            this.__definations = {};
            this.__infos = {};
            this.__subs = {};
            this.__context = null;
            this.__passBy = {};
        },
        plugins: [new EventPlugin()],
        methods: {
            implement: function(stepName, step) {
                this.__steps[stepName] = step;
            },
            //销毁流程，释放资源
            destroy: function() {
                var ins = this.__passBy;
                for (var stepName in ins) {
                    if (ins.hasOwnProperty(stepName)) {
                        var stepInfo = ins[stepName];
                        var stepData = this.__getStepData(stepInfo);
                        try {
                            stepInfo.step.destroy(stepData);
                        } catch (e) {}
                    }
                }
            },
            /**
             * 启动一个流程，需要指定context
             * @return {[type]} [description]
             */
            begin: function(data) {
                if (!this.hasOwnProperty('__contextCount')) {
                    this.__contextCount = 0;
                }
                var context = {
                    __id: this.__contextCount++
                };
                context.data = data || {};
                context.data.__flowDataId = context.data.__flowDataId || new Date().getTime();
                this.__context = context;
                setTimeout(function() {
                    this.__go(context);
                }.bind(this), 0);
            },
            go: function(step, options, context) {
                var context = context || this.__context;
                if (!context) {
                    throw new Error('No context!');
                }
                var _this = this;
                if (typeof step == 'string') {
                    if (this.__subs[step]) {
                        this.__subs[step].apply(this, [context.data]);
                    } else {
                        var stepName = step;
                        step = this.__steps[step];
                        //未实现的步骤，给一个初始实现，执行该步骤时，直接返回
                        if (!step) {
                            step = {
                                type: 'step',
                                go: function(data, callback, context) {
                                    // console.log(stepName + ' not implement.');
                                    callback(data, context);
                                }
                            }
                        }
                        var stepInfo = this.__infos[stepName];
                        if (!stepInfo) {
                            stepInfo = {
                                step: step,
                                name: stepName
                            };
                            this.__infos[stepName] = stepInfo;
                            var def = this.__definations[stepName];
                            if (def) {
                                if (def.type === 'condition') {
                                    stepInfo.cases = options.cases;
                                }
                                if (def.type === 'event') {
                                    stepInfo.events = options.events;
                                }
                            }
                        }
                        if (!context.current) {
                            context.current = stepInfo;
                            context.__temp = stepInfo;
                        } else {
                            context.__temp.next = stepInfo;
                            context.__temp = stepInfo;
                        }
                    }
                }
            },
            sub: function(subName, fn) {
                this.__subs[subName] = fn;
            },
            addStep: function(stepName, stepDefination) {
                this.__definations[stepName] = stepDefination;
                if (stepDefination && stepDefination.go) {
                    this.implement(stepName, {
                        go: stepDefination.go
                    })
                }
            },
            replaceStep: function(stepName, stepDefination) {
                this.addStep(stepName, stepDefination);
            },
            __stepCallback: function(data, context) {
                extend(context.data, this.__getStepData(context.current, data));
                if (context.current.next) {
                    context.current = context.current.next;
                    this.__go(context);
                } else {
                    this.fire({
                        type: 'end'
                    });
                }
            },
            __conditionCallback: function(data, condition, context) {
                extend(context.data, this.__getStepData(context.current, data));
                var stepInfo = context.current;
                var cases = stepInfo.cases;
                log(stepInfo.name + ':' + condition);
                if (cases[condition]) {
                    this.begin(context.data);
                    cases[condition].apply(this, [context.data]);
                }
                //不存在的流程分支，直接结束流程
                else {
                    this.fire({
                        type: 'end'
                    });
                }
            },
            __eventCallback: function(stepInfo, data, event, context) {
                extend(context.data, this.__getStepData(stepInfo, data));
                var events = stepInfo.events;
                if (events[event]) {
                    this.begin(context.data);
                    events[event].apply(this, [context.data]);
                }
            },
            __getCurrentStepData: function(context) {
                return this.__getStepData(context.current, context.data);
            },
            __getStepData: function(stepInfo, data) {
                var def = this.__definations[stepInfo.name] || {};
                return this.__getData(def.output, data);
            },
            __getData: function(struct, data) {
                struct = struct || {};
                var result = {};
                if (isArray(struct)) {
                    var mappedStruct = {};
                    for (var i = 0; i < struct.length; i++) {
                        mappedStruct[struct[i]] = {
                            empty: true
                        }
                    }
                    struct = mappedStruct;
                }
                for (var key in struct) {
                    if (typeof struct[key] === 'string') {
                        struct[key] = {

                        }
                    }
                    if (struct[key].empty !== true && !data.hasOwnProperty(key)) {
                        this.fire({
                            type: 'error',
                            data: {
                                message: 'Key [' + key + '] is not allow empty'
                            }
                        });
                        log('Key [' + key + '] is not allow empty');
                        return result;
                    }
                    var value = data[key];
                    var valueIsArray;
                    if ((valueIsArray = isArray(value)) || isObject(value)) {
                        result[key] = extend(valueIsArray ? [] : {}, value);
                    } else {
                        result[key] = value;
                    }
                }
                return result;
            },
            __go: function(context) {
                var stepInfo = context.current;
                if (stepInfo) {
                    this.__passBy[stepInfo.name] = stepInfo;
                    log("开始执行：" + stepInfo.name + "[" + context.data.__flowDataId + '_' + context.__id + "]");
                    var def = this.__definations[stepInfo.name] || {};
                    var inputData = this.__getData(def.input, context.data);
                    if (def && def.type === 'condition') {
                        stepInfo.step.go(inputData, function(outputData, condition) {
                            this.__conditionCallback(outputData, condition, context);
                        }.bind(this));
                    } else if (def && def.type === 'event') {
                        stepInfo.step.go(
                            inputData,
                            function(outputData) {
                                this.__stepCallback(outputData || inputData, context);
                            }.bind(this),
                            function(outputData, event) {
                                this.__eventCallback(stepInfo, outputData || inputData, event, context);
                            }.bind(this)
                        );
                    } else {
                        stepInfo.step.go(inputData, function(outputData) {
                            this.__stepCallback(outputData || inputData, context);
                        }.bind(this));
                    }
                }
            }
        }
    });

    module.exports = Flow;
});