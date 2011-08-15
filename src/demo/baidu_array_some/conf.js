var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.some'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.some'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">结果为：</div>'
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
					T.g("resultArea").innerHTML="output: " + output;
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};