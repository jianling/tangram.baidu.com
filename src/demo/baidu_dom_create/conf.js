var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.create'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.create'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea"></div>'
		},
        formatBtn0: {
            type: 'button',
            defaultValue: '创建',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					var ele = baidu.dom.create("input", {type: "text", value: "createdElement"});
					baidu.dom.g("resultTextarea").innerHTML="创建元素：" + ele+"<br>";
					baidu.dom.insertAfter(ele, "resultTextarea");
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0']]
    }
};