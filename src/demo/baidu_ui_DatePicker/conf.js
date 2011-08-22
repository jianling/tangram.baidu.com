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
            options: '{calendarOptions: { highlightDates: [new Date("2011/5/1")], disableDates: [new Date("2011/4/3"), new Date("2011/4/5"), {start: new Date("2011/4/21"), end: new Date("2011/4/27")} ]}}',
			target:'showPicker',
			html:'<div style="margin:50px;"><h5>input获得焦点时弹出DatePicker，点击日期后更新input的属性</h5>  <input name="showpicker" id="showPicker" /> </div>'
        },
		//	控制台输出调试项
        console: {
            type: 'button',
            defaultValue: 'console.log',
            event: {
                eventName: 'onclick',
                handler: function(){if(console && console.log){console.log(window.t=this)}}
            }
        },
        dispose: {
            type: 'button',
            defaultValue: '销毁dispose()',
            event: {
                eventName: 'onclick',
                handler: 'dispose'
            }
        },
        show: {
            type: 'button',
            defaultValue: '显示日历show()',
            event: {
                eventName: 'onclick',
                handler: function(){
					var op = this;
					setTimeout(function(){op.show()},1);
				}
            }
        },
        hide: {
            type: 'button',
            defaultValue: '隐藏日历hide()',
            event: {
                eventName: 'onclick',
                handler: 'hide'
            }
        }
        
    },    
    groups: {
        'default': [
            ['show','hide'],
            ['dispose']
        ]
    }
};