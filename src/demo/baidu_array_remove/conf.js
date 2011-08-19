var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.remove'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.remove'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">数组为：["one", "two", "three", "four"]，remove元素为"three"</div>'
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
					T.array.remove(array, "three");
					baidu.dom.g('resultArea').innerHTML = "结果为：" + array.join(',');
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};