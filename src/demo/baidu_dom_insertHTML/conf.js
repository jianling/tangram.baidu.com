var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.insertHTML'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.insertHTML'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">在目标元素的指定位置插入HTML代码</div><div id="test"><div id="target"><h4>&lt;div id="target"&gt;目标元素&lt;/div&gt;</h4></div></div>'
		},
        param0: {
            type: 'text',
			label: '要插入的html：',
            defaultValue: '<span>this is span!</span>',
            size: 21,
            maxlength: 80
        },
        formatBtn0: {
			isMain: true,
            type: 'button',
            defaultValue: '插入到beforeBegin',
            depend: ['param0'],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.insertHTML("target", "beforeBegin", "<span>this is span!</span>");
					baidu.dom.g("resultTextarea").innerHTML="T.insertHTML('target', 'beforeBegin', '&lt;span&gt;this is span!&lt;/span&gt;');"+"<br>";
                }
            }
        },
        formatBtn1: {
            type: 'button',
            defaultValue: '插入到afterBegin',
            depend: ['param0'],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.insertHTML("target", "afterBegin", "<span>this is span!</span>");
					baidu.dom.g("resultTextarea").innerHTML="T.insertHTML('target', 'afterBegin', '&lt;span&gt;this is span!&lt;/span&gt;');"+"<br>";
                }
            }
        },
        formatBtn2: {
			isMain: true,
            type: 'button',
            defaultValue: '插入到beforeEnd',
            depend: ['param0'],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.insertHTML("target", "beforeEnd", "<span>this is span!</span>");
					baidu.dom.g("resultTextarea").innerHTML="T.insertHTML('target', 'beforeEnd', '&lt;span&gt;this is span!&lt;/span&gt;');"+"<br>";
                }
            }
        },
        formatBtn3: {
            type: 'button',
            defaultValue: '插入到afterEnd',
            depend: ['param0'],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.insertHTML("target", "afterEnd", "<span>this is span!</span>");
					baidu.dom.g("resultTextarea").innerHTML="T.insertHTML('target', 'afterEnd', '&lt;span&gt;this is span!&lt;/span&gt;');"+"<br>";
                }
            }
        }
    },
    
    groups: {
        'default': [['param0'], ['formatBtn0', 'formatBtn1', 'formatBtn2', 'formatBtn3']]
    }
};