var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.DatePicker'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'DatePicker核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{calendarOptions: { highlightDates: [new Date("2011-5-1")], disableDates: [new Date("2011-4-3"), new Date("2011-4-5"), {start: new Date("2011-4-21"), end: new Date("2011-4-27")} ]}}',
			target:'showPicker',
			html:'<h5>input获得焦点时弹出DatePicker，点击日期后更新input的属性</h5>  <input name="showpicker" id="showPicker" /> '
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