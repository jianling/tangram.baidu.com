var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.module'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.module'}],
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
        		    (function(){
				        var pubs = {
				            test:function(){return "test"}
				        }
				        T.lang.module("im.webim.api", pubs);
				    })();
					 T.g("resultArea").innerHTML="返回："+im.webim.api.test()+"<br>"
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  