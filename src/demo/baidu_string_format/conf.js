var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.format'
    },
    
    demoType: [{key: 'default', val: 'baidu.string.format'}],
    'default': {
        pageConf: {
            html: '<div id="mydiv">#{content_1}何时了，</br>往事知#{content_2}；</div>'
        },
        param0: {
            type: 'text',
            defaultValue: '春花秋月',
            size: 10,
            maxlength: 10
        },
        param1: {
            type: 'text',
            defaultValue: '多少',
            size: 10,
            maxlength: 10
        },
        formatBtn: {
            type: 'button',
            defaultValue: '格式化',
            depend: ['param0', 'param1'],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
                    var tpl = '#{content_1}何时了，<br/>往事知#{content_2}；';
                    baidu.dom.g('mydiv').innerHTML = baidu.string.format(tpl, {
                        content_1: arg0,
                        content_2: arg1
                    });
                }
            }
        }
    },
    
    groups: {
        'default': [['param0', 'param1', 'formatBtn']]
    }
};