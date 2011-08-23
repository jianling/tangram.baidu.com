var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.json.stringify'
    },
    
    demoType: [
    			{key: 'default', val: 'baidu.json.stringify'}
    			],
    'default': {
        pageConf: {
            html: '<div id="resultArea">baidu.json.stringify</div>'
        },
        dateInput: {
        	label: '字符串：',
            type: 'text',
            defaultValue: "{'a' : 1,'b' : [2, 3],'c' : '中文'}",
            size: 21
        },
    	btn4: {
			isMain: true,
            type: 'button',
            defaultValue: 'stringify',
            event: {
            	eventName: 'onclick',
            	handler: function(){
					 var data = {
							        a : 1,
							        b : [2, 3],
							        c : "中文"
								 }
					 T.g("resultArea").innerHTML = "序列化后为："+T.json.encode(data)+"<br>";
            	}
            }
        }
    },
    
    groups: {
        'default': [['dateInput'],['btn4']]
    }
};