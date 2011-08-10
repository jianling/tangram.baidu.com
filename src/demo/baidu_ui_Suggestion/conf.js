var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Suggestion'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Suggestion核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{getData: function(word){ var suggestionData = ["hello world"]; suggestionData.unshift(word); this.setData(word, suggestionData);}}',
			target:'suggestId',
			html:' 请任意输入：<input type="text" id="suggestId" size="30" style="width:210px;">'
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