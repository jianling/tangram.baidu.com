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
            options: '{contentText: "这里输入需要显示的信息",left:"1%",top:-1,width:"98%"}',
			html:''
        },
        open: {
            type: 'button',
            defaultValue: 'open',
            event: {
                eventName: 'onclick',
                handler: function(){
					this.open();
				}
            }
        },
        close: {
            type: 'button',
            defaultValue: 'close',
            event: {
                eventName: 'onclick',
                handler: function(){
					this.close();
				}
            }
        }
        
    },    
    groups: {
        'default': [
            ['open','close']
        ]
    }
};