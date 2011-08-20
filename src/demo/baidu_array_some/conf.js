var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.some'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.some'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">数组为：["中文","sss",2,4,5]，条件为：isNaN(item)</div>'
        },
        formatBtn: {
            type: 'button',
            defaultValue: '执行',
            depend: [],
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
                	var input = ["中文","sss",2,4,5];
					var output = T.array.some(input,function(item,index){
					    return isNaN(item);
					});
					T.g("resultArea").innerHTML="结果为: " + output;
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};