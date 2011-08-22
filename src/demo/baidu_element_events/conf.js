var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.element.events'
    },
    
    demoType: [{key: 'default', val: 'baidu.element.events'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"><span class="important">点击此处</span><span class="important">点击此处</span></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		T.e(T.dom.q('important')).on("click", function(){
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