var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.formatColor'
    },
    
    demoType: [{key: 'default', val: 'baidu.string.formatColor'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        dateInput: {
        	label: '颜色：',
            type: 'text',
            defaultValue: 'red',
            size: 30
        },
        btn1: {
            type: 'button',
            defaultValue: '格式化',
            depend: ['dateInput'],
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		T.g('resultArea').innerHTML = '转换为#RRGGBB的格式后的字符：' + baidu.string.formatColor(arg0);
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['btn1']]
    }
};  