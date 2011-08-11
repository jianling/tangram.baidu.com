var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.getModule'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.getModule'}],
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
        		    var options={
				        name:'aaa',
				        show:function(){
				            return "in show";
				    	}
				    };
					T.g("resultArea").innerHTML = "返回：" + baidu.lang.getModule('name', options);
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  