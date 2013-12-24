define(function(require, exports, module) {

    var flow = new Flowjs.Flow();

            flow.addStep('step1',{
                input:{n:{empty:false}},
                output:{n:{empty:false}}
            })
            flow.addStep('step2',{
                input:{n:{empty:false}},
                output:{n:{empty:false}}
            });
            flow.addStep('step3',{
                input:{n:{empty:false}},
                output:{n:{empty:false}}
            });

            flow.implement('step1', {
                go: function(data, callback) {
                    data.n++;
                    callback(data);
                }
            });
            flow.implement('step2', {
                go: function(data, callback) {
                    data.n++;
                    callback(data);
                }
            });
            flow.implement('step3', {
                go: function(data, callback) {
                    data.n++;
                    callback(data);
                }
            });

            var data = {n:0};

            flow.begin(data);
            flow.go('step1');
            flow.go('step2');
            flow.go('step3');

    module.exports = flow;
});

