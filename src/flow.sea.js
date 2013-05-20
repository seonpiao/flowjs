define("./index", [ "./util/class", "./flow", "./step", "./condition", "./input" ], function(require, exports, module) {
    window.Flowjs = {
        V: "1.2.5",
        Class: require("./util/class"),
        Flow: require("./flow"),
        Step: require("./step"),
        Condition: require("./condition"),
        Input: require("./input")
    };
});;
define("./util/class", [ "./baseobject" ], function(require, exports, module) {
    var _Object = require("./baseobject");
    var Class = function(data) {
        var superclass = data.extend || _Object;
        var superproto = function() {};
        var plugins = data.plugins || [];
        superproto.prototype = superclass.prototype;
        var constructor = data.construct || function() {};
        var properties = data.properties || {};
        var methods = data.methods || {};
        var statics = data.statics || {};
        var proto = new superproto;
        for (var key in proto) {
            if (proto.hasOwnProperty(key)) {
                delete proto[key];
            }
        }
        for (var key in properties) {
            proto[key] = properties[key];
        }
        for (var key in methods) {
            proto[key] = methods[key];
        }
        for (var i = 0; i < plugins.length; i++) {
            var plugin = plugins[i];
            for (var key in plugin) {
                proto[key] = plugin[key];
            }
        }
        proto.constructor = constructor;
        proto.superclass = superclass;
        constructor.prototype = proto;
        for (var key in statics) {
            constructor[key] = statics[key];
        }
        return constructor;
    };
    Class.abstractMethod = function() {
        throw new Error("Not implement.");
    };
    module.exports = Class;
});;
define("./util/baseobject", [], function(require, exports, module) {
    var _Object = function() {};
    var proto = new Object;
    proto.superclass = Object;
    proto.callsuper = function(methodName) {
        var _this = this;
        if (!this._realsuper) {
            this._realsuper = this.superclass;
        } else {
            this._realsuper = this._realsuper.prototype.superclass;
        }
        if (typeof methodName == "string") {
            var args = Array.prototype.slice.call(arguments, 1);
            _this._realsuper.prototype[methodName].apply(_this, args);
        } else {
            var args = Array.prototype.slice.call(arguments, 0);
            _this._realsuper.apply(_this, args);
        }
        this._realsuper = null;
    };
    _Object.prototype = proto;
    module.exports = _Object;
});;
define("./flow", [ "./util/class", "./util/eventPlugin", "./util/extend", "./begin", "./step", "./input", "./condition", "./util/queue", "./util/flowData" ], function(require, exports, module) {
    var Class = require("./util/class");
    var EventPlugin = require("./util/eventPlugin");
    var extend = require("./util/extend");
    var Begin = require("./begin");
    var Step = require("./step");
    var Input = require("./input");
    var Condition = require("./condition");
    var Queue = require("./util/queue");
    var Data = require("./util/flowData");
    var reserve = [];
    var Flow = Class({
        plugins: [ new EventPlugin ],
        construct: function(options) {
            options = options || {};
            this.__begin = new Begin({
                description: "Begin",
                struct: {}
            });
            this.__steps = options.steps || {};
            this.__stepInstances = {};
            this.__queue = new Queue;
            this.__timer = null;
            this.__prev = this.__begin;
            this.__data = new Data;
            this.__interfaces = {};
            this.__pausing = {};
            this.__working = {};
            for (var key in this) {
                reserve.push(key);
            }
        },
        methods: {
            start: Class.abstractMethod,
            go: function(step, data, options) {
                var _this = this;
                if (this.__timer) {
                    clearTimeout(this.__timer);
                }
                if (typeof step == "string") {
                    var stepName = step;
                    step = this.__stepInstances[step];
                }
                if (step) {
                    if (options) {
                        if (step instanceof Condition) {
                            step.cases(options);
                        }
                        if (step instanceof Input) {
                            step.inputs(options);
                        }
                    }
                    this.__queue.enqueue({
                        step: step,
                        data: data
                    });
                    if (this.__prev) {
                        this.__prev.next(step);
                    }
                    this.__prev = step;
                    this.__timer = setTimeout(function() {
                        step.end();
                        _this.__start();
                    }, 0);
                } else {
                    this.__timer = setTimeout(function() {
                        _this.__prev.end();
                        _this.__start();
                    }, 0);
                }
            },
            pause: function() {
                for (var key in this.__working) {
                    if (this.__working.hasOwnProperty(key)) {
                        this.__working[key].pause();
                        this.__pausing[key] = this.__working[key];
                        delete this.__working[key];
                    }
                }
            },
            resume: function() {
                for (var key in this.__pausing) {
                    if (this.__pausing.hasOwnProperty(key)) {
                        this.__pausing[key].resume();
                        this.__working[key] = this.__pausing[key];
                        delete this.__pausing[key];
                    }
                }
            },
            implement: function(stepName, options) {
                var StepClass = Class({
                    extend: this.__steps[stepName],
                    construct: options.construct || function(options) {
                        this.callsuper(options);
                    },
                    methods: options.methods
                });
                this.__stepInstances[stepName] = new StepClass({
                    description: stepName
                });
            },
            sync: function(callback) {},
            _steps: function() {
                return this.__steps;
            },
            _addStep: function(name, StepClass) {
                this.__steps[name] = StepClass;
            },
            _addInterface: function(name, fn) {
                if (reserve.indexOf(name) != -1) {
                    throw new Error("Reserve property : " + name);
                }
                this[name] = fn;
                this.__interfaces[name] = fn;
            },
            __start: function() {
                var item = this.__queue.dequeue();
                if (item) {
                    var data = this.__getStepData(item.step);
                    extend(data, item.data);
                    this.__process(item.step, data);
                }
            },
            __process: function(step, data) {
                this.__working[step.data().__id] = step;
                this.__enter(step, data, function(result) {
                    delete this.__working[step.data().__id];
                    if (result) {
                        this.__saveData(result);
                    }
                    var next = this.__getNext(step);
                    if (next) {
                        this.__process(next.step, next.data);
                    }
                });
            },
            __saveData: function(result) {
                for (var key in result) {
                    if (result.hasOwnProperty(key)) {
                        this.__data.setData(key, result[key]);
                    }
                }
            },
            __getNext: function(step) {
                var result = step.__result, next = null;
                var item = this.__queue.dequeue();
                var next = null;
                if (item) {
                    var data = this.__getStepData(item.step);
                    extend(data, item.data);
                    next = {
                        step: item.step,
                        data: data
                    };
                } else {
                    var ns = step.next();
                    if (ns) {
                        next = {
                            step: ns,
                            data: this.__getStepData(ns)
                        };
                    }
                }
                return next;
            },
            __getStepData: function(step) {
                var struct = step.getStruct();
                var dataNames = [];
                if (struct && struct.input) {
                    for (var key in struct.input) {
                        if (struct.input.hasOwnProperty(key)) {
                            dataNames.push(key);
                        }
                    }
                }
                return this.__data.getData(dataNames);
            },
            __enter: function(step, data, callback) {
                var _this = this;
                step.enter(data, function(err, result) {
                    step.__result = result;
                    callback.call(_this, result);
                });
            }
        }
    });
    module.exports = Flow;
});;
define("./util/eventPlugin", [ "./class" ], function(require, exports, module) {
    var Class = require("./class");
    var EventPlugin = Class({
        methods: {
            on: function(type, listener) {
                this._ep_createList();
                var realListener = function(ev) {
                    listener(ev);
                };
                type = type.toLowerCase();
                this._ep_lists[type] = this._ep_lists[type] || [];
                this._ep_lists[type].push({
                    type: type,
                    listener: listener,
                    realListener: realListener
                });
                return this;
            },
            un: function(type, listener) {
                this._ep_createList();
                if (type) {
                    type = type.toLowerCase();
                    var listeners = this._ep_lists[type];
                    if (listeners) {
                        var len = listeners.length, isRemoveAll = !listener;
                        if (listeners && listeners.length > 0) {
                            if (isRemoveAll == true) {
                                this._ep_lists[type] = [];
                            } else {
                                listeners.forEach(function(obj, index) {
                                    if (obj.listener === listener) {
                                        listeners.splice(index, 1);
                                    }
                                });
                            }
                        }
                    }
                } else {
                    this._ep_clearList();
                }
                return this;
            },
            fire: function(ev) {
                this._ep_createList();
                var type = ev.type.toLowerCase();
                var data = ev.data;
                var listeners = this._ep_lists[type];
                if (listeners && listeners.length > 0) {
                    listeners.forEach(function(obj, index) {
                        obj.listener({
                            type: type,
                            data: data
                        });
                    });
                }
                return this;
            },
            _ep_clearList: function() {
                this._ep_lists = null;
            },
            _ep_createList: function() {
                if (!this._ep_lists) {
                    this._ep_lists = {};
                }
            }
        }
    });
    module.exports = EventPlugin;
});;
define("./util/extend", [], function(require, exports, module) {
    var extend = function(target, source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            }
        }
        return target;
    };
    module.exports = extend;
});;
define("./begin", [ "./util/class", "./step" ], function(require, exports, module) {
    var Class = require("./util/class");
    var Step = require("./step");
    var Begin = Class({
        extend: Step,
        construct: function(options) {
            this.callsuper(options);
        }
    });
    module.exports = Begin;
});;
define("./step", [ "./util/class", "./util/eventPlugin", "./util/checkData", "./util/extend", "./util/tool" ], function(require, exports, module) {
    var Class = require("./util/class");
    var EventPlugin = require("./util/eventPlugin");
    var checkData = require("./util/checkData");
    var extend = require("./util/extend");
    var tool = require("./util/tool");
    var Step = Class({
        plugins: [ new EventPlugin ],
        construct: function(options) {
            options = options || {};
            this._data = {
                __id: Date.now(),
                description: options.description
            };
            this.__struct = this._describeData();
            this.__next = null;
            this.__end = false;
            this.__pausing = false;
            this.__callback = null;
        },
        methods: {
            enter: function(data, callback) {
                this.__pausing = false;
                if (!this.__checkInput(data)) {
                    throw new Error("Data error.");
                }
                var _this = this;
                this._process(data, function(err, result) {
                    if (!_this.__checkOutput(result)) {
                        throw new Error("Result error.");
                    }
                    var cb = function() {
                        callback(err, result);
                    };
                    if (!_this.__pausing) {
                        cb();
                    } else {
                        _this.__callback = cb;
                    }
                });
            },
            _process: Class.abstractMethod,
            _describeData: function() {
                return {};
            },
            next: function(step) {
                if (step) {
                    if (!this.isEnd()) {
                        this.__next = step;
                        this.end();
                    }
                } else {
                    return this.__next;
                }
            },
            end: function() {
                this.__end = true;
            },
            isEnd: function() {
                return this.__end;
            },
            data: function(data) {
                if (arguments.length == 0) {
                    return this._data;
                } else {
                    extend(this._data, data);
                }
            },
            getStruct: function() {
                return this.__struct;
            },
            pause: function() {
                this.__pausing = true;
            },
            resume: function() {
                this.__pausing = false;
                if (this.__callback) {
                    this.__callback();
                }
            },
            __checkInput: function(data) {
                tool.log("Check", "input data for", this._data.description);
                return checkData.check(this.__struct.input, data);
            },
            __checkOutput: function(data) {
                tool.log("Check", "output data for", this._data.description);
                return checkData.check(this.__struct.output, data);
            }
        }
    });
    module.exports = Step;
});;
define("./util/checkData", [ "./tool" ], function(require, exports, module) {
    var tool = require("./tool");
    module.exports = {
        check: function(struct, data) {
            var self = this;
            if (!struct) {
                return true;
            }
            var result = true;
            for (var key in struct) {
                var item = struct[key];
                if (struct[key].empty !== true && self.isEmpty(struct[key], data[key])) {
                    throw new Error("字段[" + key + "]值为空");
                } else if (struct[key].empty === true && self.isEmpty(struct[key], data[key])) {
                    continue;
                } else if (struct[key].type == "number" && typeof data[key] != "number") {
                    throw new Error("字段[" + key + "]不是数字");
                } else if (struct[key].type == "string" && typeof data[key] != "string") {
                    throw new Error("字段[" + key + "]不是字符串");
                } else if (struct[key].type == "array") {
                    if (!self.checkArray(struct[key], data[key])) {
                        throw new Error("字段[" + key + "]值与定义不符");
                    }
                } else if (struct[key].type == "object") {
                    if (!self.checkObject(struct[key].struct, data[key])) {
                        throw new Error("字段[" + key + "]值与定义不符");
                    }
                }
            }
            return result;
        },
        checkArray: function(rule, data) {
            var self = this;
            if (tool.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (!self.checkData(rule.item, item)) {
                        return false;
                    }
                }
                return true;
            } else {
                return false;
            }
        },
        checkObject: function(rule, data) {
            return this.check(rule, data);
        },
        isEmpty: function(rule, data) {
            if (data === undefined) {
                return true;
            }
            if (rule.type == "object") {
                return data === null;
            } else if (rule.type == "array") {
                return data.length == 0;
            } else {
                return data === "" || data === undefined || data === null;
            }
        },
        checkData: function(rule, data) {
            if (rule.type == "number" && typeof data == "number") {
                return true;
            } else if (rule.type == "string" && typeof data == "string") {
                return true;
            } else if (rule.type == "boolean" && typeof data == "boolean") {
                return true;
            } else if (rule.type == "array") {
                return this.checkArray(rule.item, data);
            } else if (rule.type == "object") {
                return this.checkObject(rule.struct, data);
            }
            return false;
        }
    };
});;
define("./util/tool", [], function(require, exports, module) {
    module.exports = {
        isArray: Array.isArray || function(arg) {
            return Object.prototype.toString.call(arg) == "[object Array]";
        },
        log: function() {
            if (window.console) {
                console.log.apply(console, arguments);
            }
        }
    };
});;
define("./input", [ "./util/class", "./condition", "./util/extend" ], function(require, exports, module) {
    var Class = require("./util/class");
    var Condition = require("./condition");
    var extend = require("./util/extend");
    var Condition = Class({
        extend: Condition,
        construct: function(options) {
            options = options || {};
            this.callsuper(options);
            this._inputs = options.inputs || {};
            this._binded = false;
        },
        methods: {
            _once: function(callback) {
                if (!this._binded) {
                    this._binded = true;
                    callback();
                }
            },
            inputs: function(data) {
                var tmp = {};
                tmp.cases = data.inputs;
                return this.cases(tmp);
            }
        }
    });
    module.exports = Condition;
});;
define("./condition", [ "./util/class", "./step", "./util/extend" ], function(require, exports, module) {
    var Class = require("./util/class");
    var Step = require("./step");
    var extend = require("./util/extend");
    var Condition = Class({
        extend: Step,
        construct: function(options) {
            options = options || {};
            this.callsuper(options);
            this._cases = options.cases || {};
            this._default = options.defaultCase;
        },
        methods: {
            _select: function(condition, data) {
                var fn = this._cases[condition] || this._default;
                fn(data);
            },
            cases: function(data) {
                if (data) {
                    if (data.cases) {
                        extend(this._cases, data.cases);
                    }
                    if (data.defaultCase) {
                        this._default = data.defaultCase;
                    }
                } else {
                    return {
                        defaultCase: this._default,
                        cases: this._cases
                    };
                }
            }
        }
    });
    module.exports = Condition;
});;
define("./util/queue", [ "./class" ], function(require, exports, module) {
    var Class = require("./class");
    module.exports = Class({
        construct: function() {
            this._queue = [];
            this._event = {};
        },
        methods: {
            enqueue: function(obj) {
                this._queue.push(obj);
            },
            dequeue: function() {
                var _this = this;
                if (this._queue.length == 0) {
                    this.end();
                    return null;
                } else {
                    return this._queue.splice(0, 1)[0];
                }
            },
            isEmpty: function() {
                return this._queue.length == 0;
            },
            end: function(data) {
                this.fire("end", data);
            },
            on: function(type, callback) {
                if (!this._event[type]) {
                    this._event[type] = [];
                }
                this._event[type].push(callback);
            },
            fire: function(type, data) {
                if (this._event[type]) {
                    for (var i = 0; i < this._event[type].length; i++) {
                        this._event[type][i](data);
                    }
                }
            },
            clear: function() {
                this._queue = [];
            }
        }
    });
});;
define("./util/flowData", [ "./class", "./tool" ], function(require, exports, module) {
    var Class = require("./class");
    var tool = require("./tool");
    var FlowData = Class({
        construct: function(options) {
            this._data = {};
        },
        methods: {
            getData: function(dataNames) {
                var result = {};
                var now = (new Date).getTime();
                if (tool.isArray(dataNames)) {
                    var length = dataNames.length;
                    for (var i = 0; i < length; i++) {
                        var name = dataNames[i];
                        if (this._data.hasOwnProperty(name)) {
                            result[name] = this._data[name];
                        }
                    }
                } else {
                    result[dataNames.toString()] = this_data[dataNames.toString()];
                }
                return result;
            },
            setData: function(dataName, data) {
                this._data[dataName] = data;
                return false;
            }
        }
    });
    module.exports = FlowData;
});;