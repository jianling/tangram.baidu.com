var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.resizable'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.resizable'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea"></div><div id="target"></div>'
		},
        formatBtn0: {
			isMain: true,
            type: 'button',
            defaultValue: '设置',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.resizable("target");
					baidu.dom.resizable("target");
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0']]
    }
};