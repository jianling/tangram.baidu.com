var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.getPosition'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.getPosition'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">获取目标元素相对于整个文档左上角的位置</div><div id="test">目标元素</div>'
		},
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '定位',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML="获取目标元素相对于整个文档左上角的位置："+baidu.json.stringify(baidu.dom.getPosition("test"))+"<br>";
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};