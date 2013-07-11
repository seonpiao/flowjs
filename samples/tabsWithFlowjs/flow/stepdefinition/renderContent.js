define(function(require,exports,module){
    var Class = Flowjs.Class;
    var Step = Flowjs.Step;
    var FocusGenerator = Class({
        extend:Step,
        construct:function(options){
            this.callsuper(options);
        },
        isAbstract:true,
        methods:{
            _describeData:function(){
                return {
                    input:{
                        contentTemplate:{
                            type:'string',
                            empty:true
                        },
                        contentData:{
                            type:'object',
                            empty:true
                        },
                        contentWrapper:{
                            type:'object'
                        }
                    }
                };
            }
        }
    });
    
    module.exports = FocusGenerator;
});
