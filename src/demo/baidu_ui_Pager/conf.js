var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Pager'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Pager核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{beginPage: 1, endPage: 30, currentPage: 5, itemCount: 5, ongotopage: function(obj) { obj.page; }, element: "pagerBox", autoRender: true, leftItemCount: 2 }',
			target:'pagerBox',
			html:'<div id="pagerBox" style="padding:10px"></div>'
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
		newKey:{
			type: 'select',
				defaultValue: '',
				data: {
					val: ['起始页码', '最后页码-1', '当前页码','页面链接数','当前页面位置','文字信息格式','链接显示格式','页码显示格式','选中显示样式'],
					key: ['beginPage', 'endPage', 'currentPage','itemCount','leftItemCount','specialLabelMap','tplHref','tplLabel','tplCurrentLabel']
				}
		},
		newVal:{
			type:'text',size:35
		},
		newBtn:{
			type:'button',
			defaultValue: '更新',
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
            ['console'],
            ['newKey','newVal','newBtn'],
			['dispose']
        ]
    }
};