var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Login',
		dependPackages:['baidu.ui.Dialog.Dialog$closeButton','baidu.ui.Dialog.Dialog$coverable','baidu.ui.Dialog.Dialog$draggable','baidu.ui.Dialog.Dialog$iframe','baidu.ui.Dialog.Dialog$keyboard','baidu.ui.Dialog.Dialog$modal','baidu.ui.Dialog.Dialog$resizable','baidu.ui.Login.*']
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Login核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{"titleText":"登录窗口"}'
        },
        //	控制台输出调试项
        console: {
            type: 'button',
            defaultValue: 'console.log',
            event: {
                eventName: 'onclick',
                handler: function(){if(console && console.log){console.log(window.t=this)}}
            }
        },
        open: {
            type: 'button',
            defaultValue: '显示open()',
            event: {
                eventName: 'onclick',
                handler: 'open'
            }
        }
		
        
    },
    
    groups: {
        'default': [
            ['console'],
            ['open']
        ]
    }
};