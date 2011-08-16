var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'method',
        'method': 'baidu.dom.fixable'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'baidu.dom.fixable'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{}',
			target:'',
			html:' <div id="testDiv" style="width:300px;height:300px;background:#F00;border: 5px #333 solid">#testDiv</div>',
			jsCode:''
        },
		
		vertival:{type:'text',size:8,label:'垂直方向',defaultValue:'top'},
		horizontal:{type:'text',size:8,label:'水平方向',defaultValue:'left'},
		offset:{type:'text',size:15,label:'偏移',defaultValue:'{x:500,y:10}'},
		autofix:{type:'text',size:15,label:'固定',defaultValue:'true'},
		onrender:{type:'text',size:15,label:'渲染',defaultValue:'function(){ alert(\'when render\') }'},
		onupdate:{type:'text',size:15,label:'更新',defaultValue:'function(){ alert(\'when update\') }'},
		onrelease:{type:'text',size:15,label:'释放',defaultValue:'function(){ alert(\'when release\') }'},
		
        fixable: {
            type: 'button',
            defaultValue: '设置',
            event: {
                eventName: 'onclick',
                handler: function(){
					var opt = {}
					if(vertival.value.length)		{opt.vertival=vertival.value;}
					if(horizontal.value.length) 	{opt.horizontal=horizontal.value;}
					
					if(typeof eval('('+offset.value+')') == 'object')	{opt.offset=eval('('+offset.value+')');}
					
					if(typeof eval('('+onrender.value+')') == 'function')	{opt.onrender=eval('('+onrender.value+')');}
					if(typeof eval('('+onupdate.value+')') == 'function')	{opt.onrelease=eval('('+onupdate.value+')');}
					if(typeof eval('('+onrelease.value+')') == 'function')	{opt.onrelease=eval('('+onrelease.value+')');}
					console.log(opt)
					
					this.fixableDemo = baidu.dom.fixable('testDiv',opt);
				}
            }
        },
		release:{
            type: 'button',
            defaultValue: '释放',
            event: {
                eventName: 'onclick',
				handler:function(){
					this.fixableDemo.release();
				}
			}
		},
		
		newKey:{
			type: 'select',
				defaultValue: '',
				data: {
					val: ['水平方向','垂直方向','偏移','事件-渲染','事件-更新','事件-释放'],
					key: ['horizontal','vertival','offset','onrender','onupdate','onrelease']
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
					console.log(opt)
					this.fixableDemo.update(opt)
				}
			}
		}
		
        
		
    },    
    groups: {
        'default': [
           ['vertival','horizontal','offset','autofix','onrender','onupdate','onrelease','fixable'],
           ['release'],
           //['newKey','newVal','newBtn']

        ]
    }
};