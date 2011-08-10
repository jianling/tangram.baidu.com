var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.every'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.every'}],
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
                	var input = ["中文","sss"];
					var output = baidu.array.every(input,function(item,index){
					    return isNaN(item);
					});
                    baidu.dom.g('resultArea').innerHTML = "结果为：" + output;
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};