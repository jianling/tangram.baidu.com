var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.event.fire'
    },
    
    demoType: [{key: 'default', val: 'baidu.event.fire'}],
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
					T.g('buttonArea').innerHTML = '<p><button id="button1">点击为按钮注册事件</button></p>' +
													'<p><button id="button2">click me!</button></p>' +
													'<p><button id="button3">点击触发注册在按钮上的事件</button></p>';
					baidu.on("button1", "click", function(){
						baidu.on("button2", "click", function(){
							T.g('resultArea').innerHTML += "按钮上的事件被触发<br />";
						});
						T.g('resultArea').innerHTML += "给按钮注册事件...<br />";
					});
					baidu.on("button3", "click", function(){
						baidu.event.fire("button2", "click");
					});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};