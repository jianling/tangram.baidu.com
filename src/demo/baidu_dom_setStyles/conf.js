var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.setStyles'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.setStyles'}],
    'default': {
        pageConf: {
            html: '<div class="contain" id="target"><div id="single" class="big">测试元素</div><div class="big">对比元素</div></div>',
		},
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '设置color与opacity样式',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
					baidu.dom.setStyles("single", {color:"blue", opacity:"0.2"});
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};