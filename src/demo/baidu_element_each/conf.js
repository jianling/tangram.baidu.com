var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.element.each'
    },
    
    demoType: [{key: 'default', val: 'baidu.element.each'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"><span class="important">百度</span><span class="important">百度</span></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		T.e(T.dom.query('.important')).each(function(node){
            			T.e(node).addClass('red');
            		})
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  