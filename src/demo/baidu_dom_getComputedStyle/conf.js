var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'method',
        'method': 'baidu.dom.getComputedStyle'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'getComputedStyle示例'}
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
		
		style:{
			type:'text',size:35,defaultValue:'width'
		},
		getComputedStyle:{
			type:'button',
			defaultValue: '获得样式 getComputedStyle()',
			event: {
				eventName: 'onclick',
				handler: function(){
					alert(baidu.dom.getComputedStyle('testDiv',style.value))
				}
			}
		}
		
        
		
    },    
    groups: {
        'default': [
           ['style','getComputedStyle']

        ]
    }
};