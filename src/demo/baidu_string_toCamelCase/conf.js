var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.subByte'
    },
    
    demoType: [{key: 'default', val: 'baidu.string.subByte'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        dateInput: {
        	label: '输入字符：',
            type: 'text',
            defaultValue: 'background-position-x',
            size: 30
        },
        btn1: {
            type: 'button',
            defaultValue: '截取',
            depend: ['dateInput'],
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		T.g('resultArea').innerHTML = '转换后为：' + baidu.string.toCamelCase(arg0);
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['btn1']]
    }
};  