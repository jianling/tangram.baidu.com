var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.data.storage'
    },
    
    demoType: [{key: 'default', val: 'storage核心例子'}],
    
    'default': {
        pageConf: {
            html: '<div id="container" style="padding: 50px;"></div>'
        },
        
        getKey: {
            type: 'text',
            defaultValue: 'pepsi',
            size: 5,
            maxlength: 50
        },
        
        get: {
            type: 'button',
            defaultValue: 'get(key, handler)',
			isMain:true,
            depend: ['getKey'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    baidu.data.storage.get(c, function(status, val){
                        var container = baidu.dom.g('container');
                        container.innerHTML = '取出键值为' + c + '对应在storage中存的值为' + val;
                    });
                }
            }
        },
        
        setKey: {
            type: 'text',
            defaultValue: 'pepsi',
            size: 5,
            maxlength: 50
        },
        
        setVal: {
            type: 'text',
            defaultValue: 'my value',
            size: 5,
            maxlength: 50
        },
        
        set: {
            type: 'button',
            defaultValue: 'set(key, val, handler)',
            depend: ['setKey', 'setVal'],
            event: {
                eventName: 'onclick',
                handler: function(a, b){
                    baidu.data.storage.set(a, b, function(status, val){
                        var container = baidu.dom.g('container');
                        container.innerHTML = '设置键值为' + a + '对应存储在storage中存的值为' + b;
                    });
                }
            }
        },
        
        removeKey: {
            type: 'text',
            defaultValue: 'pepsi',
            size: 5,
            maxlength: 50
        },
        
        remove: {
            type: 'button',
            defaultValue: 'remove(key, hanlder)',
            depend: ['removeKey'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    baidu.data.storage.remove(c, function(status, val){
                        var container = baidu.dom.g('container');
                        container.innerHTML = '移除键值为' + c + '对应存储在storage中存的值为' + val;
                    });
                }
            }
        }
    },
    
    groups: {
        'default': [['getKey', 'get'], ['setKey', 'setVal', 'set'], ['removeKey', 'remove']]
    }
}