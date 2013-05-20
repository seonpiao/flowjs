define(function(require,exports,module){
    module.exports = {
        methods:{
            _process:function(data,callback){
                var curr = data.curr;
                var total = data.frames.length;
                var slide = Q.$('[data-focus-elem=slide]');
                var currElem = Q.$(data.frames[data.curr - 1]);
                var width = currElem.width();
                var left;
                var additional = slide.down('[data-focus-elem=additionalframe]');
                if(!additional){
                    this._additionalFirst = Q.$(Q.$(data.frames[0]).clone(true));
                    this._additionalFirst.attr('data-focus-elem','additionalframe');
                    this._additionalLast = Q.$(Q.$(data.frames[total - 1]).clone(true));
                    this._additionalLast.attr('data-focus-elem','additionalframe');
                    slide.insertBefore(this._additionalLast,data.frames[0]);
                    slide.append(this._additionalFirst);
                    slide.css('width',((total + 2) * width) + 'px');
                }
                left = (0 - width * (data.curr));
                if(data.curr == 1 && data.prev == total){
                    if(data.dir == 'next'){
                        left = (0 - width * (data.prev + 1));
                    }
                    slide.on('transitionend',function resetPos(){
                        slide.removeClass('slideTrans');
                        slide.un('transitionend',resetPos);
                        slide.css('left',(0 - width) + 'px');
                        setTimeout(function(){
                            slide.addClass('slideTrans');
                        },0);
                    });
                }
                else if(data.curr == total && data.prev == 1){
                    if(data.dir == 'prev'){
                        left = 0;
                    }
                    slide.on('transitionend',function resetPos(){
                        slide.removeClass('slideTrans');
                        slide.un('transitionend',resetPos);
                        slide.css('left',(0 - width * total) + 'px');
                        setTimeout(function(){
                            slide.addClass('slideTrans');
                        },0);
                    });
                }
                setTimeout(function(){
                    slide.css('left',left + 'px');
                    callback();
                },0);
            }
        }
    };
});