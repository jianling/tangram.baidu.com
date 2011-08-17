var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Tooltip',
		dependPackages:['baidu.ui.Tooltip.*']
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Tooltip核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{type: "click",target:"toolTip",autoRender:true,content: "<div style=\'width:300px;height:100px\'>显示的信息，信息内容可以自己设定，可以是文字也可以是html代码。</div>" }',
			target:'',
			html:' <input type="button" id="toolTip" value="点此弹出消息框#toolTip" /><input type="button" id="toolTip2" value="点此弹出消息框#toolTip2" />'
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
            defaultValue: '打开toolTip的提示open()',
            event: {
                eventName: 'onclick',
                handler: function(){
					this.open( baidu.dom.g('toolTip') );
				}
            }
        },
		open2: {
            type: 'button',
            defaultValue: '打开toolTip2的提示open()',
            event: {
                eventName: 'onclick',
                handler: function(){
					this.open( baidu.dom.g('toolTip2') );
				}
            }
        },
		close: {
            type: 'button',
            defaultValue: '关闭 close()',
            event: {
                eventName: 'onclick',
                handler:'close'
            }
        },
		exporientation: {label:'格式-滑块方向：',defaultValue: 'horizontal|vertical 默认值：vertical',type:'text',size:40,
			event: {eventName: 'onclick',handler:function(){ newVal.value = 'horizontal' }}
		},
		
		newKey:{
			type: 'select',
				defaultValue: '',
				data: {
					val: ['目标元素','触发类型','HTMLElement','HTML String','宽度','高度','偏移量','是否单例','zIndex','偏移对象','定位元素','自动渲染','事件-onopen','事件-onclose','事件-onbeforeopen','事件-onbeforeclose'],
					key: ['target','type','contentElement','content','width','height','offset','single','zIndex','positionElement','positionElement','onopen','onopen','onclose','onbeforeopen','onbeforeclose']
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
					var k = newKey.value;
					var v = newVal.value;
					var opt={};opt[k]=v;
					try{
						var s = eval('s = '+v);
						if(typeof s=='function' || typeof s=='boolean' || typeof s=='object'){opt[k]=s};
					}catch(e){}
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
            ['open','open2','close'],
            ['newKey','newVal','newBtn'],

			['dispose']
        ]
    }
};