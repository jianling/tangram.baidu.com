var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.insertBefore'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.insertBefore'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea"><div id="existElement">基准元素</div><hr><div id="newElement1" class="newElement">目标元素1</div><div id="newElement2" class="newElement">目标元素2</div></div>'
		},
        formatBtn0: {
			isMain: true,
            type: 'button',
            defaultValue: 'insertBefore',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.insertBefore(baidu.dom.g('newElement1'), baidu.dom.g('existElement'));
                }
            }
        },
        formatBtn1: {
            type: 'button',
            defaultValue: 'insertAfter',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.insertAfter(baidu.dom.g('newElement2'), baidu.dom.g('existElement'));
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0', 'formatBtn1']]
    }
};