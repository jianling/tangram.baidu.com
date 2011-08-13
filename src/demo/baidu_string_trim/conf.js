var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.trim'
    },
    
    demoType: [{key: 'default', val: 'baidu.string.trim'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        dateInput: {
        	label: '输入字符：',
            type: 'text',
            defaultValue: '  前后各两个空白字符  ',
            size: 30
        },
        btn1: {
            type: 'button',
            defaultValue: '截取',
            depend: ['dateInput'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		T.g('resultArea').innerHTML = 'trim后为：' + baidu.string.trim(arg0);
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['btn1']]
    }
};  