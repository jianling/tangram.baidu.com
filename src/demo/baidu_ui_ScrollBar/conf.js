var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.ScrollBar',
		dependPackages:['baidu.ui.ScrollBar.*']
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'ScrollBar核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{skin: "scrollbar-a"}',
			target:'scrollID',
			html:'<div id="scrollID" style="width:15px; height:200px; margin:50px;"></div>'
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
		getSize:{
            type: 'button',
            defaultValue: '滚动条的宽高 getSize()',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert(baidu.json.encode(this.getSize()) )
				}
            }
		},
		isVisible:{
            type: 'button',
            defaultValue: '是否显示 isVisible()',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert( this.isVisible() )
				}
            }
		},
		per:{type:'text',defaultValue:'50',size:1},
		scrollTo:{
            type: 'button',
			label:'%',
            defaultValue: '滚动到',
            event: {
                eventName: 'onclick',
                handler: function(){
					this.scrollTo(per.value);
				}
            }
		},
		fper:{type:'text',label:'位置百分比',defaultValue:'20',size:1},
		fbkh:{type:'text',label:'滑块高度比',defaultValue:'50',size:1},
		flushUI:{
            type: 'button',
            defaultValue: '设置',
            event: {
                eventName: 'onclick',
                handler: function(){
					this.flushUI(fper.value-1,fbkh.value-1);
				}
            }
		},
		exporientation: {label:'格式-滑块方向：',defaultValue: 'horizontal|vertical 默认值：vertical',type:'text',size:40,
			event: {eventName: 'onclick',handler:function(){ newVal.value = 'horizontal' }}
		},
		expvalue: {label:'<br />格式-滑块位置：',defaultValue: '定义域(0, 100)',type:'text',size:40,
			event: {eventName: 'onclick',handler:function(){ newVal.value = Math.ceil( Math.random()*80 ) }}
		},
		expdimension: {label:'<br />格式-滑块高度：',defaultValue: '滑块占总高的百分比，定义域(0, 100)',type:'text',size:40,
			event: {eventName: 'onclick',handler:function(){ newVal.value =  Math.ceil( Math.random()*20 ) }}
		},
		expstep: {label:'<br />格式-单次位移：',defaultValue: '点击滚动按钮时移动的百分比，定义域(0, 100)',type:'text',size:40,
			event: {eventName: 'onclick',handler:function(){ newVal.value = Math.ceil( Math.random()*10 ) }}
		},
		exponscroll: {label:'<br />格式-滚动事件：',defaultValue: '当滚动时触发该事件，function(evt){}',type:'text',size:40,
			event: {eventName: 'onclick',handler:function(){ newVal.value = 'function(evt){alert(evt.value)}' }}
		},
		
		newKey:{
			type: 'select',
				defaultValue: '',
				data: {
					val: [/*'方向', */'滑块位置', '滑块高度比','单次位移比','滚动事件'],
					key: [/*'orientation',*/ 'value', 'dimension','step','onscroll']
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
					
					if( newKey.value=='orientation' && 0){
						//暂时不支持直接水平切换，因为无法更新 skin
						//alert('切换水平模式还需要切换组件的CSS样式前缀以及render元素的宽和高');
						var cfg = {
							'horizontal':{skin:'scrollbar-b',elStyle:'width:200px; height:15px; margin:50px'},
							'vertical':{skin:'scrollbar-a',elStyle:'width:15px; height:200px; margin:50px;'}
						}
						//	设置容器的CSS
						baidu.dom.setAttr( baidu.dom.g('scrollID'),'style',cfg[newVal.value]['elStyle']);
						//	添加组件的皮肤
						opt['skin'] = cfg[newVal.value]['skin'];
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
            ['getSize','open','close','isVisible'],
            ['per','scrollTo'],
            ['fper','fbkh','flushUI'],
            ['newKey','newVal','newBtn'],
            [/*'exporientation', */'expvalue', 'expdimension','expstep','exponscroll'],
			['dispose']
        ]
    }
};