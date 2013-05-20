define(function(require,exports,module){
    var Class = Flowjs.Class;
    var Step = Flowjs.Step;
    var StartFocus = Class({
        extend:Step,
        construct:function(options){
            this.callsuper(options);
        },
        methods:{
            _describeData:function(){
                return {
                    input:{
                        prev:{type:'number'},
                        curr:{type:'number'},
                        frames:{type:'object'},
                        dir:{type:'string',empty:true}
                    }
                };
            }
        }
    });
    
    module.exports = StartFocus;
});
