/*
 *
 * 流程共享数据
 *
 *
 */

define(function (require, exports, module) {

    var Class = require("./class");
    var tool = require("./tool");

    var FlowData = Class({
        construct: function (options) {
            /*
             *   data
             *       "name":
             *           exp:  过期时间
             *           data:
             *
             * */

            this._data = {};
        },
        methods: {
            /*
             * getData
             * param:
             *   dataNames  array/string
             *
             * */
            getData: function (dataNames) {
                var result = {};
                var now = new Date().getTime();
                if (tool.isArray(dataNames)) {
                    var length = dataNames.length;
                    for (var i = 0; i < length; i++) {
                        var name = dataNames[i];
                        if(this._data.hasOwnProperty(name)){
                            result[name] = this._data[name];
                        }
                    }
                } else {
                    result[dataNames.toString()] = this._data[dataNames.toString()];
                }
                return result;
            },
            setData: function (dataName,data) {
                this._data[dataName] = data;
                return false;
            }
        }
    })

    module.exports = FlowData;
});