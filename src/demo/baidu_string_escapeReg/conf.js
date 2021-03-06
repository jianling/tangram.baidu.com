var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.escapeReg'
    },
    
    demoType: [{key: 'default', val: 'baidu.string.escapeReg'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">转义后返回：</div>'
        },
        dateInput: {
        	label: '输入字符串：',
            type: 'text',
            defaultValue: 'abc\\\\def/ghi*&^?jkl123',
            size: 21
        },
        btn1: {
            type: 'button',
            defaultValue: '转义字符',
            depend: ['dateInput'],
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		var input = document.createElement('input');
            		input.type = "text";
            		input.size = 30;
            		input.value = baidu.string.escapeReg(arg0);
            		T.g('resultArea').appendChild(input);
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['btn1']]
    }
};  