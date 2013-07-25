/*
 *
 * 流程共享数据
 *
 *
 */

define(function (require, exports, module) {

    var Class = require("./class");
    var tool = require("./tool");
    var deepExtend = require('./deepExtend');

    var isArray = Array.isArray || function(arg){
        return Object.prototype.toString.call(arg) == '[object Array]';
    };
    var isObject = function(arg){
        return Object.prototype.toString.call(arg) == '[object Object]';
    };

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
                    return result;
                } else {
                    return this._data[dataNames.toString()];
                }
            },
            setData: function (dataName,data) {
                if(isObject(data) || isArray(data)){
                    this._data[dataName] = deepExtend(this._data[dataName] || {},data);
                }
                else{
                    this._data[dataName] = data;
                }
                return false;
            }
        }
    });

    module.exports = FlowData;
});