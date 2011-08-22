var conf = {
    clazz: {
        type: 'method',
        method: 'baidu.i18n.currency',
        dependPackages: ['baidu.i18n.cultures', 'baidu.i18n.cultures.zh-CN', 'baidu.i18n.cultures.en-US']
    },
    
    demoType: [{key: 'default', val: 'currency核心实例'}],
    
    'default': {
        pageConf: {
            html: '<div style="margin:20px">描述将一个美元的货币格式转换成中文的货币格式</div>'
        },
        
        numberTxt: {
            type: 'text',
            defaultValue: '20$',
            size: 2,
            maxlength: 50
        },
        
        sLocaleTxt: {
            type: 'text',
            defaultValue: 'en-US',
            size: 2,
            maxlength: 50
        },
        
        tLocaleTxt: {
            type: 'text',
            defaultValue: 'zh-CN',
            size: 2,
            maxlength: 50
        },
        
        formatBtn: {
            type: 'button',
            defaultValue: 'format(n, s, t)',
            depend: ['numberTxt', 'sLocaleTxt', 'tLocaleTxt'],
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(a, b, c){
                    alert(baidu.i18n.currency.format(a, b, c));
                }
            }
        }
    },
    
    groups: {
        'default': [['numberTxt', 'sLocaleTxt', 'tLocaleTxt', 'formatBtn']]
    }
};