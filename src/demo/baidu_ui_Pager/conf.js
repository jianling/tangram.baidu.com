var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Pager'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Pager核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{beginPage: 1, endPage: 30, currentPage: 5, itemCount: 5, ongotopage: function(obj) { obj.page; }, element: "pagerBox", autoRender: true, leftItemCount: 2 }',
			target:'pagerBox',
			html:'<div id="pagerBox" style="padding:10px"></div>'
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