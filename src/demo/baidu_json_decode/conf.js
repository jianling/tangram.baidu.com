var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.json.decode'
    },
    
    demoType: [
    			{key: 'default', val: 'baidu.json.decode'}
    			],
    'default': {
        pageConf: {
            html: '<div id="resultArea">baidu.json.decode</div>'
        },
        dateInput: {
        	label: '字符串：',
            type: 'text',
            defaultValue: "{'a' : 1,'b' : [2, 3],'c' : '中文'}",
            size: 21
        },
    	btn1: {
            type: 'button',
            defaultValue: 'decode',
            depend: ['dateInput'],
            isMain: true,
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
        'default': [['dateInput'],['btn1']],
    }
};