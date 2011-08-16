var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.setStyle'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.setStyle'}],
    'default': {
        pageConf: {
            html: '<div class="contain" id="target"><div id="single" class="big red">测试元素</div><span class="big">对比元素</span></div>',
		},
        formatBtn0: {
			isMain: true,
            type: 'button',
            defaultValue: '设置color样式',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
					baidu.dom.setStyle("single", "color", "blue");
                }
            }
        },
        formatBtn1: {
            type: 'button',
            defaultValue: '设置text-overflow样式',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
					baidu.dom.setStyle("single", "text-overflow", "ellipsis");
					baidu.dom.setStyle("single", "width", "120px");
					baidu.dom.setStyle("single", "height", "45px");
					baidu.dom.setStyle("single", "overflow", "hidden");
					baidu.dom.setStyle("single", " white-space", "nowrap");
                }
            }
        },
        formatBtn2: {
            type: 'button',
            defaultValue: '设置opacity样式',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
					baidu.dom.setStyle("single", "opacity", "0.6");
                }
            }
        },
        formatBtn3: {
            type: 'button',
            defaultValue: '设置display样式',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
					baidu.dom.setStyle("single", "display", "inline");
                }
            }
        },
        formatBtn4: {
            type: 'button',
            defaultValue: '设置float样式',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
					baidu.dom.setStyle("single", "float", "right");
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0', 'formatBtn1', 'formatBtn2', 'formatBtn3', 'formatBtn4']]
    }
};