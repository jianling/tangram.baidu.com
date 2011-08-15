var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.json'
    },
    
    demoType: [
    			{key: 'default', val: 'baidu.json'},
    			{key: 'decode', val: 'baidu.json.decode'},
    			{key: 'encode', val: 'baidu.json.encode'},
    			{key: 'parse', val: 'baidu.json.parse'},
    			{key: 'stringify', val: 'baidu.json.stringify'}
    			],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        dateInput: {
        	label: '输入字符串：',
            type: 'text',
            defaultValue: "{'a' : 1,'b' : [2, 3],'c' : '中文'}",
            size: 30
        }
    },
    'decode': {
    	pageConf: {
            html: '<div id="resultArea"></div>'
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
    'encode': {
    	pageConf: {
            html: '<div id="resultArea"></div>'
        },
    	btn2: {
            type: 'button',
            defaultValue: 'encode',
            event: {
            	eventName: 'onclick',
            	handler: function(){
					 var data = {
							        a : 1,
							        b : [2, 3],
							        c : "中文"
								 }
					 T.g("resultArea").innerHTML += "序列化后为："+T.json.encode(data)+"<br>";
            	}
            }
        }
    },
    'parse': {
    	pageConf: {
            html: '<div id="resultArea"></div>'
        },
    	btn3: {
            type: 'button',
            defaultValue: 'decode',
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
    'stringify': {
    	pageConf: {
            html: '<div id="resultArea"></div>'
        },
    	btn4: {
            type: 'button',
            defaultValue: 'decode',
            event: {
            	eventName: 'onclick',
            	handler: function(){
					 var data = {
							        a : 1,
							        b : [2, 3],
							        c : "中文"
								 }
					 T.g("resultArea").innerHTML += "序列化后为："+T.json.encode(data)+"<br>";
            	}
            }
        }
    },
    
    groups: {
        'default': [['dateInput']],
        'decode': [['btn1']],
        'encode': [['btn2']],
        'parse': [['btn3']],
        'stringify': [['btn4']]
    }
};