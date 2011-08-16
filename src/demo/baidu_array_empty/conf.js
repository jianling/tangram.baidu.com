var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.empty'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.empty'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">结果为：百科,贴吧,身边,新知</div>'
        },
        param0: {
            type: 'text',
            defaultValue: "['百科','贴吧','身边','新知']",
            size: 20
        },
        formatBtn: {
            type: 'button',
            defaultValue: '清空',
            depend: ['param0'],
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(arg0){
                	var array = eval(arg0);
                	baidu.array.empty(array);
                    baidu.dom.g('resultArea').innerHTML = "结果为：" + array.join(',');
                }
            }
        }
    },
    
    groups: {
        'default': [['param0', 'formatBtn']]
    }
};