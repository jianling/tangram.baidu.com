var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Slider',
        dependPackages: ['baidu.ui.behavior.decorator', 'baidu.ui.Slider.Slider$progressBar']
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Slider核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
			html:'<div id="sliderId" style="padding: 50px;"></div>',
			target: 'sliderId'
        },
        
        getValue: {
            type: 'button',
            defaultValue: 'getValue()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert(this.getValue());
                }
            }
        },
        
        enable: {
            type: 'button',
            defaultValue: 'enable',
            event: {
                eventName: 'onclick',
                handler: function(){
                    this.enable();
                }
            }
        },
        
        disable: {
            type: 'button',
            defaultValue: 'disable',
            event: {
                eventName: 'onclick',
                handler: function(){
                    this.disable();
				}
            }
        }
        
    },    
    groups: {
        'default': [['getValue'], ['enable', 'disable']]
    }
};