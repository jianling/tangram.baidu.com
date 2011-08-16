var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.removeClass'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.removeClass'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea"></div><div id="single">测试元素</div>',
			jsCode: 'baidu.dom.g("resultTextarea").innerHTML="当前元素的class："+T.dom.getAttr("single", "class")+"<br>";'
		},
        formatBtn0: {
			isMain: true,
            type: 'button',
            defaultValue: '为测试元素添加类red和bold',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.addClass("single", "red bold");
					baidu.dom.g("resultTextarea").innerHTML="设置后元素的class："+baidu.dom.getAttr("single", "class")+"<br>";
                }
            }
        },
        formatBtn1: {
            type: 'button',
            defaultValue: '为测试元素删除类red和bold',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.removeClass("single", "red bold");
					baidu.dom.g("resultTextarea").innerHTML="设置后元素的class："+T.dom.getAttr("single", "class")+"<br>";
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0', 'formatBtn1']]
    }
};