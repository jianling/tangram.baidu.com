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
		
		vertival:{type:'text',size:8,label:'垂直方向：',defaultValue:'top'},
		horizontal:{type:'text',size:8,label:'<p>水平方向：',defaultValue:'left'},
		offset:{type:'text',size:15,label:'<p>偏移：',defaultValue:'{x:300,y:30}'},
		autofix:{type:'text',size:15,label:'<p>固定：',defaultValue:'true'},
		onrender:{type:'text',size:15,label:'<p>渲染：',defaultValue:'function(){ alert(\'when render\') }'},
		onupdate:{type:'text',size:15,label:'<p>更新：',defaultValue:'function(){ alert(\'when update\') }'},
		onrelease:{type:'text',size:15,label:'<p>释放：',defaultValue:'function(){ alert(\'when release\') }'},
		
        fixable: {
            type: 'button',
            defaultValue: '设置',
			depend:  ['vertival','horizontal','offset','autofix','onrender','onupdate','onrelease'],
            event: {
                eventName: 'onclick',
                handler: function(vertival,horizontal,offset,autofix,onrender,onupdate,onrelease){
					var opt = {}
					if(vertival)		{opt.vertival=vertival;}
					if(horizontal) 	{opt.horizontal=horizontal;}
					
					if(typeof eval('('+offset+')') == 'object')	{opt.offset=eval('('+offset+')');}
					
					if(typeof eval('('+onrender+')') == 'function')	{opt.onrender=eval('('+onrender+')');}
					if(typeof eval('('+onupdate+')') == 'function')	{opt.onrelease=eval('('+onupdate+')');}
					if(typeof eval('('+onrelease+')') == 'function')	{opt.onrelease=eval('('+onrelease+')');}
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
           ['vertival','horizontal','offset','autofix','onrender','onupdate','onrelease'],
           ['fixable','release'],
           //['newKey','newVal','newBtn']

        ]
    }
};