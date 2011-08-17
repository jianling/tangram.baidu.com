var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.decodeHTML'
    },
    
    demoType: [{key: 'default', val: 'baidu.string.decodeHTML'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">解码后返回：</div>',
            jsCode: 'T.g("dateInput").value = "&lt;span class=&quot;test&quot;&gt;test&lt;/span&gt;"'
        },
        dateInput: {
        	label: '输入实体字符：',
            type: 'text',
            defaultValue: '',
            size: 21
        },
        btn1: {
            type: 'button',
            defaultValue: '实体符号转义回HTML字符',
            depend: ['dateInput'],
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		var input = document.createElement('input');
            		input.type = "text";
            		input.size = 30;
            		input.value = baidu.string.decodeHTML(arg0);
            		T.g('resultArea').appendChild(input);
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['btn1']]
    }
};