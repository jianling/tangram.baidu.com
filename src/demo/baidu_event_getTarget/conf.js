var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.event.getTarget'
    },
    
    demoType: [{key: 'default', val: 'baidu.event.getTarget'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
					T.g("resultArea").innerHTML = '<p>请在页面上任意处点击</p>'
            		T.event.on(document.body, "click", function(e){
					   T.g("resultArea").innerHTML += "事件的触发元素为：" + baidu.event.getTarget(e) + ".<br>";
					});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};