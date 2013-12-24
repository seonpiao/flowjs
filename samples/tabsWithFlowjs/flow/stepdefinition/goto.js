define(function(require,exports,module){
    module.exports = {
        input:{
            titleContainers:{type:'object'},
            contentContainers:{type:'object'},
            goto:{type:'number'}
        },
        output:{
            curr:{type:'number'},
            contentWrapper:{type:'object'}
        }
    };
});
