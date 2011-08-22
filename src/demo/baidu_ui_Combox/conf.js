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
			html:'<div id="comboxContent" style="padding:20px;"></div>'
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
		dispose: {
			type: 'button',
			defaultValue: '销毁dispose()',
			event: {
				eventName: 'onclick',
				handler: 'dispose'
			}
		},
		getArrow: {
			type: 'button',
			defaultValue: 'getArrow()',
			event: {
				eventName: 'onclick',
				handler: function(){
					alert(this.getArrow().id);
				}
			}
		},
		getInput: {
			type: 'button',
			defaultValue: 'getInput()',
			event: {
				eventName: 'onclick',
				handler: function(){
					alert(this.getInput().id);
				}
			}
		},
		getInputVal: {
			type: 'button',
			defaultValue: '获取input元素的值',
			event: {
				eventName: 'onclick',
				handler: function(){
					alert(this.getInput().value);
				}
			}
		},
		setValueIpt: {
			type: 'text',
			defaultValue: 'input的新值'
		},
		setValueBtn: {
			type: 'button',
			defaultValue: '设置',
			event: {
				eventName: 'onclick',
				handler: function(){
					this.setValue(setValueIpt.value);
				}
			}
		}
		
    }, 
    groups: {
        'default': [
            ['getArrow','getInput'],
            ['setValueIpt','setValueBtn','getInputVal'],
            ['dispose']
        ]
    }
};