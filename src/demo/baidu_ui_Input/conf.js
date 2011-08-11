var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Input'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Input核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{text: \'输入信息\', disabled:false,onfocus:function(evt){ if(evt.target.getBody().value==\'输入信息\'){evt.target.getBody().value=\'\'} },onblur: function(evt){ if(!evt.target.getBody().value){evt.target.getBody().value = \'输入信息\'}; }}',
			target:'inputContent',
			html:'<div id="inputContent"></div>'
        },
        disable: {
            type: 'button',
            defaultValue: 'disable',
            event: {
                eventName: 'onclick',
                handler: function(){
					console.log(this)
				}
            }
        }
        
    },    
    groups: {
        'default': [
            ['disable']
        ]
    }
};