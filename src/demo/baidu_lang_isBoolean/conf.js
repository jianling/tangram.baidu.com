var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.isBoolean'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.isBoolean'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
					T.g("resultArea").innerHTML += 'true判断为：' + baidu.lang.isBoolean(true) + '<br />';
					T.g("resultArea").innerHTML += '空字符串判断为：' + baidu.lang.isBoolean('') + '<br />';
					T.g("resultArea").innerHTML += '字符串"true"判断为：' + baidu.lang.isBoolean('true') + '<br />';
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  