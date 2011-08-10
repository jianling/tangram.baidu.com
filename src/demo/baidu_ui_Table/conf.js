var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Table'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Table核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{data: [ { content: ["3m co", "$71.72", "0.02", "0.03%"] }, { content: ["alcoa inc", "$29.01", "0.42", "1.47%"] }, { content: ["altria Group inc", "$83.81", "0.28", "0.34%"] }, { content: ["AT&I inc", "$31.63", "<span style=\'color:red\'>-0.48</span>", "<span style=\'color:red\'>-1.34%</span>"] } ], columns: [ { index: 0,  width: 200 }, { index: 1, width: 80 }, { index: 2, width: 50 }, { index: 3, width: 50 } ] }',
			target:'tableId',
			html:'<div id="tableId"></div> '
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