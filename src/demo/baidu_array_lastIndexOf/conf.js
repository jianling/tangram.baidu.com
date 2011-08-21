var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.lastIndexOf'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.lastIindexOf'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">查找数组为["one", "two", "three", "four", "three"]，查找内容为："three"</div>'
        },
        formatBtn: {
            type: 'button',
            defaultValue: '执行',
            depend: [],
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
                	var input = ["one", "two", "three", "four", "three"];
					var output = T.array.lastIndexOf(input, "three");
                    baidu.dom.g('resultArea').innerHTML = "结果为：" + output;
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};