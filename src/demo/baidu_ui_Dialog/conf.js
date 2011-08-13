var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Dialog',
		dependPackages:['baidu.ui.Dialog.Dialog$button','baidu.ui.Dialog.Dialog$closeButton','baidu.ui.Dialog.Dialog$coverable','baidu.ui.Dialog.Dialog$draggable','baidu.ui.Dialog.Dialog$iframe','baidu.ui.Dialog.Dialog$keyboard','baidu.ui.Dialog.Dialog$modal','baidu.ui.Dialog.Dialog$resizable']
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Dialog核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{buttons: { accept: { content: "<div class=\'tangram-dialog-button-label\' >确定</div>"} },titleText: "标题显示位置", height: "auto", width: 300, modal: true, draggable: true, contentText: "<div class=\'tangram-dialog-img\'></div><div class=\'tangram-dialog-text\'>内容显示位置</div>", type: "alert" }',
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
        dispose: {
            type: 'button',
            defaultValue: '销毁dispose()',
            event: {
                eventName: 'onclick',
                handler: 'dispose'
            }
        },
        open: {
            type: 'button',
            defaultValue: '打开open()',
            event: {
                eventName: 'onclick',
                handler: 'open'
            }
        },
        close: {
            type: 'button',
            defaultValue: '隐藏close()',
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
					val: ['内容DOM元素-优先', '内容HTML', '内容区宽度','内容区高度','上边距','左边距','标题','样式前缀','zIndex','事件-onopen','事件-onclose','事件-onbeforeclose','事件-onupdate','支持Esc键关闭','关闭按钮title','modal 支持','modal颜色','modal透明度','modal的zIndex','支持拖拽','事件-ondragstart','事件-ondrag','事件-ondragend'],
					key: ['content', 'contentText', 'width','height','top','left','titleText','classPrefix','zIndex','onopen','onclose', 'onbeforeclose','onupdate','closeOnEscape','closeText','modal','modalColor','modalOpacity','modalZIndex','draggable', 'ondragstart','ondrag','ondragend']
				}
		},
		newVal:{
			type:'text',size:35
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
					this.update(opt)
				}
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