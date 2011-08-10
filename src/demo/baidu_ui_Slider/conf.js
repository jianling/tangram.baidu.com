var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Slider'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Slider核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{ skin: "tangram-decorator",decorator: [{ type: "box", tpl: { box: "<div #{class}></div><div #{class} id=\'#{innerWrapId}\'></div><div#{class}></div>" } } ]}',
			target:'sliderId',
			html:'<div id="sliderId"></div>'
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