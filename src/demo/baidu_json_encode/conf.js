var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.json.encode'
    },
    
    demoType: [
    			{key: 'default', val: 'baidu.json.encode'}
    			],
    'default': {
        pageConf: {
            html: '<div id="resultArea">baidu.json.encode</div>'
        },
        dateInput: {
        	label: '字符串：',
            type: 'text',
            defaultValue: "{'a' : 1,'b' : [2, 3],'c' : '中文'}",
            size: 21
        },
    	btn2: {
            isMain: true,
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
    
    groups: {
        'default': [['dateInput'],['btn2']]
    }
};