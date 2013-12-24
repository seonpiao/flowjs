define(function(require,exports,module){
    module.exports = {
        type:'event',
        input:{
            titleContainers:{type:'object'},
            contentContainers:{type:'object'}
        },
        output:{
            goto:{empty:true}
        }
    };
});
