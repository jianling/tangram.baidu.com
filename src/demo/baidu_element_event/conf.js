var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.element.event'
    },
    
    demoType: [{key: 'default', val: 'baidu.element.event'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"><span class="important">点击此处</span><span class="important">点击此处</span></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		T.e(T.dom.query('.important')).on("click", function(){
            			alert('You click me');
            		});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  