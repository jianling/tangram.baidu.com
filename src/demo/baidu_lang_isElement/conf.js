var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.isElement'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.isElement'}],
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
					T.g("resultArea").innerHTML += 'body判断为：' + baidu.lang.isElement(document.body) + '<br />';
					T.g("resultArea").innerHTML += '超空间中的元素节点判断为：' + baidu.lang.isElement(document.createElement('div')) + '<br />';
					T.g("resultArea").innerHTML += 'documentFragment判断为：' + baidu.lang.isElement(document.createDocumentFragment()) + '<br />';
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  