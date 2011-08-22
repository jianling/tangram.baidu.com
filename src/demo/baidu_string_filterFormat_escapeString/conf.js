var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.filterFormat.escapeString'
    },
    
    demoType: [{key: 'default', val: 'filterFormat.escapeString'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">字符串转义</div>'
        },
        dateInput: {
        	label: '输入字符串：',
            type: 'text',
            defaultValue: '(\'\//\')',
            size: 21
        },
        btn1: {
            type: 'button',
            defaultValue: '转义',
            depend: ['dateInput'],
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		T.g('resultArea').innerHTML = '转义后为：' + baidu.string.filterFormat.escapeString(arg0);
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['btn1']]
    }
};  