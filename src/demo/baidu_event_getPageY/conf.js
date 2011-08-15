var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.event.getPageY'
    },
    
    demoType: [{key: 'default', val: 'baidu.event.getPageY'}],
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
					   T.g("resultArea").innerHTML += "点击处坐标为：(" + baidu.event.getPageX(e) +  "," + baidu.event.getPageY(e) + ").<br>";
					});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};