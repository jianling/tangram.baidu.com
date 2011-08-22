var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.cookie.getRaw'
    },
    
    demoType: [
    			{key: 'default', val: 'baidu.cookie.getRaw'}
    			],
    'default': {
        pageConf: {
            html: '<div id="resultArea">Cookie测试<br /></div>'
        },
        param0: {
        	label: '键：',
            type: 'text',
            defaultValue: 'test',
            size: 20
        },
        param1: {
        	label: '值：',
            type: 'text',
            defaultValue: '这是一个Cookie测试值',
            size: 20
        },
    	btn2: {
            type: 'button',
            defaultValue: 'setRaw',
            depend: ['param0', 'param1'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0, arg1){
            		var key = arg0;
					var value = arg1;
					T.cookie.set(key, value);
					T.g('resultArea').innerHTML += '设置' + key + '的值为：' + value + '<br />';
            	}
            }
        },
    	btn4: {
			isMain: true,
            type: 'button',
            defaultValue: 'getRaw',
            depend: ['param0', 'param1'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0, arg1){
            		var key = arg0;
					var value = T.cookie.getRaw(key);
					T.g('resultArea').innerHTML += key + '的值为：' + value + '<br />';
            	}
            }
        },
    	btn5: {
            type: 'button',
            defaultValue: 'remove',
            depend: ['param0', 'param1'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0, arg1){
            		var key = arg0;
					T.cookie.remove(key);
					T.g('resultArea').innerHTML += key + '的值为：' + T.cookie.get(key) + '<br />';
            	}
            }
        }
    },
    
    groups: {
        'default': [['param0'], ['param1'], ['btn2', 'btn4'], ['btn5']]
    }
};