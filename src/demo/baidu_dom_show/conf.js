var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.show'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.show'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">显示/隐藏演示</div><div id="single">&lt;div id="single"&gt;显示、隐藏该区域&lt;/div&gt;</div>'
		},
        formatBtn0: {
            type: 'button',
            defaultValue: '隐藏',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.hide('single');
					baidu.dom.g("resultTextarea").innerHTML="显示/隐藏演示："+"baidu.dom.hide('single')"+"<br>";
				}
            }
        },
		formatBtn1: {
			isMain: true,
            type: 'button',
            defaultValue: '显示',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.show('single');
					baidu.dom.g("resultTextarea").innerHTML="显示/隐藏演示："+"baidu.dom.show('single')"+"<br>";
				}
            }
        },
		formatBtn2: {
            type: 'button',
            defaultValue: '改变显示/隐藏状态',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.toggle('single');
					baidu.dom.g("resultTextarea").innerHTML="显示/隐藏演示："+"baidu.dom.toggle('single')"+"<br>";
				}
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0', 'formatBtn1', 'formatBtn2']]
    }
};