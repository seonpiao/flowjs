define(function(require, exports, module) {
    var Flow = Flowjs.Class({
        extend: Flowjs.Flow,
        construct: function(options) {
            this.callsuper(options);
            this._addStep("步骤1", require("./stepdef/s1"));
            this._addStep("步骤2", require("./stepdef/s2"));
            this._addStep("步骤3", require("./stepdef/s3"));
            this._addStep("步骤4", require("./stepdef/s4"));
            this._addStep("步骤5", require("./stepdef/s5"));
            this.implement("步骤1", require("./steps/s1"));
            this.implement("步骤2", require("./steps/s2"));
            this.implement("步骤3", require("./steps/s3"));
            this.implement("步骤4", require("./steps/s4"));
            this.implement("步骤5", require("./steps/s5"));
        },
        methods: {
            init: function() {
                var _this = this;
                this._addInterface('go',function(){
                    // _this._sync(function(){
                        _this._go("步骤1");
                        _this._go("步骤2");
                        _this._go("步骤3");
                        _this._go("步骤4");
                        _this._go("步骤5");
                    // });
                });
            }
        }
    });
    module.exports = Flow;
});