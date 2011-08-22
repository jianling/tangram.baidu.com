var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.addClass'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.addClass'}],
    'default': {
        pageConf: {
            html: '<div id="mydiv">为目标元素添加className</div>'
		},
        formatBtn0: {
			isMain: true,
            type: 'button',
            defaultValue: '添加样式',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.addClass('mydiv', "red big");
                }
            }
        },
        formatBtn1: {
            type: 'button',
            defaultValue: '恢复样式',
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.removeClass('mydiv', "red big");
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0', 'formatBtn1']]
    }
};