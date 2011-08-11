var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.filter'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.filter'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">结果为：</div>'
        },
        formatBtn: {
            type: 'button',
            defaultValue: '执行',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
                	var input = ["one", "two", "three"];
					var output = T.array.filter(input, function(item, i){
					    return (item.length < 4 && i > 0);
					});
                    baidu.dom.g('resultArea').innerHTML = "结果为：" + output;
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};