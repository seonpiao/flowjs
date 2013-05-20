define(function(require,exports,module){
    var Class = require('./util/class');
    var EventPlugin = require('./util/eventPlugin');
    var checkData = require('./util/checkData');
    var extend = require('./util/extend');
    var tool = require('./util/tool');
    var Step = Class({
        plugins:[new EventPlugin()],
        construct:function(options){
            options = options || {};
            // if(!options.description){
            //     throw new Error('Need a description.');
            // }
            this._data = {
                __id:Date.now(),
                description:options.description
            };
            this.__struct = this._describeData();
            this.__next = null;
            this.__end = false;
            this.__pausing = false;
            this.__callback = null;
        },
        methods:{
            enter:function(data,callback){
                this.__pausing = false;
                if(!this.__checkInput(data)){
                    throw new Error('Data error.');
                }
                var _this = this;
                this._process(data,function(err,result){
                    if(!_this.__checkOutput(result)){
                        throw new Error('Result error.');
                    }
                    var cb = function(){
                        callback(err,result);
                    };
                    if(!_this.__pausing){
                        cb();
                    }
                    else{
                        _this.__callback = cb;
                    }
                });
            },
            _process:Class.abstractMethod,
            _describeData:function(){
                return {};
            },
            next:function(step){
                if(step){
                    if(!this.isEnd()){
                        this.__next = step;
                        //流程不允许改变，因此设置好下一步后，就锁定该流程
                        this.end();
                    }
                }
                else{
                    return this.__next;
                }
            },
            end:function(){
                this.__end = true;
            },
            isEnd:function(){
                return this.__end;
            },
            data:function(data){
                if(arguments.length === 0){
                    return this._data;
                }
                else{
                    extend(this._data,data);
                }
            },
            getStruct:function(){
                return this.__struct;
            },
            pause:function(){
                this.__pausing = true;
            },
            //一般暂停
            resume:function(){
                this.__pausing = false;
                if(this.__callback){
                    this.__callback();
                }
            },
            __checkInput:function(data){
                tool.log('Check','input data for',this._data.description);
                return checkData.check(this.__struct.input,data);
            },
            __checkOutput:function(data){
                tool.log('Check','output data for',this._data.description);
                return checkData.check(this.__struct.output,data);
            }
        }
    });

    module.exports = Step;
});
