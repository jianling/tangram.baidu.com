var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.setBorderBoxWidth'
    },
    
    demoType: [{key: 'default', val: 'setBorderBoxWidth'}],
    'default': {
        pageConf: {
            html: '<div class="contain" id="target"></div>',
		},
        param0: {
            type: 'text',
			label: 'width:',
            defaultValue: '100',
            size: 11,
            maxlength: 80
        },
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '设置',
            depend: ['param0'],
            event: {
                eventName: 'onclick',
                handler: function(arg0){
					baidu.dom.setBorderBoxWidth("target", arg0);
                }
            }
        }
    },
    
    groups: {
        'default': [['param0', 'formatBtn']]
    }
};