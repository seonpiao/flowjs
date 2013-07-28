define(function(require, exports, module) {
    module.exports = {
        methods: {
            _process: function(data, callback) {
                console.log(4);
                callback(null, {});
            }
        }
    };
});