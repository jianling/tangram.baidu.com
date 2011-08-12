var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.fn.bind'
    },
    
    demoType: [{key: 'default', val: 'baidu.fn.bind'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		function handler (argument){
						return this.value + argument;
					}
					var _this = {value : 1},
					    arg = 2;
					var newHandler = T.fn.bind(handler, _this, arg);
					T.g('resultArea').innerHTML = "返回："+newHandler()+"<br>";
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};