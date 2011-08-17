var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.hasClass'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.hasClass'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">判断元素是否拥有指定的className</div><span id="test1">按钮1对应的测试元素</span><span class="red bold" id="test2">按钮2对应的测试元素</span>'
		},
        formatBtn0: {
			isMain: true,
            type: 'button',
            defaultValue: '是否有类别选择器red',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML='判断元素是否拥有指定的className：'+baidu.dom.hasClass(baidu.dom.g('test1'),'red')+"<br>";
                }
            }
        },
        formatBtn1: {
            type: 'button',
            defaultValue: '是否有类别选择器red和bold',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML='判断元素是否拥有指定的className：'+baidu.dom.hasClass(baidu.dom.g('test2'),'red bold')+"<br>";
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0', 'formatBtn1']]
    }
};