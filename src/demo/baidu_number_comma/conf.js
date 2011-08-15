var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.number.comma'
    },
    
    demoType: [{key: 'default', val: 'baidu.number.comma'}],
    'default': {
        pageConf: {
            html: '<div id="mydiv">逗号分隔演示</div>'
        },
        param0: {
            type: 'text',
            defaultValue: '100000000',
            size: 60,
            maxlength: 80
        },
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '逗号分隔',
            depend: ['param0'],
            event: {
                eventName: 'onclick',
                handler: function(arg0){
                    baidu.dom.g('mydiv').innerHTML = '逗号分隔结果：' + baidu.number.comma(arg0);
                }
            }
        }
    },
    
    groups: {
        'default': [['param0', 'formatBtn']]
    }
};