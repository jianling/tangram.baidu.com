var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.removeStyle'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.removeStyle'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea"></div><div id="target" style="background:red"></div>'
		},
        formatBtn0: {
			isMain: true,
            type: 'button',
            defaultValue: '祛除背景',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.removeStyle("target","background");
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0']]
    }
};