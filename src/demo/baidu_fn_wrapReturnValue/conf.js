var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.fn.wrapReturnValue'
    },
    
    demoType: [{key: 'default', val: 'baidu.fn.wrapReturnValue'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        param0: {
        	label: 'index值为(请输入-1、0或者-1)：',
            type: 'text',
            defaultValue: '0',
            size: 20
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            depend: ['param0'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		var index = arg0;
        			T.g('resultArea').innerHTML = '<p>被包装的函数fn为function(){return document.body;};</p>'
            		if(index < 0){
            			T.g('resultArea').innerHTML += '<p>index值小于0，直接返回被包装函数的返回值</p>'
            		}else if(index == 0){
            			T.g('resultArea').innerHTML += '<p>index值等于0，返回被包装函数返回值的包装结果</p>'
            		}else if(index > 0){
            			T.g('resultArea').innerHTML += '<p>index值大于0，返回第' + arg0 + '个位置参数的包装结果</p>'
            		}
            		var fn = function(){
            			return document.body;
            		};
            		var returnValue = baidu.fn.wrapReturnValue(fn, baidu.element.Element, parseInt(arg0));
            		T.g('resultArea').innerHTML += returnValue(T.g('resultArea'));
            	}
            }
        }
    },
    groups: {
        'default': [['param0', 'btn1']]
    }
};