require('seajs');
var assert = require("assert");
var Flow = require('../src/index');

describe('Flowjs', function() {
    describe('step', function() {
        it('步骤连续运行', function(done) {
            var flow = new Flow();
            var n = 0;

            flow.addStep('step1')
            flow.addStep('step2');
            flow.addStep('step3');

            flow.implement('step1', {
                go: function(data, callback) {
                    n++;
                    callback();
                }
            });
            flow.implement('step2', {
                go: function(data, callback) {
                    n++;
                    callback();
                }
            });
            flow.implement('step3', {
                go: function(data, callback) {
                    n++;
                    callback();
                }
            });

            flow.begin();
            flow.go('step1');
            flow.go('step2');
            flow.go('step3');

            flow.on('end',function(){
                assert.equal(3,n);
                done();
            });
        });
        it('数据在流程中传递', function(done) {
            var flow = new Flow();

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
            
            flow.on('end',function(){
                assert.equal(3,data.n);
                done();
            });
        });
        it('input中未定义的数据，步骤内无法使用', function(done) {
            var flow = new Flow();

            flow.addStep('step1',{
                input:{n:{empty:false}},
                output:{n:{empty:false}}
            })
            flow.addStep('step2');

            flow.implement('step1', {
                go: function(data, callback) {
                    data.n++;
                    callback(data);
                }
            });
            flow.implement('step2', {
                go: function(data, callback) {
                    assert.equal(undefined,data.n);
                    callback(data);
                    done();
                }
            });

            var data = {n:0};

            flow.begin(data);
            flow.go('step1');
            flow.go('step2');
        });
        it('output中未定义的数据，不会改变流程中的数据', function(done) {
            var flow = new Flow();

            flow.addStep('step1',{
                input:{n:{empty:false}},
                output:{n:{empty:false}}
            })
            flow.addStep('step2',{
                input:{n:{empty:false}}
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
            
            flow.on('end',function(){
                assert.equal(2,data.n);
                done();
            });
        });
        it('对不允许为空的数据做检查', function(done) {
            var flow = new Flow();

            flow.addStep('step1',{
                input:{n:{empty:false}},
                output:{n:{empty:false}}
            });
            flow.addStep('step2',{
                input:{a:{empty:false}}
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

            var data = {n:0};

            flow.begin(data);
            flow.go('step1');
            flow.go('step2');
            flow.on('error',function(e){
                assert.equal('Key [a] is not allow empty',e.data.message);
                done();
            });
        });
        it('未实现的步骤也能正确跳过', function(done) {
            var flow = new Flow();

            flow.addStep('step1');
            flow.addStep('step2');

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

            var data = {n:0};

            flow.begin(data);
            flow.go('step1');
            flow.go('step2');
            flow.go('step3');
            flow.on('end',function(e){
                done();
            });
        });
        it('传入null数据是，也能够正常运行', function(done) {
            var flow = new Flow();
            var n = 0;

            flow.addStep('step1')
            flow.addStep('step2');
            flow.addStep('step3');

            flow.implement('step1', {
                go: function(data, callback) {
                    n++;
                    callback(null);
                }
            });
            flow.implement('step2', {
                go: function(data, callback) {
                    n++;
                    callback(null);
                }
            });
            flow.implement('step3', {
                go: function(data, callback) {
                    n++;
                    callback(null);
                }
            });

            flow.begin(null);
            flow.go('step1');
            flow.go('step2');
            flow.go('step3');

            flow.on('end',function(){
                assert.equal(3,n);
                done();
            });
        });
    })
})
