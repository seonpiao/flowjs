define(function(require,exports,module){
    var template = require('../lib/artTemplate/template');
    module.exports = {
        methods:{
            _process:function(data,callback){
                var render, html;
                try{
                    render = template(data.contentTemplate);
                    html = render(data.contentData);
                }catch(err){
                    callback(err, null);
                    return;
                }
                
                data.contentWrapper.html(html);
                data.contentWrapper.attr("data-tabs-contentready", true);
                callback();
            }
        }
    };
});