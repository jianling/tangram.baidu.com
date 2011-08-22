var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.removeAt'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.removeAt'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">数组为：["one", "two", "three", "four"]，remove索引项为：1</div><div id="result"></div>'
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
					var output = baidu.array.removeAt(input, 1);
					baidu.dom.g("result").innerHTML="结果为："+output;
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};