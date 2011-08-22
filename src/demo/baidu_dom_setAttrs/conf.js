var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.setAttrs'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.setAttrs'}],
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
        param1: {
            type: 'radio',
			//label: 'disable:',
			data: {
				key: ['1', '2'],
				val: ['disable', 'enable']
			},
            defaultValue: '1',
        },
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '设置目标元素的属性',
            depend: ['param0', 'param1'],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
					var disableValue = (arg1[0] == '1') ? 'disabled' : 'false';
					if(arg1[0] == '2'){
						baidu.dom.g("test").removeAttribute("disabled");
						baidu.dom.setAttrs("test", {size:arg0});
					}
					else baidu.dom.setAttrs("test", {size:arg0,disabled:disableValue});
                }
            }
        }
    },
    
    groups: {
        'default': [['param0'], ['param1'], ['formatBtn']]
    }
};