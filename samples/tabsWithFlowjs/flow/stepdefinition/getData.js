define(function(require,exports,module){
    var Class = Flowjs.Class;
    var Step = Flowjs.Step;
    var TabsData = Class({
        extend:Step,
        construct:function(options){
            this.callsuper(options);
        },
        isAbstract:true，
        methods:{
            _describeData:function(){
                return {
                    input:{
                        dataURL:{
                            type:'string'
                        }
                    },
                    output:{
                        data:{
                            type:'object'
                        }
                    }
                };
            }
        }
    });

    module.exports = TabsData;
});
