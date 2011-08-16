var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Accordion'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Accordion核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{items:[{head :"任务0", body : "<span>代办事宜1</span>"},{head :"任务1", body : "<span>代办事宜1</span>"},{head :"任务2", body : "<span>代办事宜1</span>"} ] }',
            target:'accordionId',
            html:'<div id="accordionId" style="margin:50px"></div>'
        },
        console: {
            type: 'button',
            defaultValue: 'console.log',
            event: {
                eventName: 'onclick',
                handler: function(){
					if(console && console.log){console.log(this)}
				}
            }
        },
        collapse: {
            type: 'button',
            defaultValue: '收起前展开的项collapse()',
            event: {
                eventName: 'onclick',
                handler: 'collapse'
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
        getString: {
            type: 'button',
            defaultValue: '获得Accordion的Html getString()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert(this.getString())
                }
            }
        },
        itemHTMLHEAD: {
            label: '项目标题：',
            type: 'text',
            defaultValue: 'new item',
            size: 20
        },
        itemHTMLBODY: {
            label: '<br />项目内容：',
            type: 'text',
            defaultValue: '<p>new body</p>',
            size: 50
        },
        itemINDEX: {
            label: '<br />插入位置：',
            type: 'text',
            defaultValue: '0',
            size: 1,
            maxlength: 1
        },
        insertItemHTML: {
            type: 'button',
            defaultValue: '插入一个新项',
            event: {
                eventName: 'onclick',
                handler: function(h,b,i){
                    this.insertItemHTML({head : itemHTMLHEAD.value, body : itemHTMLBODY.value},itemINDEX.value-0);
                }
            }
        }
    },
    
    groups: {
        'default': [
            ['console'],
            ['collapse','dispose','getString'],
            ['itemHTMLHEAD','itemHTMLBODY','itemINDEX','insertItemHTML']
        ]
    }
};