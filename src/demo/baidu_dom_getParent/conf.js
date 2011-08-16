var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.getParent'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.getParent'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">获得元素的父节点</div><div id="holder"><div id="first" class="child">first</div></div>'
		},
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '获得元素的父节点',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML='获得元素的父节点：'+baidu.dom.getParent("first").id+"<br/>";
				}
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};