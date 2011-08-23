var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.decodeHTML'
    },
    
    demoType: [{key: 'default', val: 'baidu.string.decodeHTML'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">解码后返回：</div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '实体符号转义回HTML字符',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            	    var str = '&lt;span class=&quot;test&quot;&gt;test&lt;/span&gt;';
            		var input = document.createElement('input');
            		input.type = "text";
            		input.size = 30;
            		input.value = baidu.string.decodeHTML(str);
            		T.g('resultArea').appendChild(input);
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};