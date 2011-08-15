var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.isNumber'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.isNumber'}],
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
					T.g("resultArea").innerHTML += '{}判断为：' + baidu.lang.isNumber({}) + '<br />';
					T.g("resultArea").innerHTML += '1判断为：' + baidu.lang.isNumber(1) + '<br />';
					T.g("resultArea").innerHTML += 'NaN判断为：' + baidu.lang.isNumber(NaN) + '<br />';
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  