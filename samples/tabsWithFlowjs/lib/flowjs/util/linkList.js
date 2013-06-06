//event plugin
define(function(require,exports,module){
    var Class = require('./util/class');

    var LinkList = Class({
        construct:function(options){
            this._next = null;
            this._head = options.head;
            this._tail = options.tail;
            this._data = options.data;
        },
        methods:{
            next:function(data){
                var node = new LinkList({data:data});
                this._next = node;
                if(this._head){
                    this._head._tail = node;
                }
            },
            getNext:function(){
                return this._next;
            },
            getData:function(){
                return this._data;
            }
        }
    });

    module.exports = LinkList;
});