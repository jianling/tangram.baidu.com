var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.fn.methodize'
    },
    
    demoType: [{key: 'default', val: 'baidu.fn.methodize'}],
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
            		var arr=[1,2,3,4,5];
					function f(){}
					var newf=T.fn.multize(f);
					var output=newf(arr).length;
					T.g('resultArea').innerHTML = "返回："+output+"<br>";
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};