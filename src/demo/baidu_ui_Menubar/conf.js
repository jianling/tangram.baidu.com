var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Menubar',
		dependPackages:['baidu.ui.Menubar.*']
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Menubar核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{width: 180, data:[ { label: "复制", icon: "-176px -128px", title: "复制当前单元格", items: [ { label: "复制1", icon: "-96px -96px" },{ label: "复制2", icon: "-112px -96px" },{ label: "复制3", icon: "-128px -96px" },{ label: "复制4", icon: "-144px -96px" },{ label: "复制5", icon: "-160px -96px" }] },{ label: "粘贴", icon: "-224px -128px", title: "粘贴当前单元格" }] , type: "click",itemClick:function(idx,evt){alert("您点击了 "+idx+" 项,文字为: "+evt.target.textContent)}}',
			target:'menuclick',
			html:'<input type="button" value="点我弹出菜单" id="menuclick" style="margin:50px"/> '
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
		idx: {
            type: 'text',
            label: '索引',
            defaultValue: '0-0',
			size:5
        },
		getBranchId: {
            type: 'button',
            defaultValue: 'getBranchId()',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert(this.getBranchId(idx.value))
				}
            }
        },
		getItem: {
            type: 'button',
            defaultValue: 'getItem()',
            event: {
                eventName: 'onclick',
                handler: function(){
					var e = this.getItem(idx.value) || '请点击弹出菜单后再执行';
					alert(e)
				}
            }
        },
		getItemData: {
            type: 'button',
            defaultValue: 'getItemData()',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert( baidu.json.encode( baidu.json.encode( this.getItemData(idx.value) ) )	)
				}
            }
        },
		getItemEventData: {
            type: 'button',
            defaultValue: 'getItemEventData()',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert( baidu.json.encode( baidu.json.encode( this.getItemEventData(idx.value) ) )	)
				}
            }
        },
		getItemId: {
            type: 'button',
            defaultValue: 'getItemId()',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert( this.getItemId(idx.value) 	)
				}
            }
        },
		
		newKey:{
			type: 'select',
				defaultValue: '',
				data: {
					val: ['宽度', '高度', 'zIndex','相对位置','数据项','消失延迟','开关函数'],
					key: ['width', 'height', 'zIndex','position','data','hideDelay','toggle']
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
					if( k=='initDate' ){
						opt[k]=new Date(v);
					}
					this.update(opt)
				}
			}
		},
		dispose: {
            type: 'button',
            defaultValue: 'dispose()',
            event: {
                eventName: 'onclick',
                handler: 'dispose'
            }
        }
		
    },

	
    
    groups: {
        'default': [
            ['open','close'],
            ['idx','getBranchId','getItem','getItemData','getItemEventData','getItemId'],
            ['newKey','newVal','newBtn'],
			['dispose']
        ]
    }
};