var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.page.getScrollLeft'
    },
    
    demoType: [{key: 'default', val: 'baidu.page.getScrollLeft'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击获取页面横向滚动量',
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		T.g('resultArea').innerHTML = "页面横向滚动量为：" + baidu.page.getScrollLeft();
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  