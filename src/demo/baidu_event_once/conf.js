var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.event.once'
    },
    
    demoType: [{key: 'default', val: 'baidu.event.once'}],
    'default': {
        pageConf: {
            html: '<p id="button"><button id="mybutton">按钮</button></p><div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
					T.g("resultArea").innerHTML = '<p>给按钮添加了一次性点击事件...</p>'
            		T.event.once('mybutton', "click", function(e){
					   T.g("resultArea").innerHTML += "你点击了按钮：" + baidu.event.getTarget(e) + ".再点一次看看~！<br>";
					});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};