var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.g'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.g'}],
    'default': {
        pageConf: {
            html: '<div id="test">测试元素</div>',
		},
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '获取元素',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					var ele = baidu.dom.g("test");
					baidu.dom.addClass(ele, "red");
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};