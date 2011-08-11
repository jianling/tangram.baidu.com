var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.isFunction'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.isFunction'}],
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
					T.g("resultArea").innerHTML += '{}判断为：' + baidu.lang.isFunction({}) + '<br />';
					T.g("resultArea").innerHTML += 'Function判断为：' + baidu.lang.isFunction(Function) + '<br />';
					T.g("resultArea").innerHTML += 'function(){}判断为：' + baidu.lang.isFunction(function(){}) + '<br />';
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  