var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.unique'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.unique'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">数组为：[1, 2, 1, 3,"arr","arr","obj","obj"]</div>'
        },
        formatBtn: {
            type: 'button',
            defaultValue: '执行',
            depend: [],
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
                	var input = [1, 2, 1, 3,'arr','arr','obj','obj'];
					var output = T.array.unique(input);
					T.g("resultArea").innerHTML="结果为: " + output.join(',');
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};