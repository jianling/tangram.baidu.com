var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.isDate'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.isDate'}],
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
					T.g("resultArea").innerHTML += 'new Date判断为：' + baidu.lang.isDate(new Date()) + '<br />';
					T.g("resultArea").innerHTML += '字符串"2010-08-10"判断为：' + baidu.lang.isDate('2010-08-10') + '<br />';
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  