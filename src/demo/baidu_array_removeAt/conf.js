var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.removeAt'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.removeAt'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">数组为：["one", "two", "three", "four"]，remove索引项为：1</div>'
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
					var output = T.array.removeAt(input, 1);
					T.g("resultArea").innerHTML="结果为："+input.join(',');
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};