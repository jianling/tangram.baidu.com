var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.ColorPalette'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'ColorPalette核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{element: "button", autoRender: true, onchosen: function(data){ baidu.dom.setStyle("testdiv", "background-color", data.color); }, more: true} ',
			target:'',
			html:'<input type="button" value="高级colorPalette" id="button"/> <div style="width:200px;height:200px;border:1px solid #FFF" id="testdiv">  </div> '
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