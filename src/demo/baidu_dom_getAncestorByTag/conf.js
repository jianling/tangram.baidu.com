var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.getAncestorByTag'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.getAncestorByTag'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">获取dom4最近的标签为span的祖先元素</div><div id="dom1" class="level1 border">dom1<div id="dom2" class="level2 border">dom2<span id="dom3" class="level3 border">dom3<span id="dom4" class="level4 border">dom4</span></span></div></div>'
		},
        formatBtn: {
            type: 'button',
            defaultValue: '获取dom4最近的标签为span的祖先元素',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					var ancestorId = T.dom.getAncestorByTag("dom4", "span").id;
					baidu.dom.g("resultTextarea").innerHTML='获取dom4最近的标签为span的祖先元素：'+ancestorId+"<br>";
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};