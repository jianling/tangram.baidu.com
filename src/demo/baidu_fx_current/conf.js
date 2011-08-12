var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'method',
        'method': 'baidu.fx.current',
		dependPackages:['baidu.fx.moveTo','baidu.fx.getTransition']
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'moveBy示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '',
			html:' <div id="clown"><img src="images/fx1.jpg" id="doEl"></div><input type="button" value="开始效果" onclick="run()" /><input type="button" value="取得效果实例" onclick="get()" /><div id="log"></div>',
			jsCode:'var m=false;function run(){ m=!m; var pos=m?[500,0]:[0,0];T.fx.moveTo(baidu.dom.g("doEl"),pos,{onbeforestart:log,onafterfinish:log,duration:5000}) }function log(evt){evt=evt||{} ; baidu.dom.g("log").innerHTML += new Date().getTime()+" - 事件 "+evt.type+" 触发<br />" ;if(evt.type=="onafterfinish"){ setTimeout(run,1) }}function get(){ var f = baidu.fx.current("doEl") ,fl=f.length ,fns=[];while(fl--){  fns.push(f[fl]["_className"]) } alert(fns) }'
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