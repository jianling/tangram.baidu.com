var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.StarRate'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'StarRate核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{}',
			target:'starId',
			html:'<div id="starId"></div>'
        },
        disable: {
            type: 'button',
            defaultValue: 'disable',
            event: {
                eventName: 'onclick',
                handler: function(){
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