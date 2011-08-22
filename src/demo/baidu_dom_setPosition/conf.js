var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.setPosition'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.setPosition'}],
    'default': {
        pageConf: {
            html: '<div class="contain" id="target"></div>',
		},
        param0: {
            type: 'text',
			label: 'top:',
            defaultValue: '100',
            size: 11,
            maxlength: 80
        },
        param1: {
            type: 'text',
			label: 'left:',
            defaultValue: '100',
            size: 9,
            maxlength: 80
        },
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '设置元素的位置',
            depend: ['param0', 'param1'],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
					var position={top: arg0, left: arg1};
					baidu.dom.setPosition("target", position);
                }
            }
        }
    },
    
    groups: {
        'default': [['param0', 'param1'], ['formatBtn']]
    }
};