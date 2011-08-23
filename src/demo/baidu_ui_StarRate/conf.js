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
            options: '{total:10,current:5}',
			target:'starId',
			html:'<div style="margin:20px"> <div id="starId"></div> </div>'
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
		
		disable: {
            type: 'button',
            defaultValue: '停用 disable()',
            event: {
                eventName: 'onclick',
                handler: 'disable'
            }
        },
		enable: {
            type: 'button',
            defaultValue: '启用 enable()',
            event: {
                eventName: 'onclick',
                handler:'enable'
            }
        },
		num:{type:'text',size:5,defaultValue:'2',label:'星星数'},
		hoverAt:{
            type: 'button',
            defaultValue: '悬停指定 hoverAt()',
            event: {
                eventName: 'onclick',
                handler:function(){
					this.hoverAt(num.value-0)
				}
            }
		},
		clickAt:{
            type: 'button',
            defaultValue: '点击指定 clickAt()',
            event: {
                eventName: 'onclick',
                handler:function(){
					this.clickAt(num.value-0)
				}
            }
		},
		starAt:{
            type: 'button',
            defaultValue: '指定高亮 starAt()',
            event: {
                eventName: 'onclick',
                handler:function(){
					this.starAt(num.value-0)
				}
            }
		},
		dispose: {
            type: 'button',
            defaultValue: '销毁dispose()',
            event: {
                eventName: 'onclick',
                handler: 'dispose'
            }
        }
		
    },

	
    
    groups: {
        'default': [
            ['disable','enable'],
            ['num','hoverAt','clickAt','starAt'],
			['dispose']
        ]
    }
};