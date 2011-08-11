var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Combox'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Combox核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{width: 168, data: [ {content: "复制", icon: "-176px -128px", title: "复制当前单元格"},{content: "复制11", icon: "-176px -96px"},{content: "复制12", icon: "-192px -96px"},{content: "复制13", icon: "-208px -96px"},{content: "复制14", icon: "-224px -96px"},{content: "复制15", icon: "-240px -96px"} ], element: "comboxContent", autoRender: true}',
			target:'',
			html:'<div id="comboxContent"></div>'
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