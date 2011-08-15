var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.getAttr'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.getAttr'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">获取目标元素的value属性</div><input id="test" type="text" size="30" value="被测试的元素" >'
		},
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '获取目标元素的value属性',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML='获取目标元素的value属性：'+baidu.dom.getAttr("test", "value")+"<br>";
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};