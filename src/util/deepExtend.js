define(function(require, exports, module) {
    var isArray = Array.isArray || function(arg){
        return Object.prototype.toString.call(arg) == '[object Array]';
    };
    var isObject = function(arg){
        return Object.prototype.toString.call(arg) == '[object Object]';
    };
    var extend = function(dest, object) {
        var second, options, key, src, copy,
            i = 1,
            n = arguments.length,
            result = dest,
            copyIsArray, clone;

        for (; i < n; i++) {
            options = arguments[i];
            if (isObject(options) || isArray(options)) {
                for (key in options) {
                    src = result[key];
                    copy = options[key];
                    // Prevent never-ending loop
                    if (src === copy) {
                        continue;
                    }
                    if (copy && (isObject(copy) || (copyIsArray = isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isObject(src) ? src : {};
                        }
                        result[key] = extend(clone, copy);
                    } else if (copy !== undefined) {
                        result[key] = copy;
                    }
                }
            }
        }
        return result;
    };

    module.exports = extend;
});