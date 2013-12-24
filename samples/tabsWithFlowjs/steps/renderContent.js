define(function(require,exports,module){
    var template = require('../lib/artTemplate/template');
    module.exports = {
        go:function(data,callback){
            var render, html;
            try{
                render = template(data.contentTemplate);
                html = render(data.contentData);
            }catch(err){
                callback(null);
                return;
            }
            
            data.contentWrapper.html(html);
            data.contentWrapper.attr("data-tabs-contentready", true);
            callback();
        }
    };
});