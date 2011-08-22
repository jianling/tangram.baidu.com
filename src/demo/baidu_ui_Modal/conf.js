var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Modal',
		dependPackages:['baidu.ui.Modal.*']
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Modal核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{container:\'modalCon\'}',
			target:'',
			html:'<div id="modalCon" style="width:400px;height:240px;border:5px solid #ddd;background:#0F0;margin:50px;">一个容器#modalCon</div><div id="modalCon2" style="width:200px;height:100px;border:5px solid #ddd;background:#F00;margin:0 50px;display:none">另一个容器#modalCon2</div> '
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
		
		show: {
            type: 'button',
            defaultValue: '显示 show()',
            event: {
                eventName: 'onclick',
                handler: 'show'
            }
        },
		hide: {
            type: 'button',
            defaultValue: '隐藏 hide()',
            event: {
                eventName: 'onclick',
                handler: 'hide'
            }
        },
		getWindowHandle: {
            type: 'button',
            defaultValue: 'getWindowHandle()',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert( this.getWindowHandle	)
				}
            }
        },
		getContainer: {
            type: 'button',
            defaultValue: 'getContainer()',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert( this.getContainer().id	)
				}
            }
        },
		
		
		newKey:{
			type: 'select',
				defaultValue: '',
				data: {
					val: ['渲染容器', '样式'],
					key: ['width', 'height']
				}
		},
		newVal:{
			type:'text',size:20
		},
		newBtn:{
			type:'button',
			defaultValue: '更新',
			depend:  ['newKey','newVal'],
			event: {
				eventName: 'onclick',
				handler: function(k,v){
					var opt={};opt[k]=v;
					try{
						var s = eval('s = '+v);
						if(typeof s=='function' || typeof s=='boolean' || typeof s=='object'){opt[k]=s};
					}catch(e){}
					if( newKey.value=='initDate' ){
						opt[k]=new Date(v);
					}
					this.update(opt)
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
            ['show','hide'],
			['getContainer','getWindowHandle'],
            //['newKey','newVal','newBtn'],
			['dispose']
        ]
    }
};