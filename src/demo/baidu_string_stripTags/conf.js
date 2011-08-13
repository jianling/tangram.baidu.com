var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.stripTags'
    },
    
    demoType: [{key: 'default', val: 'baidu.string.stripTags'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        dateInput: {
        	label: 'HTML字符串：',
            type: 'text',
            defaultValue: '<span>字符</span>',
            size: 30
        },
        btn1: {
            type: 'button',
            defaultValue: '去除HTML标签',
            depend: ['dateInput'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		T.g('resultArea').innerHTML = '去除HTML标签后：' + baidu.string.stripTags(arg0);
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['btn1']]
    }
};  