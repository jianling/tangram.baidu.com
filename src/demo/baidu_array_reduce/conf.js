var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.reduce'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.reduce'}],
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
                	var input = [1,2,3,4,5];
					var output = T.array.reduce(input, function(end, item){
					    return end + item;
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