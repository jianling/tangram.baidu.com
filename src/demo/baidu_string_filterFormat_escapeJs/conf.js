var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.filterFormat.escapeJs'
    },
    
    demoType: [{key: 'default', val: 'filterFormat.escapeJs'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">js编码转义</div>'
        },
        dateInput: {
        	label: '输入js编码：',
            type: 'text',
            defaultValue: 'var a = 10;',
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
            		T.g('resultArea').innerHTML = '转义后为：' + baidu.string.filterFormat.escapeJs(arg0);
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['btn1']]
    }
};  