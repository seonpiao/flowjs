//event plugin
define(function(require,exports,module){
    var Class = require('./class');

    var EventPlugin = Class({
        methods:{
            on:function(type,listener){
                this._ep_createList();
                //todo realListener是干嘛用的？ addby caowenlong
                var realListener = function (ev) {
                    listener(ev);
                };
                type = type.toLowerCase();
                this._ep_lists[type] = this._ep_lists[type] || [];
                this._ep_lists[type].push({
                    type:type,
                    listener:listener,
                    realListener:realListener
                });
                return this;
            },
            un:function(type,listener){
                this._ep_createList();
                if(type){
                    type = type.toLowerCase();
                    var listeners = this._ep_lists[type];
                    if(listeners){
                        var len = listeners.length,
                            isRemoveAll = !listener;
                        if(listeners && listeners.length > 0){
                            if(isRemoveAll === true){
                                this._ep_lists[type] = [];
                            }
                            else{
                                listeners.forEach(function(obj,index){
                                    if(obj.listener === listener){
                                        listeners.splice(index,1);
                                    }
                                });
                            }
                        }
                    }
                }
                else{
                    this._ep_clearList();
                }
                return this;
            },
            fire:function(ev){
                this._ep_createList();
                var type = ev.type.toLowerCase();
                var data = ev.data;
                var listeners = this._ep_lists[type];
                if(listeners && listeners.length > 0){
                    listeners.forEach(function(obj,index){
                        obj.listener({type:type,data:data});
                    });
                }
                return this;
            },
            _ep_clearList:function(){
                this._ep_lists = null;
            },
            _ep_createList:function(){
                if(!this._ep_lists){
                    this._ep_lists = {};
                }
            }
        }
    });

    module.exports = EventPlugin;
});