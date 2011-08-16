var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.getAncestorByClass'
    },
    
    demoType: [{key: 'default', val: 'getAncestorByClass'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">获取dom4最近的指定类为red的祖先元素</div><div id="dom1" class="level1 border">dom1<div id="dom2" class="level2  border red">dom2<div id="dom3" class="level3  border">dom3<div id="dom4" class="level4  border">dom4</div></div></div></div>'
		},
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '获取',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					var ancestorId = baidu.dom.getAncestorByClass("dom4", "red").id;
					baidu.dom.g("resultTextarea").innerHTML='获取dom4最近的指定类为red的祖先元素：'+ancestorId+"<br>";
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};