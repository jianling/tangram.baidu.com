var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.contains'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.contains'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">是否包含在container中？</div><div id="container" class="contain">container<div id="contained" class="contain">contained </div></div><div id="outer">outer</div>'
		},
        formatBtn0: {
			isMain: true,
            type: 'button',
            defaultValue: 'contained',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML = '是否包含在container中：' + baidu.dom.contains("container", "contained");
                }
            }
        },
        formatBtn1: {
            type: 'button',
            defaultValue: 'outer',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					baidu.dom.g("resultTextarea").innerHTML = '是否包含在container中：' + baidu.dom.contains("container", "outer");
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0', 'formatBtn1']]
    }
};