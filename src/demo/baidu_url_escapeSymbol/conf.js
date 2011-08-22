var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.url.escapeSymbol'
    },
    
    demoType: [{key: 'default', val: 'baidu.url.escapeSymbol'}],
    'default': {
        pageConf: {
            html: '<div id="mydiv">字符转义演示</div>'
        },
        param0: {
            type: 'text',
            defaultValue: 'http://localhost/reg.php?age=20&name=Tom Smith&sex=男',
            size: 21,
            maxlength: 80
        },
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '字符转义',
            depend: ['param0'],
            event: {
                eventName: 'onclick',
                handler: function(arg0){
                    baidu.dom.g('mydiv').innerHTML = '字符转义结果：' + baidu.url.escapeSymbol(arg0);
                }
            }
        }
    },
    
    groups: {
        'default': [['param0', 'formatBtn']]
    }
};