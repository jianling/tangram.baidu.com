var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.toArray'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.toArray'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		var arr = baidu.lang.toArray("string");
					T.g("resultArea").innerHTML = "转换后数组长度为" + arr.length + "，数组第一项为：" + arr[0];
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  