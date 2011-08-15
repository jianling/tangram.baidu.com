var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.isArray'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.isArray'}],
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
					T.g("resultArea").innerHTML += '判断空数组' + baidu.lang.isArray([]) + '<br />';
					T.g("resultArea").innerHTML += '判断非空数组' + baidu.lang.isArray([1,2]) + '<br />';
					T.g("resultArea").innerHTML += '判断字符串' + baidu.lang.isArray('123445') + '<br />';
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  