var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.getStyle'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.getStyle'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">获取目标元素的指定样式</div><div id="test1" class="big red opacity">demo1</div><div id="test2" class="big display">demo2</div><div id="test3" class="big float">demo3</div><div id="test4" class="big textoverflow">demo4</div>'
		},
        formatBtn0: {
            type: 'button',
            defaultValue: '获取样式1',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML="获取demo1的样式：<br>"+"color："+T.getStyle("test1", "color")+"<br>";
					baidu.dom.g("resultTextarea").innerHTML+="font-size："+T.getStyle("test1", "font-size")+"<br>";
					baidu.dom.g("resultTextarea").innerHTML+="opacity："+T.getStyle("test1", "opacity")+"<br>";
				}
            }
        },
        formatBtn1: {
            type: 'button',
            defaultValue: '获取样式2',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML="获取demo2的样式：<br>"+"display："+baidu.dom.getStyle("test2", "display")+"<br>";
                }
            }
        },
        formatBtn2: {
            type: 'button',
            defaultValue: '获取样式3',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML="获取demo3的样式：<br>"+"float："+T.getStyle("test3", "float")+"<br>";
                }
            }
        },
        formatBtn3: {
            type: 'button',
            defaultValue: '获取样式4',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML="获取demo4的样式：<br>"+"width："+T.getStyle("test4", "width")+"<br>";
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0', 'formatBtn1', 'formatBtn2', 'formatBtn3']]
    }
};