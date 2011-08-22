var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Input'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Input核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{text: \'输入信息\', disabled:false,onfocus:function(evt){ if(evt.target.getBody().value==\'输入信息\'){evt.target.getBody().value=\'\'} },onblur: function(evt){ if(!evt.target.getBody().value){evt.target.getBody().value = \'输入信息\'}; }}',
			target:'inputContent',
			html:'<div id="inputContent" style="margin:50px;"></div>'
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
			defaultValue: '禁用disable()',
			event: {
				eventName: 'onclick',
				handler: 'disable'
			}
		},
		enable: {
			type: 'button',
			defaultValue: '启用enable()',
			event: {
				eventName: 'onclick',
				handler: 'enable'
			}
		},
		dispose: {
			type: 'button',
			defaultValue: '销毁dispose()',
			event: {
				eventName: 'onclick',
				handler: 'dispose'
			}
		},
		isDisabled: {
			type: 'button',
			defaultValue: '是否禁用 isDisabled()',
			event: {
				eventName: 'onclick',
				handler: function(){
					var s = this.isDisabled();
					alert( s );
				}
			}
		},
		getText: {
			type: 'button',
			defaultValue: '获得input文字 getText()',
			event: {
				eventName: 'onclick',
				handler: function(){
					alert( this.getText() );
				}
			}
		}
    },
    
    groups: {
        'default': [
            ['console'],
            ['enable','disable','isDisabled','getText'],
			['dispose']
        ]
    }
};