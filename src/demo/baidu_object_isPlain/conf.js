var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.object.isPlain'
    },
    
    demoType: [{key: 'default', val: 'baidu.object.isPlain'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"><p>检查对象是否以字面量方式 {key:value} 或者new Object方式创建</p></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		T.g('resultArea').innerHTML = "{name:\"tom\"}：" + baidu.object.isPlain({name:"tom"}) + '<br />';
            		T.g('resultArea').innerHTML += "new Object()：" + baidu.object.isPlain(new Object()) + '<br />';
            		T.g('resultArea').innerHTML += "new String()：" + baidu.object.isPlain(new String()) + '<br />';
            		T.g('resultArea').innerHTML += "function(){}：" + baidu.object.isPlain(function(){}) + '<br />';
            		T.g('resultArea').innerHTML += "\"a string\"：" + baidu.object.isPlain("a string") + '<br />';
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  