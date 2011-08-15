var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.object.isPlain'
    },
    
    demoType: [{key: 'default', val: 'baidu.object.isPlain'}],
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
            		T.g('resultArea').innerHTML = "检查字面量方式创建的对象：" + baidu.object.isPlain({name:"tom"}) + '<br />';
            		T.g('resultArea').innerHTML += "检查new Object()方式创建的对象：" + baidu.object.isPlain(new Object()) + '<br />';
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  