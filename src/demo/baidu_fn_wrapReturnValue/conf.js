var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.fn.wrapReturnValue'
    },
    
    demoType: [{key: 'default', val: 'baidu.fn.wrapReturnValue'}],
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
            		
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};