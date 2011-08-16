var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.ready'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.ready'}],
    'default': {
        pageConf: {
            html: '<div id="test">页面加载中...</div>',
			jsCode: 'baidu.dom.ready(function(){baidu.dom.g("test").innerHTML = "页面加载完毕!";})'
		},
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '加载',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					    baidu.dom.ready(function(){
							baidu.dom.g("test").innerHTML = "页面加载完毕!";
						})
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};