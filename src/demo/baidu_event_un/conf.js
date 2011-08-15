var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.event.un'
    },
    
    demoType: [{key: 'default', val: 'baidu.event.un'}],
    'default': {
        pageConf: {
            html: '<div id="buttonArea"></div><div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
					T.g('buttonArea').innerHTML = '<p><button id="button1">点击为按钮添加事件</button></p>' +
													'<p><button id="button2">click me!</button></p>' +
													'<p><button id="button3">点击为按钮解除事件</button></p>';
					baidu.on("button1", "click", function(){
						baidu.on("button2", "click", handler = function(){
							T.g('resultArea').innerHTML += "您点击了按钮<br />";
						});
						T.g('resultArea').innerHTML += "给按钮添加事件...<br />";
					});
					baidu.on("button3", "click", function(){
						baidu.un("button2", "click", handler);
						T.g('resultArea').innerHTML += "给按钮解除事件...<br />";
					});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};