var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.getParent'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.getParent'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">获得#first的父节点</div><div id="holder" style="background:red;border:1px #000 solid">#holder<div id="first" style="background:yellow;border:1px #FFF solid;margin:10px">#first</div></div>'
		},
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '运行',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML='获得元素的父节点：'+baidu.dom.getParent("first").id+"<br/>";
				}
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};