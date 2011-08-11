var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.escapeReg'
    },
    
    demoType: [{key: 'default', val: 'baidu.json.escapeReg'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">转义后返回：</div>',
            jsCode: 'T.g("dateInput").value = "abc\\\\def/ghi*&^?jkl123"'
        },
        dateInput: {
        	label: '输入字符串：',
            type: 'text',
            defaultValue: '',
            size: 30
        },
        btn1: {
            type: 'button',
            defaultValue: '转义字符',
            depend: ['dateInput'],
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