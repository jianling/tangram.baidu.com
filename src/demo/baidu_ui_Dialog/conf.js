var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Dialog'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Dialog核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{buttons: { accept: { content: "<div class=\'tangram-dialog-button-label\' >确定</div>",onclick: function(){ dialogInstance.dispatchEvent(\'onaccept\') && dialogInstance.close();} } },titleText: "标题显示位置", height: "auto", width: 300, modal: true, draggable: true, contentText: "<div class=\'tangram-dialog-img\'></div><div class=\'tangram-dialog-text\'>内容显示位置</div>", type: "alert" }',
			html:''
        },
        disable: {
            type: 'button',
            defaultValue: 'disable',
            event: {
                eventName: 'onclick',
                handler: function(){
					this.open();
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