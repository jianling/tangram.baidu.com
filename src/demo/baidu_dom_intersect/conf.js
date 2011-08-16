var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.intersect'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.intersect'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">top和bottom是否交差</div><div class="demo"><div id="top1" class="top">top1</div><div id="bottom1" class="bottom">bottom1</div></div><div class="demo"><div id="top2" class="top">top2</div><div id="bottom2" class="bottom">bottom2</div></div><div class="demo"><div id="top3" class="top">top3</div><div id="bottom3" class="bottom">bottom3</div></div><div class="demo"><div id="top4" class="top">top4</div><div id="bottom4" class="bottom">bottom4</div></div>'
		},
        formatBtn0: {
			isMain: true,
            type: 'button',
            defaultValue: 'top1与bottom1',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML='top和bottom是否交差：'+baidu.dom.intersect('top1', 'bottom1')+"<br>";
                }
            }
        },
        formatBtn1: {
            type: 'button',
            defaultValue: 'top2与bottom2',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML='top和bottom是否交差：'+baidu.dom.intersect('top2', 'bottom2')+"<br>";
                }
            }
        },
        formatBtn2: {
            type: 'button',
            defaultValue: 'top3与bottom3',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML='top和bottom是否交差：'+baidu.dom.intersect('top3', 'bottom3')+"<br>";
                }
            }
        },
        formatBtn3: {
            type: 'button',
            defaultValue: 'top4与bottom4',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML='top和bottom是否交差：'+baidu.dom.intersect('top4', 'bottom4')+"<br>";
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0', 'formatBtn1', 'formatBtn2', 'formatBtn3']]
    }
};