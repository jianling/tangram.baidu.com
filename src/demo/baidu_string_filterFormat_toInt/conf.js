var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.filterFormat.toInt'
    },
    
    demoType: [{key: 'default', val: 'filterFormat.toInt'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">数字转换</div>'
        },
        dateInput: {
        	label: '输入数字：',
            type: 'text',
            defaultValue: '5992.2',
            size: 21
        },
        btn1: {
            type: 'button',
            defaultValue: '转换',
            depend: ['dateInput'],
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		T.g('resultArea').innerHTML = '转换后为：' + baidu.string.filterFormat.toInt(arg0);
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['btn1']]
    }
};  