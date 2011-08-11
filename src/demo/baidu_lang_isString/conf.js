var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.isString'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.isString'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            event: {
            	eventName: 'onclick',
            	handler: function(){
					T.g("resultArea").innerHTML += 'new String()判断为：' + baidu.lang.isString(new String()) + '<br />';
					T.g("resultArea").innerHTML += '1判断为：' + baidu.lang.isString(1) + '<br />';
					T.g("resultArea").innerHTML += '"1"判断为：' + baidu.lang.isString("1") + '<br />';
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  