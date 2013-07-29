define(function(require,exports,module){
    var Class = Flowjs.Class;
    var Step = Flowjs.Step;
    var TabsData = Class({
        extend:Step,
        construct:function(options){
            this.callsuper(options);
        },
        isAbstract:true,
        methods:{
            _describeData:function(){
                return {
                    input:{
                        contentDataURL:{
                            type:'string'
                        }
                    },
                    output:{
                        contentData:{
                            type:'object'
                        }
                    }
                };
            }
        }
    });

    module.exports = TabsData;
});
