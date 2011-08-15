var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.setBorderBoxSize'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.setBorderBoxSize'}],
    'default': {
        pageConf: {
            html: '<div class="contain" id="target"></div>',
		},
        param0: {
            type: 'text',
			label: 'width:',
            defaultValue: '100',
            size: 20,
            maxlength: 80
        },
        param1: {
            type: 'text',
			label: 'height:',
            defaultValue: '100',
            size: 20,
            maxlength: 80
        },
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '设置元素的outerHeight和outerWidth',
            depend: ['param0', 'param1'],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
					var styles={width: arg0, height: arg1};
					baidu.dom.setBorderBoxSize("target", styles);
                }
            }
        }
    },
    
    groups: {
        'default': [['param0', 'param1'], ['formatBtn']]
    }
};