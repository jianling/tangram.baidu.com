var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.unique'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.unique'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">结果为：</div>'
        },
        formatBtn: {
            type: 'button',
            defaultValue: '执行',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
                	var input = [1, 2, 1, 3];
					var output = T.array.unique(input);
					T.g("resultArea").innerHTML="input: " + input+"<br>";
					T.g("resultArea").innerHTML+="output: " + output;
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};