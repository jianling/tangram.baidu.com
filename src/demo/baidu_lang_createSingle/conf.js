var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.createSingle'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.createSingle'}],
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
					    var myclass=T.lang.createSingle(options);
					    T.g('resultArea').innerHTML = myclass.name + '<br />';
					    T.g('resultArea').innerHTML += myclass.show() + '<br />';
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  