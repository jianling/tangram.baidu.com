var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.encodeHTML'
    },
    
    demoType: [{key: 'default', val: 'baidu.string.encodeHTML'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">编码后返回：</div>'
        },
        dateInput: {
        	label: '输入HTML字符：',
            type: 'text',
            defaultValue: '<div class=\'notest\'>notest</div>',
            size: 21
        },
        btn1: {
            type: 'button',
            defaultValue: '将HTML字符转义为实体符',
            depend: ['dateInput'],
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		var input = document.createElement('input');
            		input.type = "text";
            		input.size = 30;
            		input.value = baidu.string.encodeHTML(arg0);
            		T.g('resultArea').appendChild(input);
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['btn1']]
    }
};