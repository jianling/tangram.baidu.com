var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.swf.version'
    },
    
    demoType: [{key: 'default', val: 'baidu.swf.version'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '获取当前浏览器的FLASH插件版本号',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		T.g('resultArea').innerHTML = "当前浏览器的FLASH插件版本号：" + baidu.swf.version;
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  