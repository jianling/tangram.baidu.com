var conf = {
    clazz: {
        type: 'method',
        method: 'baidu.i18n.number',
        dependPackages: ['baidu.i18n.cultures.en-US', 'baidu.i18n.cultures.zh-CN']
    },
    
    demoType: [{key: 'default', val: 'number核心实例'}],
    
    'default': {
        pageConf: {
            html: '<div style="margin: 20px;">描述将一个地区的数字格式化为另一个地区的数字</div>'
        },
        number: {
            type: 'text',
            defaultValue: '100000',
            size: 5,
            maxlength: 10
        },
        
        sLocale: {
            type: 'text',
            defaultValue: 'en-US',
            size: 5,
            maxlength: 10
        },
        
        tLocale: {
            type: 'text',
            defaultValue: 'zh-CN',
            size: 5,
            maxlength: 10
        },
        
        format: {
            type: 'button',
            defaultValue: 'format(n, s, t)',
            isMain: true,
            depend: ['number', 'sLocale', 'tLocale'],
            event: {
                eventName: 'onclick',
                handler: function(a, b, c){
                    alert( baidu.i18n.number.format(a, b, c) );
                }
            }
        }
    },
    groups: {
        'default': [['number', 'sLocale', 'tLocale', 'format']]
    }
};