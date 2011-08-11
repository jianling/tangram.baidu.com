var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.cookie'
    },
    
    demoType: [
    			{key: 'default', val: 'baidu.cookie'},
    			{key: 'set', val: 'baidu.cookie.set'},
    			{key: 'setRaw', val: 'baidu.cookie.setRaw'},
    			{key: 'get', val: 'baidu.cookie.get'},
    			{key: 'getRaw', val: 'baidu.cookie.getRaw'},
    			{key: 'remove', val: 'baidu.cookie.remove'}
    			],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
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
        }
    },
    set: {
    	pageConf: {
    		html: '<div id="resultArea"></div>'
        },
    	btn1: {
            type: 'button',
            defaultValue: 'set',
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
        }
    },
    setRaw: {
    	pageConf: {
    		html: '<div id="resultArea"></div>'
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
        }
    },
    get: {
    	pageConf: {
    		html: '<div id="resultArea"></div>'
        },
    	btn3: {
            type: 'button',
            defaultValue: 'get',
            depend: ['param0', 'param1'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0, arg1){
            		var key = arg0;
					var value = T.cookie.get(key);
					T.g('resultArea').innerHTML += key + '的值为：' + value + '<br />';
            	}
            }
        }
    },
    getRaw: {
    	pageConf: {
    		html: '<div id="resultArea"></div>'
        },
    	btn4: {
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
        }
    },
    remove: {
    	pageConf: {
    		html: '<div id="resultArea"></div>'
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
        'default': [['param0'], ['param1']],
        'set': [['btn1']],
        'setRaw': [['btn2']],
        'get': [['btn3']],
        'getRaw': [['btn4']],
        'remove': [['btn5']]
    }
};