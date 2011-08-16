var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.toggleClass'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.toggleClass'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">转换元素的class</div><div id="single">测试元素</div>'
		},
        formatBtn0: {
			isMain: true,
            type: 'button',
            defaultValue: '转换class',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.toggleClass("single", "red bold");
					baidu.dom.g("resultTextarea").innerHTML="转换后元素的class："+baidu.dom.getAttr("single", "class")+"<br>";
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0']]
    }
};