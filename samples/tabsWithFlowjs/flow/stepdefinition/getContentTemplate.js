define(function(require,exports,module){
    var Class = Flowjs.Class;
    var Step = Flowjs.Step;
    var TabsTemplate = Class({
        extend:Step,
        construct:function(options){
            this.callsuper(options);
        },
        isAbstract:true,
        methods:{
            _describeData:function(){
                return {
                    input:{
                        contentTemplateURL:{
                            type:'string'
                        }
                    },
                    output:{
                        contentTemplate:{
                            type:'string'
                        }
                    }
                };
            }
        }
    });

    module.exports = TabsTemplate;
});
