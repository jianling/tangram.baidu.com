var conf = {
    clazz: {
        type: 'field',
        'field': 'baidu.dom.children'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.children'}],
    'default': {
        pageConf: {
            html: '<div id="mydiv">baidu.dom.children</div><div id="holder">&lt;div id="holder"&gt;<div class="child">first</div><div class="child">prev</div><div class="child">single</div><div class="child">next</div><div class="child">last</div>&lt;/div&gt;</div><div id="out">out</div>'
		},
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '添加样式',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					var children = baidu.dom.children('holder');
					baidu.object.each(children, function(ele){
							ele.style.color="red";
						}
					);
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};