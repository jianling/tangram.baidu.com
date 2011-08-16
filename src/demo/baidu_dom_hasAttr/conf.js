var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.hasAttr'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.hasAttr'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">查询一个元素是否包含指定的属性</div><input id="test" type="text" size="30" value="被测试的元素"><br><br>'
		},
        formatBtn0: {
			isMain: true,
            type: 'button',
            defaultValue: 'hasAttr(test,type)',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML='查询一个元素是否包含指定的属性：'+baidu.dom.hasAttr("test","type")+"<br>";
                }
            }
        },
        formatBtn1: {
            type: 'button',
            defaultValue: 'hasAttr(test,disabled)',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML='查询一个元素是否包含指定的属性：'+baidu.dom.hasAttr("test","disabled")+"<br>";
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0', 'formatBtn1']]
    }
};