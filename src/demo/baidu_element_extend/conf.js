var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.element.extend'
    },
    
    demoType: [{key: 'default', val: 'baidu.element.extend'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"><span class="important">测试元素</span></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		T.element.extend({
				        "myFunction" : function(ele){
				            T.g("resultArea").innerHTML = "This is the function defined by user.<br>";
				        }
				    });
				    T.e(T.dom.query(".important")).myFunction();
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  