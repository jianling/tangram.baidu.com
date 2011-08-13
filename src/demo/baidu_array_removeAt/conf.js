var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.removeAt'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.removeAt'}],
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
                	var input = ["one", "two", "three", "four"];
					var output = T.array.removeAt(input, 1);
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