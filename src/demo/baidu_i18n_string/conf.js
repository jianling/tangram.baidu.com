var conf = {
    clazz: {
        type: 'method',
        method: 'baidu.i18n.string',
        dependPackages: ['baidu.i18n.cultures.en-US', 'baidu.i18n.cultures.zh-CN']
    },
    
    demoType: [{key: 'default', val: 'number核心实例'}],
    
    'default': {
        pageConf: {
            html: '<div style="margin: 20px;">描述将一个地区的字符串格式化为另一个地区的字符串</div>'
        },
        trimTxt: {
            type: 'text',
            defaultValue: ' hello world ',
            size: 5,
            maxlength: 10
        },
        
        trimLocale: {
            type: 'text',
            defaultValue: 'zh-CN',
            size: 5,
            maxlength: 10
        },
        
        trim: {
            type: 'button',
            defaultValue: 'trim(str, locale)',
            isMain: true,
            depend: ['trimTxt', 'trimLocale'],
            event: {
                eventName: 'onclick',
                handler: function(a, b){
                    alert('[' + baidu.i18n.string.trim(a, b) + ']');
                }
            }
        },
        
        translationTxt: {
            type: 'text',
            defaultValue: 'ok',
            size: 5,
            maxlength: 10
        },
        
        translationLocale: {
            type: 'text',
            defaultValue: 'zh-CN',
            size: 5,
            maxlength: 10
        },
        
        translation: {
            type: 'button',
            defaultValue: 'translation(str, locale)',
            isMain: true,
            depend: ['translationTxt', 'translationLocale'],
            event: {
                eventName: 'onclick',
                handler: function(a, b){
                    alert(baidu.i18n.string.translation(a, b));
                }
            }
        }
        
        
    },
    
    groups: {
        'default': [['trimTxt', 'trimLocale', 'trim'], ['translationTxt', 'translationLocale', 'translation']]
    }
};