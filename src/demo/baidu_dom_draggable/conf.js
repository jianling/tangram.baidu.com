var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.drag'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.drag'}],
    'default': {
        pageConf: {
            html: '<div id="dragRegion"><div id="drag" class="roundCorner"><div id="title" class="roundCorner">我已支持拖曳，并且设置了范围</div></div></div>'
		},
        formatBtn0: {
			isMain: true,
            type: 'button',
            defaultValue: '创建',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.draggable("drag", {range: [2,398,398,2], handler: T.g("title")});
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0']]
    }
};