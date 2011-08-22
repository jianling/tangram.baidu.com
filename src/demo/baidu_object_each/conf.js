var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.object.each'
    },
    
    demoType: [{key: 'default', val: 'baidu.object.each'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">原始对象：{a : 1,b : 1,c : 2,d : 2}</div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		var data = {
			            a : 1,
			            b : 1,
			            c : 2,
			            d : 2
				    }
					T.g('resultArea').innerHTML ="";
				    T.object.each(data,function(item,key){T.g('resultArea').innerHTML += "键："+key+" - 值："+item+"<br>";});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  