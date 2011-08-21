var conf = {
    clazz: {
        type: 'method',
        method: 'baidu.i18n.date',
        dependPackages: ['baidu.i18n.cultures', 'baidu.i18n.cultures.zh-CN', 'baidu.i18n.cultures.en-US', 'baidu.date.format', 'baidu.date.parse']
    },
    
    demoType: [{key: 'default', val: 'date核心实例'}],
    
    'default': {
        pageConf: {
            html: '<div style="margin:20px">日期转换</div>'
        },
        
        year: {
            type: 'text',
            defaultValue: new Date().getFullYear(),
            size: 4,
            maxlength: 4
        },
        
        month: {
            type: 'text',
            defaultValue: new Date().getMonth(),
            size: 2,
            maxlength: 2
        },
        
        getDaysInMonth: {
            type: 'button',
            defaultValue: 'getDaysInMonth(y, m)',
            depend: ['year', 'month'],
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(year, month){
                    alert(baidu.i18n.date.getDaysInMonth(parseInt(year, 10), parseInt(month, 10)));
                }
            }
        },
        
        
        leapYear: {
            type: 'text',
            defaultValue: new Date().getFullYear(),
            size: 4,
            maxlength: 4
        },
        
        isLeapYear: {
            type: 'button',
            defaultValue: 'isLeapYear(year)',
            depend: ['leapYear'],
            event: {
                eventName: 'onclick',
                handler: function(year){
                    alert(baidu.i18n.date.isLeapYear(parseInt(year, 10)));
                }
            }
        },
        
        date: {
            type: 'text',
            defaultValue: baidu.date.format(new Date(), 'yyyy-MM-dd'),
            size: 10,
            maxlength: 10
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
        
        toLocaleDate: {
            type: 'button',
            defaultValue: 'toLocaleDate',
            depend: ['date', 'sLocaleTxt', 'tLocaleTxt'],
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(a, b, c){
                    var date = baidu.date.parse(a);
                    alert(baidu.i18n.date.toLocaleDate(date, b, c));
                }
            }
        }
    },
    
    groups: {
        'default': [['year', 'month', 'getDaysInMonth'], ['leapYear', 'isLeapYear'], ['date', 'sLocaleTxt', 'tLocaleTxt', 'toLocaleDate']]
    }
};