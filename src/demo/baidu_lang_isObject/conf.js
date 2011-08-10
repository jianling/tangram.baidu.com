var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.isObject'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.isObject'}],
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
					T.g("resultArea").innerHTML += '{}判断为：' + baidu.lang.isObject({}) + '<br />';
					T.g("resultArea").innerHTML += 'new Object()判断为：' + baidu.lang.isObject(new Object()) + '<br />';
					T.g("resultArea").innerHTML += 'function(){}判断为：' + baidu.lang.isObject(function(){}) + '<br />';
					T.g("resultArea").innerHTML += 'Function判断为：' + baidu.lang.isObject(Function) + '<br />';
					T.g("resultArea").innerHTML += 'document.body判断为：' + baidu.lang.isObject(document.body) + '<br />';
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  