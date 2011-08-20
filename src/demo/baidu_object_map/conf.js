var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.object.map'
    },
    
    demoType: [{key: 'default', val: 'baidu.object.map'}],
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
            		var obj = {
            			name : 'tom',
            			age : 23
            		};
            		baidu.object.each(obj, function(item, key){
	            		T.g('resultArea').innerHTML += key + ":" + item + '<br />';
            		})
            		var newObj = baidu.object.map(obj, function(item, key){
            			return key + 'is' + item;
            		});
	            		T.g('resultArea').innerHTML += '应用方法（key + "is" + item）转换后...<br />';
            		baidu.object.each(newObj, function(item, key){
	            		T.g('resultArea').innerHTML += key + ":" + item + '<br />';
            		})
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  