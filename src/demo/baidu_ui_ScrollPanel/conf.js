var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.ScrollPanel'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'ScrollPanel核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{container: "scrollPanel", element: "scrollPanel"}',
			target:'scrollPanel',
			html:'<div style="padding:50px"><div id="scrollPanel" style="width:120px; height:200px; overflow:hidden;background:#FFF;"> scrollPanel         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         </div> <hr /><div id="scrollPanelB" style="width:120px; height:200px; overflow:hidden;background:#FFF;"> scrollPanelB       ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         </div></div>'
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
            defaultValue: '显示 setVisible(true)',
            event: {
                eventName: 'onclick',
                handler: function(){
					this.setVisible(true);
				}
            }
        },
		close: {
            type: 'button',
            defaultValue: '隐藏 setVisible(true)',
            event: {
                eventName: 'onclick',
                handler: function(){
					this.setVisible(false);
				}
            }
        },
		getContainer:{
            type: 'button',
            defaultValue: '传入的container对象 getContainer().id',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert(this.getContainer().id )
				}
            }
		},
		getPanel:{
            type: 'button',
            defaultValue: 'panel的dom节点 getPanel().id',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert( this.getPanel().id )
				}
            }
		},
		getScrollBar:{
            type: 'button',
            defaultValue: 'x轴滚动条对象 getScrollBar(\'x\').mainId',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert( this.getScrollBar('x').mainId )
				}
            }
		},
		getTarget:{
            type: 'button',
            defaultValue: '传入的目标元素对象 getTarget().id',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert(this.getTarget().id )
				}
            }
		},
		
		
		isVisible:{
            type: 'button',
            defaultValue: 'x轴滚动条是否显示 isVisible(\'x\')',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert( this.isVisible('x') )
				}
            }
		},
		newKey:{
			type: 'select',
				defaultValue: '',
				data: {
					val: ['overflow模式','被滚动条管理的容器对象'],
					key: ['overflow','container']
				}
		},
		newVal:{
			type:'text',size:25,defaultValue: 'overflow-y|overflow-x|auto'
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
					console.log(opt)
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
            ['console'],
            ['open','close','isVisible','getContainer','getPanel','getScrollBar','getTarget'],
            ['newKey','newVal','newBtn'],
			['dispose']
        ]
    }
};