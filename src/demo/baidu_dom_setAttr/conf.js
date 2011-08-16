var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.setAttr'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.setAttr'}],
    'default': {
        pageConf: {
            html: '<input id="test" type="text" size="20" value="被设置的元素" >',
		},
        param0: {
            type: 'text',
			label: 'size:',
            defaultValue: '40',
            size: 11,
            maxlength: 80
        },
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '设置目标元素的属性',
            depend: ['param0'],
            event: {
                eventName: 'onclick',
                handler: function(arg0){
					baidu.dom.setAttr("test","size",arg0);
                }
            }
        }
    },
    
    groups: {
        'default': [['param0', 'formatBtn']]
    }
};