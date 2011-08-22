var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.json.parse'
    },
    
    demoType: [
    			{key: 'default', val: 'baidu.json.parse'}
    			],
    'default': {
        pageConf: {
            html: '<div id="resultArea">baidu.json.parse</div>'
        },
        dateInput: {
        	label: '字符串：',
            type: 'text',
            defaultValue: "{'a' : 1,'b' : [2, 3],'c' : '中文'}",
            size: 21
        },
    	btn3: {
			isMain: true,
            type: 'button',
            defaultValue: 'parse',
            depend: ['dateInput'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
					 var jsonString = arg0;
					 var parseString = T.json.parse(jsonString);
					 T.g("resultArea").innerHTML+="parseString.a返回："+parseString.a+"<br>";
					 T.g("resultArea").innerHTML+="parseString.b返回："+parseString.b+"<br>";
					 T.g("resultArea").innerHTML+="parseString.c返回："+parseString.c+"<br>";
            	}
            }
        }
    },
    
    groups: {
        'default': [['dateInput'],['btn3']]
    }
};