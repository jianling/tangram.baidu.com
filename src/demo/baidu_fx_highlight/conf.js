var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'method',
        'method': 'baidu.fx.highlight'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'highlight示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '',
			html:' <div id="clown">test</div><input type="button" value="运行" onclick="run()" /><div id="log"></div>',
			jsCode:'function run(){ T.fx.highlight(baidu.dom.g("clown"), {beginColor:"#FFF",endColor:"#FF0",duration:1000,onbeforestart:log,onafterfinish:log}) }function log(evt){  baidu.dom.g("log").innerHTML += new Date().getTime()+" - 事件 "+evt.type+" 触发<br />" }'
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