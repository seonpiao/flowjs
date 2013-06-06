/**
 *  队列
 */
define(function(require,exports,module){

    var Class = require('./class');

    module.exports = Class({
        construct:function(){
            this._queue = [];
            this._event = {};
        },
        methods:{
            enqueue:function(obj){
                this._queue.push(obj);
            },
            dequeue:function(){
                var _this = this;
                if(this._queue.length === 0){
                    this.end();
                    return null;
                }
                else{
                    return this._queue.splice(0,1)[0];
                }
            },
            isEmpty:function(){
                return this._queue.length === 0;
            },
            end:function(data){
                this.fire('end',data);
            },
            on:function(type,callback){
                if(!this._event[type]){
                    this._event[type] = [];
                }
                this._event[type].push(callback);
            },
            fire:function(type,data){
                if(this._event[type]){
                    for(var i = 0; i < this._event[type].length; i++){
                        this._event[type][i](data);
                    }
                }
            },
            clear:function(){
                this._queue = [];
            }
        }
    });
});