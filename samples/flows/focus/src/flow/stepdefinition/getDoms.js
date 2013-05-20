define(function(require,exports,module){
    var Class = Flowjs.Class;
    var Step = Flowjs.Step;
    var FocusData = Class({
        extend:Step,
        construct:function(options){
            this.callsuper(options);
        },
        methods:{
            _describeData:function(){
                return {
                    input:{
                        wrapper:{
                            type:'object'
                        }
                    },
                    output:{
                        frames:{
                            type:'object'
                        },
                        smalls:{
                            type:'object'
                        },
                        cnt:{
                            type:'object',
                            empty:true
                        }
                    }
                };
            }
        }
    });
    
    module.exports = FocusData;
});
