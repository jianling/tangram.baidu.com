var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Toolbar',
		dependPackages:['baidu.ui.Toolbar.*','baidu.ui.Button','baidu.ui.Combox']
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Toolbar核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{items: [ { type: "combox", config:{ width: 93, skin: "family", name: "font-family", data:[ { content: \'宋体\', value: \'1\' }, { content: \'黑体\', value: \'2\' }, { content: \'楷体\', value: \'3\' } ] } }, { type: "toolbar-spacer", config: { width: "10px" } }, { type: "combox", config:{ width: 68, skin: "size", name: "font-size", data:[ { content: \'10\', value: \'1\' }, { content: \'12\', value: \'2\' }, { content: \'14\', value: \'3\' } ] } }, { type: "toolbar-spacer", config: { width: "10px" } }, { config: { skin: "boldBtn", onclick: function(){alert("bold");} } }, { config: { skin: "italicBtn", onclick: function(){alert("italic");} } }, { config: { skin: "underlineBtn", onclick: function(){alert("underline");} } }, { config: { skin: "colorBtn" } }, { config: { skin: "backColorBtn" } }, { config: { skin: "linkBtn" } } ] }',
			
			target:'toolbarId',
			html:'<div id="toolbarId"></div> '
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