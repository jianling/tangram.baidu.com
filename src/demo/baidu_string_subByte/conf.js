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
        	label: '字符串：',
            type: 'text',
            defaultValue: '0中文English',
            size: 11
        },
        dateInput1: {
        	label: '截取长度：',
            type: 'text',
            defaultValue: '4',
            size: 5
        },
        btn1: {
            type: 'button',
            defaultValue: '截取',
            depend: ['dateInput', 'dateInput1'],
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(arg0, arg1){
            		T.g('resultArea').innerHTML = '截取后为：' + baidu.string.subByte(arg0, arg1);
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['dateInput1'], ['btn1']]
    }
};  