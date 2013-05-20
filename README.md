flowjs
======

一个开放的，面向业务流程的，可灵活扩展和定制的前端业务开发框架。

框架思路
-------

互联网产品的特点就是快速的迭代更新，这就对前端的响应速度提出了挑战。flowjs的思路，就是通过抽象变化的产品形态背后相对稳定的业务流程，来以不变应万变！

框架由Flow（流程）和Step（步骤）两个类组成。Flow负责定义一个业务逻辑的流程，Step负责定义流程中的一个步骤。
这与一个流程图很类似，未来我们会提供工具来实现流程图与代码的互相转换。这样就可以实现可视化的流程制定。

Step类需要明确的定义本步骤所需要的参数。

基于同一个Flow，可以通过实现不同的Step类的子类来实现扩展与定制。

开发者可以贡献抽象的Flow，也可以贡献实现好的Step，达到开放、共享的目的。

Flow定义
-------

    define(function(require, exports, module) {
        var Class = Flowjs.Class;
        var Flow = Flowjs.Flow;
        var CommonFocusFlow = Class({
            extend:Flow,
            construct:function(options){
                this.callsuper(options);
                this._addStep('step1',require('./stepdefinition/step1'));
                this._addStep('step2',require('./stepdefinition/step2'));
                this._addStep('step3',require('./stepdefinition/step3'));
                this._addStep('step4',require('./stepdefinition/step4'));
                this._addStep('step5',require('./stepdefinition/step5'));
                this._addStep('step6',require('./stepdefinition/step6'));
            },
            methods:{
                //初始化流程
                start:function(){
                    var _this = this;
                    this.go('step1');
                    this.go('step2');
                    this.go('step3');
                    this.go('step4');
                    this.go('step5',null,{
                        cases:{
                            '1':function(){
                                _this.go('step1');
                            },
                            '2':function(){
                                _this.go('step6');
                            }
                        },defaultCase:function(){
                            _this.go('step4');
                        }
                    });
                }
            }
        });

        module.exports = CommonFocusFlow;
    });

以上流程首先会顺序执行 1 -> 2 -> 3 -> 4 -> 5

step5是一个条件判断的步骤，这里会进行判断

如果结果为1，则继续 1 -> 2 -> 3 -> 4 -> 5

如果结果为2，则执行 6

其余情况，则继续 4 -> 5

Step定义
-------

基类的定义

    define(function(require,exports,module){
        var Class = Flowjs.Class;
        var Step = Flowjs.Step;
        var Next = Class({
            extend:Step,
            construct:function(options){
                this.callsuper(options);
            },
            methods:{
                _describeData:function(){
                    return {
                        input:{
                            frames:{
                                type:'object'
                            },
                            curr:{
                                type:'number'
                            }
                        },
                        output:{
                            curr:{
                                type:'number'
                            }
                        }
                    };
                }
            }
        });
        
        module.exports = Next;
    });



实现类的定义

    define(function(require,exports,module){
        module.exports = {
            methods:{
                _process:function(data,callback){
                    var total = data.frames.length;
                    var curr = data.curr + 1;
                    if(curr == total){
                        curr = 0;
                    }
                    callback(null,{curr:curr});
                }
            }
        };
    });


以上定义了一个步骤，要求输入的数据对象结构为：{curr:1,frames:{}}；输出的数据对象结果为{curr:2}

注意事项
---------

步骤与步骤之间尽可能的减少依赖

每一个步骤只能调用一次callback通知框架步骤完成

v1.2.11发布
---------

从框架层面避免步骤直接使用enterData作为result返回，因为在步骤返回之后，框架会清空enterData中的所有值