var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.object.values'
    },
    
    demoType: [{key: 'default', val: 'baidu.object.values'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">对象{name : "tom",age : 23}</div>'
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
            		T.g('resultArea').innerHTML += '值集合为：' + baidu.object.values(obj);
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  