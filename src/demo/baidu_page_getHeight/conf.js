var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.page.getHeight'
    },
    
    demoType: [{key: 'default', val: 'baidu.page.getHeight'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '获取页面高度',
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
				    T.g('resultArea').innerHTML = '页面高度为：' + baidu.page.getHeight();
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  