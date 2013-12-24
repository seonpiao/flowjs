define(function(require,exports,module){
    var template = require('../lib/artTemplate/template');
    module.exports = {
        go:function(data,callback){
            var render, html;
            try{
                render = template(data.template);
                html = render(data.data);
            }catch(err){
                callback(null);
                return;
            }
            
            data.wrapper.html(html);
            callback();
        }
    };
});