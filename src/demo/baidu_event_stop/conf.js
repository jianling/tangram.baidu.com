var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.event.stop'
    },
    
    demoType: [{key: 'default', val: 'baidu.event.stop'}],
    'default': {
        pageConf: {
            html: '<div id="outer_box"><a id="mylink" href="http://www.baidu.com" target="_blank">百度一下，你就知道...</a></div><p><button id="mybutton">点击阻止链接的默认事件并阻止事件冒泡</button></p><div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
					baidu.event.on("outer_box", "click", function(e){
						T.g('resultArea').innerHTML += "点击了盒子<br />";
					});
					baidu.event.on("mybutton", "click", function(e){
						baidu.event.on("mylink", "click", function(e){
							baidu.event.stop(e);
						});
					});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};