var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.find'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.find'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">数组内容为：["one", "two", "three", "four"]，查找条件为：item.length > 3</div>'
        },
        formatBtn: {
            type: 'button',
            defaultValue: '执行',
            depend: [],
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
                	var input = ["one", "two", "three", "four"];
					var output = T.array.find(input, function(item, i){
					        return (item.length > 3);
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