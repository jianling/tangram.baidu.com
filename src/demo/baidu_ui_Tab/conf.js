var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Tab'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Tab核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{items: [ { head: "label1", body: "<p>欢迎使用Tangram!</p>" }, { head: "label2", body: "<p>这是Tangram的Tab控件!</p>" }, { head: "label3", body: "<p>谢谢使用!</p>" } ], switchType: "click" }',
			target:'target',
			html:'<div id="target"></div>'
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