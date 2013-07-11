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
                        contentWrapper: {
                            type: 'object'
                        }
                    },
                    output:{
                        contentDataURL: {
                            type: 'string'
                        },
                        contentTemplateURL: {
                            type: 'string'
                        }
                    }
                };
            }
        }
    });
    
    module.exports = FocusGenerator;
});
