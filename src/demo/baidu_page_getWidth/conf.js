var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.page.getWidtht'
    },
    
    demoType: [{key: 'default', val: 'baidu.page.getWidtht'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '获取页面宽度',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
				    T.g('resultArea').innerHTML = '页面宽度为：' + baidu.page.getWidth();
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  