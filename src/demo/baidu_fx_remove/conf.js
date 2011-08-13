var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'method',
        'method': 'baidu.fx.remove'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'remove示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '',
			html:' <div id="clown"><img src="images/fx1.jpg" id="doEl"></div><input type="button" value="运行" onclick="run()" /><div id="log"></div>',
			jsCode:'function run(){ T.fx.remove(baidu.dom.g("doEl"),{onbeforestart:log,onafterfinish:log}) }function log(evt){evt=evt||{} ; baidu.dom.g("log").innerHTML += new Date().getTime()+" - 事件 "+evt.type+" 触发<br />" }'
        },
        disable: {
            type: 'button',
            defaultValue: 'disable',
            event: {
                eventName: 'onclick',
                handler: function(){
				}
            }
        }
        
		
    },    
    groups: {
        'default': [
            //['disable']
        ]
    }
};