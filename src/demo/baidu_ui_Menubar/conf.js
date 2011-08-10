var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Menubar'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Input核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{width: 180, data:[ { label: "复制", icon: "-176px -128px", title: "复制当前单元格", items: [ { label: "复制1", icon: "-96px -96px" },{ label: "复制2", icon: "-112px -96px" },{ label: "复制3", icon: "-128px -96px" },{ label: "复制4", icon: "-144px -96px" },{ label: "复制5", icon: "-160px -96px" }] },{ label: "粘贴", icon: "-224px -128px", title: "粘贴当前单元格" }] , type: "click",itemClick:function(idx,evt){alert("您点击了 "+idx+" 项,文字为: "+evt.target.textContent)}}',
			target:'menuclick',
			html:'<input type="button" value="点我弹出菜单" id="menuclick"/> '
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