var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.date.format'
    },
    
    demoType: [{key: 'default', val: 'baidu.date.format'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        dateInput: {
            label: '输入时间：',
            type: 'text',
            defaultValue: 'Tue Aug 09 2011 16:53:05 GMT+0800',
            size: 20
        },
        format: {
            label: '时间格式：',
            type: 'text',
            defaultValue: 'yyyy年MM月dd日 HH时mm分ss秒',
            size: 20
        },
        btn1: {
            type: 'button',
            defaultValue: 'format',
            depend: ['dateInput', 'format'],
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(arg0,arg1){
                    T.g('resultArea').innerHTML = T.date.format(new Date(arg0), arg1);
                }
            }
        },
        btn2: {
            type: 'button',
            defaultValue: '获取当前时间',
            event: {
                eventName: 'onclick',
                handler: function(){
                    T.g('dateInput').value = new Date();
                }
            }
        }
    },
    
    groups: {
        'default': [['dateInput'],['format'],['btn1', 'btn2']]
    }
};