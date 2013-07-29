define(function(require, exports, module) {
    var Class = Flowjs.Class;
    var Step = Class({
        extend: Flowjs.Step,
        construct: function(options) {
            this.callsuper(options);
        },
        isAbstract: true,
        methods: {
            _describeData: function() {
                return {
                    input: {},
                    output: {}
                };
            }
        }
    });
    module.exports = Step;
});