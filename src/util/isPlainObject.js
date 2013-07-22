/*
 *
 * 简易工具
 *
 *
 */

define(function (require, exports, module) {
    var isPlainObject = function(unknow) {
        var key,
            hasOwnProperty = Object.prototype.hasOwnProperty;

        if ( typeof unknow != "object" || unknow == null) {
            return false;
        }

        //判断new fn()自定义对象的情况
        //constructor不是继承自原型链的
        //并且原型中有isPrototypeOf方法才是Object
        if ( unknow.constructor &&
            !hasOwnProperty.call(unknow, "constructor") &&
            !hasOwnProperty.call(unknow.constructor.prototype, "isPrototypeOf") ) {
            return false;
        }
        //判断有继承的情况
        //如果有一项是继承过来的，那么一定不是字面量Object
        //OwnProperty会首先被遍历，为了加速遍历过程，直接看最后一项
        for ( key in unknow ) {}
        return key === undefined || hasOwnProperty.call( unknow, key );
    };
    module.exports = isPlainObject;
});