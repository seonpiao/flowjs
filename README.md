Flowjs
======

一个开放的，面向业务流程的，可灵活扩展和定制的前端业务开发框架。

本次0.5.x的更新相比之前版本有巨大的变化。

* 极大的简化了《流程》和《步骤》的定义。
* 简化输入输出数据的校验，不做深度校验，提高执行效率（看未来是否有需要加深度校验）
* 内部通过context的传递来避免多次调用时，步骤数据会互相覆盖的情况。
* 开始编写测试用例。

框架思路
-------

互联网产品的特点就是快速的迭代更新，这就对前端的响应速度提出了挑战。flowjs的思路，就是通过抽象变化的产品形态背后相对稳定的业务流程，来以不变应万变！

框架由《流程》和《步骤》两个部分组成。《流程》负责定义一个业务逻辑的流程，《步骤》负责定义流程中一个步骤的实现。

开发同学可以将一个产品，定义为Flowjs的一个《流程》。当产品细节发生变化时，开发同学可以在基于流程不变的情况下，通过快速修改对应的步骤，来快速响应产品变化。

并且一个产品流程可以开放出来，类似的产品可以复用该《流程》，用自己的《步骤》实现来迅速完成自己产品的开发。

Flowjs还可以帮助开发者提高自己代码的逻辑性和可读性。《流程》代码与流程图有异曲同工之处。能够让其他开发者更容易的读懂和维护你的代码。未来计划提供 流程图 与 《流程》代码 之间互相转换的工具。

注意事项
-------

每一个步骤需要明确的定义本步骤的输入与输出数据，否则会获取不到需要的流程数据，本步骤对数据做出的修改也无法提交到流程里。

允许一个步骤不经过定义，就直接使用。流程在执行时会自动跳过该步骤。便于先跑通主要流程，再实现具体步骤。

步骤与步骤之间尽可能的减少依赖

每一个步骤只能调用一次callback通知框架步骤完成

一个《步骤》，不能存在两个下一步。例如下面的例子是不允许的，因为“步骤1”同时有两个下一步“步骤2”和“步骤4”，因为在流程图中，一个普通节点是不能有两个分支的。

    flow.go('步骤1');
    flow.go('步骤2');
    flow.go('步骤3',{
        cases:{
            'yes':function(){
                flow.go('步骤1');
                flow.go('步骤4');
            }
        }
    });

测试
-------

nodejs环境下

    npm install -g mocha
    mocha test/

《流程》定义
-------

    var Flow = require('flowjs');

    var flow = new Flow();

    //《步骤》定义
    flow.addStep('step1',{
        type:'step',  //《步骤》类型。step/condition/event。可选
        input:{ //输入数据
            param1:{
                empty:false //是否允许为空,默认为true
            }
        },
        output:{ //输出数据，如果param1未定义为输出数据，那么步骤内对param1做出的修改，不会保存的《流程》中
            param1:{
                empty:false //是否允许为空,默认为true
            }
        }
    });
    flow.addStep('step2'); //也可以仅仅这样来定义一个《步骤》。这将会定义一个type为step，没有输入输出数据的《步骤》
    flow.addStep('step3',{ //这样可以定义一个condition类型的《步骤》
        type:'condition'
    });
    flow.addStep('step4',{ //这样可以定义一个event类型的《步骤》
        type:'event'
    });

    //《步骤》的实现
    flow.implement('step1', {
        /**
         * 《步骤》的go方法，会作为《步骤》的入口，《流程》在执行到该《步骤》时，会执行go方法
         * @param  {[object]}   data    如果定义了input，那么会传入需要输入的数据
         * @param  {Function} callback  《步骤》执行完成后，需要调用callback通知《流程》
         */
        go: function(data, callback) {
            callback();
        }
    });
    flow.implement('step2', {
        go: function(data, callback) {
            callback();
        }
    });
    /**
     * 这是一个condition类型的《步骤》
     * @param  {Function} callback  这个回调的原型是function(data,condition){}
     * 其中condition表示步骤选择的分支。例子中表示，执行该步骤后，选择case1分支作为后续的步骤继续执行
     */
    flow.implement('step3', {
        go: function(data, callback) {
            callback(data,'case1');
        }
    });
    /**
     * 这是一个event类型的《步骤》
     * @param  {function} callback 这个是步骤结束后的回调，同step类型的回调
     * @param  {function} trigger 这个是有事件发生时，用于通知《流程》的方法
     */
    flow.implement('step4', {
        go: function(data, callback, trigger) {
            $(document).on('click',function(){
                trigger(data,'docclick');
            });
            callback(data,'case1');
        }
    });

    /**
     * begin的原型为function(data){}
     * 其中data为传入到流程中的初始数据
     */
    flow.begin();
    flow.go('step1');
    flow.go('step2');
    flow.go('step3',{
        cases:{
            //定义case1条件分支
            case1:function(data){
                flow.begin(data);
                flow.go('step4',{
                    events:{
                        //定义docclick事件发生时的处理
                        docclick:function(data){
                            flow.begin(data);
                            flow.go('step5');
                        }
                    }
                });
            }
        }
    });
    //一个流程的所有除event类型的步骤都执行完毕后，会触发end事件。
    flow.on('end',function(){
        
    });

API
---------

Flow

    implement：function(stepName,options){}

        public

        实现《流程》中的一个《步骤》。

        stepName

            《步骤》名

        options

            实现《步骤》的相关参数

    destroy：function(){}

        public

        销毁流程，会调用每一个执行过的步骤的destroy方法，让每个步骤有机会去释放资源。

    go：function(step,options){}

        public

        用于定义《流程》

        step

            步骤名

        options.events

            定义传入event类型《步骤》的事件集

        options.cases

            定义传入condition类型《步骤》的分支集

    addStep：function(name,options){}

        public

        向流程注册步骤

        name

            《步骤》名

        options

            定义《步骤》的相关参数


升级指导
-------
0.5.0开始，《流程》和《步骤》的定义方式全部发生变化，请老版本代码按照0.5.0的方式重新定义