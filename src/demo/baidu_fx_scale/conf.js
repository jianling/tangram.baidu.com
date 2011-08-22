var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'method',
        'method': 'baidu.fx.scale'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'scale示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '',
			html:' <div id="clown"><img src="images/fx1.jpg" id="doEl"></div><div id="log"></div>',
			jsCode:'function run(){ T.fx.scale(baidu.dom.g("doEl"),{from:0.01,to:1,onbeforestart:log,onafterfinish:log}) }function log(evt){evt=evt||{} ; baidu.dom.g("log").innerHTML += new Date().getTime()+" - 事件 "+evt.type+" 触发<br />" }'
        },
        disable: {
            type: 'button',
			isMain:true,
            defaultValue: '放大',
            event: {
                eventName: 'onclick',
                handler: function(){
					run()
				}
            }
        }
        
		
    },    
    groups: {
        'default': [
            ['disable']
        ]
    }
};