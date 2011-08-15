var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.ColorPicker',
		dependPackages:['baidu.ui.ColorPicker.*']
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'ColorPicker核心示例'},
        {key: 'ColorPickerMore', val: 'ColorPicker More插件示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: ' {element: "button", autoRender: true, onchosen: function(data){ baidu.dom.setStyle("testdiv", "background-color", data.color); }, more: false } ',
			target:'',
			html:'<input type="button" value="简单colorPalette" id="button"/> <div style="width:200px;height:200px;border:1px solid #FFF" id="testdiv">  </div> '
        },
		//	控制台输出调试项
        console: {
            type: 'button',
            defaultValue: 'console.log',
            event: {
                eventName: 'onclick',
                handler: function(){if(console && console.log){console.log(window.tmp=this)}}
            }
        }
        
    },
	//	more 插件
    'ColorPickerMore': {
        //    类实例化选项
        pageConf: {
            options: ' {element: "button", autoRender: true, onchosen: function(data){ console.log(arguments);baidu.dom.setStyle("testdiv", "background-color", data.color); }, more: true } ',
			target:'',
			html:'<input type="button" value="带more选项的colorPalette" id="button"/> <div style="width:200px;height:200px;border:1px solid #FFF" id="testdiv">  </div> '
        }
        
    },
    groups: {
        'default': [
            ['console']
        ]
    }
};