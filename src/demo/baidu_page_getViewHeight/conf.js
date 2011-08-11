var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.page.getViewHeight'
    },
    
    demoType: [{key: 'default', val: 'baidu.page.getViewheight'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击获取页面可视区域高度',
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		T.g('resultArea').innerHTML = "页面可视区域高度为：" + baidu.page.getViewHeight();
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  