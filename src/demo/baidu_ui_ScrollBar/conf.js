var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.ScrollBar'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'ScrollBar核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{skin: "scrollbar-a"}',
			target:'scrollbarCon',
			html:'<div id="scrollbarCon" style="width:15px; height:200px;padding:10px;"></div>'
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