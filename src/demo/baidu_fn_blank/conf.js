var conf = {
    clazz: {
        type: 'method',
        method: 'baidu.fn.blank'
    },
    
    demoType: [{key: 'default', val: 'baidu.fn.blank'}],
    
    'default': {
        pageConf: {
            html: '<div style="margin:20px">baidu.fn.blank返回一个空函数</div>'
        },
        
        blank: {
            type: 'button',
            defaultValue: 'blank',
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert(baidu.fn.blank);
                }
            }
        }
    },
    
    groups: {
        'default': [['blank']]
    }
}