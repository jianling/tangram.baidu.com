var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.setBorderBoxHeight'
    },
    
    demoType: [{key: 'default', val: 'setBorderBoxHeight'}],
    'default': {
        pageConf: {
            html: '<div class="contain" id="target"></div>',
		},
        param0: {
            type: 'text',
			label: 'height:',
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
					baidu.dom.setBorderBoxHeight("target", arg0);
                }
            }
        }
    },
    
    groups: {
        'default': [['param0', 'formatBtn']]
    }
};