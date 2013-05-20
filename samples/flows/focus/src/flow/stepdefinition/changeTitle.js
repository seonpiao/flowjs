define(function(require,exports,module){
    var Class = Flowjs.Class;
    var Step = Flowjs.Step;
    var ChangeTitle = Class({
        extend:Step,
        construct:function(options){
            this.callsuper(options);
        },
        methods:{
            _describeData:function(){
                return {
                    input:{
                        cnt:{
                            type:'object',
                            empty:true
                        },
                        data:{
                            type:'object'
                        },
                        curr:{
                            type:'number'
                        }
                    }
                };
            }
        }
    });
    
    module.exports = ChangeTitle;
});
