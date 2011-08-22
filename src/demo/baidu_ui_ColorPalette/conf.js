var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.ColorPalette',
		dependPackages:['baidu.ui.Button','baidu.ui.Button.*','baidu.ui.Modal']

    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'ColorPalette核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{element: "testdiv", autoRender: true} ',
			target:'',
			html:'<div style="margin:50px;position:relative;width:400px;height:240px;border:5px #DDD solid;background:#FFF" id="testdiv">  </div> '
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
		
		getColor: {
            type: 'button',
            defaultValue: '取得颜色 getColor()',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert(this.getColor());
				}
            }
        },
		
		getHue: {
            type: 'button',
            defaultValue: '色相饱和度明度',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert('色相:'+this.hue+',饱和度:'+this.saturation+',明度:'+this.brightness);
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
            ['getColor','getHue'],
			['dispose']
        ]
    }
};