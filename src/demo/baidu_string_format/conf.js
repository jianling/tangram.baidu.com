var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.format'
    },
    
    demoType: [{key: 'default', val: 'baidu.string.format'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        dateInput1: {
        	label: '自定义格式：',
            type: 'text',
            defaultValue: '#{0}-#{1}-#{2}',
            size: 21
        },
        dateInput2: {
        	label: '数据源(可以为字符、数组、对象)：',
            type: 'text',
            defaultValue: "['2011年','5月','1日']",
            size: 21
        },
        btn1: {
            type: 'button',
            defaultValue: '格式化',
            depend: ['dateInput1','dateInput2'],
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(arg0, arg1){
            		var value = eval('(' + arg1 + ')')
            		T.g('resultArea').innerHTML = '格式化后返回：' + baidu.string.format(arg0, value);
            		T.g('resultArea').innerHTML += '<br /><br /><br /><ul><li>自定义格式#{0}中的数字"0"表示数据源(数组)中的第0个元素</li>' + 
												   '<li>如果数据源是一个json而不是array的话可以用#{key}这样的格式获取数据</li>' + 
												   '例如(斜体部分为实际代码)<br />' + 
												   '模式: my name is #{name}<br />' + 
												   '数据: {name:\'tom\'}';
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput1'], ['dateInput2'], ['btn1']]
    }
};  