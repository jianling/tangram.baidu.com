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
		//	控制台输出调试项
        console: {
            type: 'button',
            defaultValue: 'console.log',
            event: {
                eventName: 'onclick',
                handler: function(){if(console && console.log){console.log(window.t=this)}}
            }
        },
		
		getDate: {
            type: 'button',
            defaultValue: '返回一个当前选中的当地日期对象 getDate()',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert(this.getDate())
				}
            }
        },		
		getToday: {
            type: 'button',
            defaultValue: '取得一个本地化的当天的日期 getToday()',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert(this.getToday())
				}
            }
        },		
		nextMonth: {
            type: 'button',
            defaultValue: '下月nextMonth()',
            event: {
                eventName: 'onclick',
                handler: 'nextMonth'
            }
        },		
		prevMonth: {
            type: 'button',
            defaultValue: '上月prevMonth()',
            event: {
                eventName: 'onclick',
                handler: 'prevMonth'
            }
        },
		setDateVal: {
            type: 'input',
            label: '设置时间',
            defaultValue: '2009-01-01',
        },
		setDateBtn: {
            type: 'button',
            defaultValue: '确定',
			depend:  ['setDateVal'],
			event:{
                eventName: 'onclick',
                handler: function(d){
					this.setDate(new Date(d))
				}
			}
        },
		
		newKey:{
			type: 'select',
				defaultValue: '',
				data: {
					val: ['每周的开始', '当前选中日期', '高亮显示的日期','不可用的日期','翻转月份按钮的内容','语言','单击日期的事件'],
					key: ['weekStart', 'initDate', 'highlightDates','disableDates','flipContent','language','onclickdate']
				}
		},
		newVal:{
			type:'text',size:35
		},
		newBtn:{
			type:'button',
			defaultValue: '更新',
			depend:  ['newKey','newVal'],
			event: {
				eventName: 'onclick',
				handler: function(k,v){
					var opt={};opt[k]=v;
					try{
						var s = eval('s = '+v);
						if(typeof s=='function' || typeof s=='boolean' || typeof s=='object'){opt[k]=s};
					}catch(e){}
					if( newKey.value=='initDate' ){
						opt[k]=new Date(v);
					}
					this.update(opt)
				}
			}
		},
		expweekStart: {label:'格式-每周的开始：',defaultValue: "Mon|Tue|Web|Thu|Fri|Sat|Sun，默认值Sun",type:'text',size:30,
			event: {eventName: 'onclick',handler:function(){ newVal.value = 'Mon' }}
		},
		expinitDate: {label:'<br />格式-选中的日期：',defaultValue: "2009-09-09",type:'text',size:30,
			event: {eventName: 'onclick',handler:function(){ newVal.value = new Date(expinitDate.value) }}
		},
		exphighlightDates: {label:'<br />格式-高亮的日期：',defaultValue: "[date, {start:date, end:date}]",type:'text',size:30,
			event: {eventName: 'onclick',handler:function(){ newVal.value = '[new Date(new Date().getTime()-1000*60*60*48)]' }}
		},
		expdisableDates: {label:'<br />格式-禁用的日期：',defaultValue: "[date, {start:date, end:date}]",type:'text',size:30,
			event: {eventName: 'onclick',handler:function(){ newVal.value = '[new Date(new Date().getTime()-1000*60*60*48)]' }}
		},
		expflipContent: {label:'<br />格式-翻月的文字：',defaultValue: "{prev: '<', next: '>'}",type:'text',size:30,
			event: {eventName: 'onclick',handler:function(){ newVal.value = '{prev: "上月", next: "下月"}' }}
		},
		explanguage: {label:'<br />格式-日历的语言：',defaultValue: "中文|English",type:'text',size:30,
			event: {eventName: 'onclick',handler:function(){ newVal.value = 'English' }}
		},
		exponclickdate: {label:'<br />格式 - 单击事件：',defaultValue: "function(evt,dat){alert(dat.date)}",type:'text',size:30,
			event: {eventName: 'onclick',handler:function(){ newVal.value = 'function(evt,dat){alert(dat.date)}' }}
		},
    },

	
    
    groups: {
        'default': [
            ['console'],
            ['nextMonth','prevMonth','getDate','getToday'],
            ['setDateVal','setDateBtn'],
            ['newKey','newVal','newBtn'],
            ['expweekStart','expinitDate','exphighlightDates','expdisableDates','expflipContent','explanguage','exponclickdate']
        ]
    }
};