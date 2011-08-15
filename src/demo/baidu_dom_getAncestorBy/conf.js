var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.getAncestorBy'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.getAncestorBy'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">获取dom4最近的font-weight为bold的祖先元素</div><div id="dom1" class="level1 border">dom1<div id="dom2" class="level2 border">dom2<div id="dom3" class="level3 border">dom3<div id="dom4" class="level4 border">dom4</div></div></div></div>'
		},
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '获取dom4最近的font-weight为bold的祖先元素',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					var ancestor = baidu.dom.getAncestorBy("dom4", function(ele){
						return "700" == baidu.dom.getStyle(ele, "fontWeight") || "bold" == T.getStyle(ele, "fontWeight");
					});
					baidu.dom.g("resultTextarea").innerHTML='获取dom4最近的font-weight为bold的祖先元素：'+baidu.dom.getAttr(ancestor, "id")+"<br>";
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};