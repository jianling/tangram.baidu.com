var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.page.getScrollTop'
    },
    
    demoType: [{key: 'default', val: 'baidu.page.getScrollTop'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击获取页面纵向滚动量',
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		T.g('resultArea').innerHTML = "页面纵向滚动量为：" + baidu.page.getScrollTop();
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  