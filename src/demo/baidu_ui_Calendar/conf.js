var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Calendar'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Calendar核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{highlightDates:[new Date("2011/5/1")],disableDates:[new Date(\'2011/4/3\'),new Date(\'2011/4/5\'),{start:new Date(\'2011/4/21\'),end:new Date(\'2011/4/27\')}]}',
			html:'<div id="calendarId"></div> ',
			target:'calendarId'
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