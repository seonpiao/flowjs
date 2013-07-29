define(function(require,exports,module){
    var Class = Flowjs.Class;
    var Step = Flowjs.Step;
    var FocusData = Class({
        extend:Step,
        construct:function(options){
            this.callsuper(options);
        },
        isAbstract:true,
        methods:{
            _describeData:function(){
                return {
                    input:{
                        wrapper:{
                            type:'object'
                        }
                    },
                    output:{
                        titleContainers:{
                            type:'object'
                        },
                        contentContainers:{
                            type:'object'
                        }
                    }
                };
            }
        }
    });
    
    module.exports = FocusData;
});
