var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Popup'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Popup核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{contentText: "这里输入需要显示的信息" }',
			target:'pop',
			html:'<input id="pop" type="button" value="点我" />'
        },
        disable: {
            type: 'button',
            defaultValue: 'disable',
            event: {
                eventName: 'onclick',
                handler: function(){
					this.open();
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