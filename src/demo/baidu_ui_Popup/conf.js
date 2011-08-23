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
            defaultValue: '显示 open()',
            event: {
                eventName: 'onclick',
                handler: function(){
					var op = this;
					setTimeout(  function(){op.open()} , 1 )
				}
            }
        },
		close: {
            type: 'button',
            defaultValue: '关闭 close()',
            event: {
                eventName: 'onclick',
                handler: 'close'
            }
        },
        isShown: {
            type: 'button',
            defaultValue: '是否显示isShown()',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert(this.isShown())
				}
            }
        },
		newKey:{
			type: 'select',
				defaultValue: '',
				data: {
					val: ['内容DOM元素-优先', '内容HTML', '内容区宽度','内容区高度','上边距','左边距','样式前缀','zIndex','事件-onopen','事件-onclose','事件-onbeforeclose','事件-onupdate','支持Esc键关闭','关闭按钮title','modal 支持','modal颜色','modal透明度','modal的zIndex','支持拖拽','事件-ondragstart','事件-ondrag','事件-ondragend'],
					key: ['content', 'contentText', 'width','height','top','left','classPrefix','zIndex','onopen','onclose', 'onbeforeclose','onupdate','closeOnEscape','closeText','modal','modalColor','modalOpacity','modalZIndex','draggable', 'ondragstart','ondrag','ondragend']
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
				handler: function(){
					var opt={};opt[k]=v;
					try{
						var s = eval('s = '+v);
						if(typeof s=='function' || typeof s=='boolean' || typeof s=='object'){opt[k]=s};
					}catch(e){}
					if( k=='initDate' ){
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
            ['console'],
            ['open','close','isShown'],
            ['newKey','newVal','newBtn'],
			['dispose']
        ]
    }
};