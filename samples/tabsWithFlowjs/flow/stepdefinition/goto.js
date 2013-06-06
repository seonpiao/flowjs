define(function(require,exports,module){
    var Class = Flowjs.Class;
    var Step = Flowjs.Step;
    var Next = Class({
        extend:Step,
        construct:function(options){
            this.callsuper(options);
        },
        isAbstract:true,
        methods:{
            _describeData:function(){
                return {
                    input:{
                        titles:{type:'object'},
                        contents:{type:'object'},
                        goto:{type:'number'}
                    },
                    output:{
                        curr:{type:'number'}
                    }
                };
            }
        }
    });
    
    module.exports = Next;
});
