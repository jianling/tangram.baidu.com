var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.remove'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.remove'}],
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
                	var array = ["one", "two", "three", "four"];
					T.g("resultArea").innerHTML="array: " + array+"<br>";
					T.array.remove(array, "three");
					T.g("resultArea").innerHTML+="After remove...<br/>";
					T.g("resultArea").innerHTML+="array: " + array;
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};