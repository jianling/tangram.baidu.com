var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.number.randomInt'
    },
    
    demoType: [{key: 'default', val: 'baidu.number.randomInt'}],
    'default': {
        pageConf: {
            html: '<div id="mydiv">随机数演示</div>'
        },
        param0: {
            type: 'text',
			label: '最小值：',
            defaultValue: '2',
            size: 16,
            maxlength: 80
        },
        param1: {
            type: 'text',
			label: '最大值：',
            defaultValue: '20',
            size: 16,
            maxlength: 80
        },
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '生成随机数',
            depend: ['param0', 'param1'],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
                    baidu.dom.g('mydiv').innerHTML = '随机数：' + baidu.number.randomInt(parseInt(arg0, 10), parseInt(arg1, 10));
                }
            }
        }
    },
    
    groups: {
        'default': [['param0', 'param1', 'formatBtn']]
    }
};