var conf = {
    clazz: {
        type: 'class',
        'class': 'baidu.ui.ProgressBar'
    },
    
    demoType: [{key: 'default', val: 'ProgressBar核心实例'}],
    
    'default': {
        pageConf: {
            html: ' <div id="progressbarId" style="margin: 20px;"></div>',
            options: '{value: 30}',
            target: 'progressbarId'
        },
        
        getValue: {
            type: 'button',
            defaultValue: 'getValue()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert(this.getValue());
                }
            }
        },
        
        enable: {
            type: 'button',
            defaultValue: 'enable()',
            event: {
                eventName: 'onclick',
                handler: 'enable'
            }
        },
        
        disable: {
            type: 'button',
            defaultValue: 'disable()',
            event: {
                eventName: 'onclick',
                handler: 'disable'
            }
        },
        
        getBar: {
            type: 'button',
            defaultValue: 'getBar()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert(this.getBar());
                }
            }
        }
        
    },
    
    groups: {
        'default': [['getValue'], ['enable', 'disable'], ['getBar']]
    }
};