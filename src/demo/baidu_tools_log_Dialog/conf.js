var conf = {
    clazz: {
        type: 'class',
        'class': 'baidu.tools.log.Dialog'
    },
    
    demoType: [{key: 'default', val: 'log.Dialog核心程序'}],
    
    'default': {
        pageConf: {
            html: '',
            jsCode: ''
        },
        
        openBtn: {
            type: 'button',
            defaultValue: 'open()',
            event: {
                eventName: 'onclick',
                handler: 'open'
            }
        },
        
        closeBtn: {
            type: 'button',
            defaultValue: 'close()',
            event: {
                eventName: 'onclick',
                handler: 'close'
            }
        },
        
        pushTxt: {
            type: 'text',
            defaultValue: 'hello world',
            size: 5,
            maxlength: 50
        },
        
        pushBtn: {
            type: 'button',
            defaultValue: 'push(txt)',
            depend: ['pushTxt'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    this.push([{type: 'info', data: c}]);
                }
            }
        },
        
        clearTxt: {
            type: 'select',
            defaultValue: 'all',
            data: {
                key: ['all', 'log', 'info', 'warn', 'error'],
                val: ['all', 'log', 'info', 'warn', 'error']
            }
        },
        
        clearBtn: {
            type: 'button',
            defaultValue: 'clear(type)',
            depend: ['clearTxt'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    this.clear(c);
                }
            }
        }
        
    },
    
    groups: {
        'default': [['openBtn', 'closeBtn'], ['pushTxt', 'pushBtn'], ['clearTxt', 'clearBtn']]
    }
};