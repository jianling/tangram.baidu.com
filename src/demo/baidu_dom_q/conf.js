var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.q'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.q'}],
    'default': {
        pageConf: {
            html: '<div id="test"><span class="red">测试元素</span><span class="blue">测试元素</span><span class="black">测试元素</span></div>',
		},
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '获取class为blue的元素',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					var ele = baidu.dom.q("blue");
					baidu.object.each(ele, function(item,i){baidu.dom.addClass(item, "bold");});
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};