var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.number.pad'
    },
    
    demoType: [{key: 'default', val: 'baidu.number.pad'}],
    'default': {
        pageConf: {
            html: '<div id="mydiv">补齐处理演示</div>'
        },
        param0: {
            type: 'text',
            defaultValue: '89',
            size: 20,
            maxlength: 80
        },
        param1: {
            type: 'text',
            defaultValue: '5',
            size: 20,
            maxlength: 80
        },
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '补齐处理',
            depend: ['param0', 'param1'],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
                    baidu.dom.g('mydiv').innerHTML = '补齐处理结果：' + baidu.number.pad(arg0, arg1);
                }
            }
        }
    },
    
    groups: {
        'default': [['param0', 'param1', 'formatBtn']]
    }
};