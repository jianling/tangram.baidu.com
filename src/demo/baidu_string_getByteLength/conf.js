var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.getByteLength'
    },
    
    demoType: [{key: 'default', val: 'baidu.json.getByteLength'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        dateInput: {
        	label: '字符串：',
            type: 'text',
            defaultValue: '中文English',
            size: 30
        },
        btn1: {
            type: 'button',
            defaultValue: '计算长度',
            depend: ['dateInput'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		T.g('resultArea').innerHTML = '长度为：' + baidu.string.getByteLength(arg0);
            		T.g('resultArea').innerHTML += '<br />说明：中文字符算两个字节，英文字符、数字等基本的特殊字符算一个字节';
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['btn1']]
    }
};  