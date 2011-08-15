var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.map'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.map'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">结果为：</div>'
        },
        formatBtn: {
            type: 'button',
            defaultValue: '执行',
            depend: [],
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
                	var input = [1,2,3,4,5];
					var output = T.array.map(input, function(item, i){
					    return item+10;
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