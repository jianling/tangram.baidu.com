var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.url.jsonToQuery'
    },
    
    demoType: [{key: 'default', val: 'baidu.url.jsonToQuery'}],
    'default': {
        pageConf: {
            html: '<div id="mydiv">JSON对象与query字符串互相转换</div>'
        },
        param0: {
            type: 'text',
            defaultValue: '{name: \'Tom Smith\', age: 20}',
            size: 60,
            maxlength: 80
        },
        formatBtn: {
            type: 'button',
            defaultValue: 'JSON到Query',
            depend: ['param0'],
            event: {
                eventName: 'onclick',
                handler: function(arg0){
					var oJson = eval("("+arg0+")");
                    baidu.dom.g('mydiv').innerHTML = '转换后的Query字符串：' + baidu.url.jsonToQuery(oJson);
                }
            }
        }
    },
    
    groups: {
        'default': [['param0', 'formatBtn']]
    }
};