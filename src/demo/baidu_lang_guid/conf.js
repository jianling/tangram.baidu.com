var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.guid'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.guid'}],
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
					    T.g('resultArea').innerHTML += "返回：" + baidu.lang.guid();
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  