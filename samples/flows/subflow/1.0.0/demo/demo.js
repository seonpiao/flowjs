define(function(require, exports, module) {
    Q.ic.InfoCenter.enable();
    var Flow = require("../index");
    var steps = {
        "步骤1": require("../steps/s1"),
        "步骤2": require("../steps/s2"),
        "步骤3": require("../steps/s3"),
        "步骤4": require("../steps/s4"),
        "步骤5": require("../steps/s5")
    };
    module.exports = {
        init: function() {
            var flow = new Flow();
            for (var stepName in steps) {
                if (steps.hasOwnProperty(stepName)) {
                    flow.implement(stepName, steps[stepName]);
                }
            }
            flow.init();
            return flow;
        }
    };
});