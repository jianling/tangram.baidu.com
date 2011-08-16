var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.page.getmousePosition'
    },
    
    demoType: [{key: 'default', val: 'getMousePosition'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>',
            jsCode: 'baidu.event.on(document, "click", function(){T.g("resultArea").innerHTML = "x:" + baidu.page.getMousePosition().x + ",y:" + baidu.page.getMousePosition().y})'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击页面获取鼠标坐标',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  