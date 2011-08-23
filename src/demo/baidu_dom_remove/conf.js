var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.remove'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.remove'}],
    'default': {
        pageConf: {
            html: '<div id="test">测试元素</div>'
		},
        formatBtn0: {
			isMain: true,
            type: 'button',
            defaultValue: '移除元素',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.remove("test");
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0']]
    }
};