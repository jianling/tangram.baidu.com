var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Tooltip'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Tooltip核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{type: "click",  content: "<div style=\'width:300px;height:100px\'>显示的信息，信息内容可以自己设定，可以是文字也可以是html代码。</div>" }',
			target:'toolTip',
			html:' <a id="toolTip" href="javascript:void(0)">点此弹出消息框</a> '
        },
        disable: {
            type: 'button',
            defaultValue: 'disable',
            event: {
                eventName: 'onclick',
                handler: function(){
					this.open(baidu.dom.g('toolTip'))
					console.log(this)
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