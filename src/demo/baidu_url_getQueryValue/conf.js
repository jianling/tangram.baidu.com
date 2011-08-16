var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.url.getQueryValue'
    },
    
    demoType: [{key: 'default', val: 'baidu.url.getQueryValue'}],
    'default': {
        pageConf: {
            html: '<div id="mydiv">获取Query值演示</div>'
        },
        param0: {
            type: 'text',
            defaultValue: 'http://localhost/reg.php?age=20&name=Tom Smith&sex=男',
            size: 21,
            maxlength: 80
        },
        param1: {
            type: 'text',
            defaultValue: 'sex',
            size: 10,
            maxlength: 80
        },
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '取得Query值',
            depend: ['param0', 'param1'],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
                    baidu.dom.g('mydiv').innerHTML = '取到的Query值：' + arg1 + ' = \'' + baidu.url.getQueryValue(arg0, arg1) + '\'';
                }
            }
        }
    },
    
    groups: {
        'default': [['param0'], ['param1', 'formatBtn']]
    }
};