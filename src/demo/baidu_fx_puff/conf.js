var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'method',
        'method': 'baidu.fx.puff'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'puff示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '',
			html:' <div id="clown"><img src="images/fx1.jpg" id="doEl"></div><div id="log"></div>',
			jsCode:'function run(){ T.fx.puff(baidu.dom.g("doEl"), {to:2,onbeforestart:log,onafterfinish:log}) }function log(evt){  baidu.dom.g("log").innerHTML += new Date().getTime()+" - 事件 "+evt.type+" 触发<br />" }'
        },
        run: {
            type: 'button',
            defaultValue: '运行',
            event: {
                eventName: 'onclick',
                handler: function(){
					run();
				}
            }
        }
        
		
    },    
    groups: {
        'default': [
            ['run']
        ]
    }
};