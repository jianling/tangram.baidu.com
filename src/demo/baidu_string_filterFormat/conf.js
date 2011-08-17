var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.filterFormat'
    },
    
    demoType: [{key: 'default', val: 'baidu.string.filterFormat'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>',
            jsCode: 'T.g("dateInput1").value = "#{0|toInt}-#{1|toInt}-#{2|toInt}"'
        },
        dateInput1: {
        	label: '自定义格式：',
            type: 'text',
            defaultValue: '',
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
            		T.g('resultArea').innerHTML = '格式化后返回：' + baidu.string.filterFormat(arg0, value);
            		T.g('resultArea').innerHTML += '<br /><br /><br /><ul><li>自定义格式#{0}中的数字"0"表示数据源(数组)中的第0个元素</li>' +
												    '<li>如果数据源是一个json而不是array的话可以用#{key}这样的格式获取数据</li>' +
												    '例如(斜体部分为实际代码)<br />' +
												    '模式: my name is #{name}<br />' +
												   	'数据: {name:\'tom\'}<br />' +
												    '<li>自定义格式#{0|toInt}中的"toInt"则是用toInt方法格式化了这个数据</li>' +
												    '<li>支持的方法有：</li>' +
												    'escapeJs: 转换为16进制<br />' +
												    'escapeString: 转换HTML标签等特殊符号为实体符<br />' +
												    'toInt:  转换为数值:1a=1,1a1=1,a1=0,a=0';
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput1'], ['dateInput2'], ['btn1']]
    }
};  