var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.event.stopPropagation'
    },
    
    demoType: [{key: 'default', val: 'baidu.event.stopPropagation'}],
    'default': {
        pageConf: {
            html: '<div id="outer_box"><a id="mylink" href="http://www.baidu.com" target="_blank">百度一下，你就知道...</a></div><div id="resultArea"></div>'
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
					baidu.event.on("mylink", "click", function(e){
						baidu.event.stopPropagation(e);
						T.g('resultArea').innerHTML += "您点击了链接，事件冒泡已被阻止<br />";
					});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};