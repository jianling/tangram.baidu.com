var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.query'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.query'}],
    'default': {
        pageConf: {
            html: '<table id="demo"><tr><td><a href="http://tangram.baidu.com">tangram</a></td></tr><tr><td><input type="text" disabled="disabled" /></td></tr><tr><td><input type="text" /></td></tr><tr><td><a href="#">FE</a></td></tr><tr><td><p class="bold">测试元素1</p></td></tr><tr><td><p>测试元素2</p></td></tr></table>',
		},
        formatBtn0: {
			isMain: true,
            type: 'button',
            defaultValue: '查找a标签',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					    baidu.array.each(baidu.dom.query("*"), function(ele){
							baidu.dom.removeClass(ele,"focus");
						});
						baidu.array.each(baidu.dom.query('a'),function(i){
							baidu.dom.addClass(i,"focus");
						});
                }
            }
        },
        formatBtn1: {
            type: 'button',
            defaultValue: '查找class为bold的元素',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					    baidu.array.each(baidu.dom.query("*"), function(ele){
							baidu.dom.removeClass(ele,"focus");
						});
						baidu.array.each(baidu.dom.query('.bold'),function(i){
							baidu.dom.addClass(i,"focus");
						});
                }
            }
        },
        formatBtn2: {
            type: 'button',
            defaultValue: '查找disabled的input标签',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					    baidu.array.each(baidu.dom.query("*"), function(ele){
							baidu.dom.removeClass(ele,"focus");
						});
						baidu.array.each(baidu.dom.query('input:disabled'),function(i){
							baidu.dom.addClass(i,"focus");
						});
                }
            }
        },
        formatBtn3: {
            type: 'button',
            defaultValue: '查找href为特定url的a标签',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					    baidu.array.each(baidu.dom.query("*"), function(ele){
							baidu.dom.removeClass(ele,"focus");
						});
						baidu.array.each(baidu.dom.query('a[href="http://tangram.baidu.com"]'),function(i){
							baidu.dom.addClass(i,"focus");
						});
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0', 'formatBtn1', 'formatBtn2', 'formatBtn3']]
    }
};