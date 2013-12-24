require('seajs');
var assert = require("assert");
var Flow = require('../src/index');

describe('Flowjs', function() {
    describe('condition', function() {
        it('选择一个条件分支', function(done) {
            var flow = new Flow();
            var n = 0;

            flow.addStep('step1')
            flow.addStep('step2',{
                type:'condition'
            });
            flow.addStep('step3');
            flow.addStep('step4');

            flow.implement('step1', {
                go: function(data, callback) {
                    callback();
                }
            });
            flow.implement('step2', {
                go: function(data, callback) {
                    callback(data,'case1');
                }
            });
            flow.implement('step3', {
                go: function(data, callback) {
                    n += 3;
                    callback();
                }
            });
            flow.implement('step4', {
                go: function(data, callback) {
                    n += 4;
                    callback();
                }
            });

            flow.begin();
            flow.go('step1');
            flow.go('step2',{
                cases:{
                    case1:function(data){
                        flow.begin(data);
                        flow.go('step3');
                    },
                    case2:function(data){
                        flow.begin(data);
                        flow.go('step4');
                    }
                }
            });
            flow.on('end',function(){
                assert.equal(3,n);
                done();
            });
        });
    })
})
