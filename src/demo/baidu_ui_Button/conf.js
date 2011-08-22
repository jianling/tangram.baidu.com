var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Button'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Button核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{content: "<span class=\'tangram-button-label\' style=\'width: 60px;\'><strong>确定</strong></span>"}',
			target: 'buttonContent',
			html:'<div id="buttonContent" style="margin:50px;;width:200px;height:120px;"></div><div id="log"></div>',
			jsCode: 'function log(s){ document.getElementById("log").innerHTML += "<br />"+s }'
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
					var s = this.isDisabled() || 0;
					alert( s );
				}
			}
		},
		
		newKey:{
			type: 'select',
				defaultValue: '',
				data: {
					val: ['内容HTML', '禁用状态', '事件-onmouseover ','事件-onmousedown','事件-onmouseup','事件-onmouseout','事件- onclick','事件-onupdate','事件-onload','事件-ondisable','事件-onenable'],
					key: ['content', 'disabled', 'onmouseover','onmousedown','onmouseup','onmouseout','onclick','onupdate','onload','ondisable','onenable']
				}
		},
		newVal:{
			type:'text',size:35
		},
		
		ch: {
			type: 'checkbox',
			data: {
				key: ['1', '2', '3', '4'],
				val: ['a', 'b', 'c', 'd']
			}
		},
		
		newBtn:{
			type:'button',
			defaultValue: '更新',
			depend:  ['ch', 'newKey','newVal'],
			event: {
				eventName: 'onclick',
				handler: function(k,v){
					alert(k);
					/*
					var opt={};opt[k]=v;
					try{
						var s = eval('s = '+v);
						if(typeof s=='function' || typeof s=='boolean'){opt[k]=s};
					}catch(e){}
					this.update(opt)
					console.log(opt)
					*/
				}
			}
		},


		expcontent: {label:'格式-内容：',defaultValue: '<span class=\'tangram-button-label\'>不确定</span>',type:'text',size:50,
			event: {eventName: 'onclick',handler:function(){ newVal.value = expcontent.value }}
		},
		expdisable: {label:'<br />格式-禁用状态：',defaultValue: 'false',type:'text',size:50,
			event: {eventName: 'onclick',handler:function(){ newVal.value = expdisable.value }}
		},
		expevent: {label:'<br />格式-事件设置：',defaultValue: 'function(){ alert(\'Something happened!\') }',type:'text',size:50,
			event: {eventName: 'onclick',handler:function(){ newVal.value = expevent.value }}
		}
		
        
        
    },
    
    groups: {
        'default': [
            ['console'],
            ['disable','enable','isDisabled'],
            ['ch', 'newKey','newVal','newBtn'],
            ['expcontent','expdisable','expevent'],
			['dispose']
        ]
    }
};