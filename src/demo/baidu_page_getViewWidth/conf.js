var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.page.getViewWidth'
    },
    
    demoType: [{key: 'default', val: 'baidu.page.getViewWidth'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击获取页面可视区域宽度',
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		T.g('resultArea').innerHTML = "页面可视区域宽度为：" + baidu.page.getViewWidth();
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  