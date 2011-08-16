var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.event.on'
    },
    
    demoType: [{key: 'default', val: 'baidu.event.on'}],
    'default': {
        pageConf: {
            html: '<div id="button"><button id="mybutton">按钮</button></div><div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
					T.g("resultArea").innerHTML = '<p>给按钮添加点击事件...</p>'
            		T.event.on('mybutton', "click", function(e){
					   T.g("resultArea").innerHTML += "你点击了按钮：" + baidu.event.getTarget(e) + ".<br>";
					});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};