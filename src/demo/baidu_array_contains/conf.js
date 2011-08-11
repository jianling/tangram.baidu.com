var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.contains'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.contains'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">结果为：</div>'
        },
        param0: {
            type: 'text',
            defaultValue: "['百度','淘宝','盛大','腾讯']",
            size: 20
        },
        param1: {
            type: 'text',
            defaultValue: "百度",
            size: 10
        },
        formatBtn: {
            type: 'button',
            defaultValue: '求值',
            depend: ['param0', 'param1'],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
                	var array = eval(arg0),
                		item = arg1;
                    baidu.dom.g('resultArea').innerHTML = "结果为：" + baidu.array.contains(array, arg1);
                }
            }
        }
    },
    
    groups: {
        'default': [['param0', 'param1', 'formatBtn']]
    }
};