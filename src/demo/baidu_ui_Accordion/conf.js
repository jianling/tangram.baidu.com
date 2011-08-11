var conf = {
	//	定义包类型
	//	class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Accordion'
    },
	//	定义DEMO可选项
    demoType: [
		{key: 'default', val: 'Accordion核心示例'}
	],
	//	默认可选项的配置
    'default': {
		//	类实例化选项
        pageConf: {
            options: '{items:[{head :"我的任务", body : "<span>代办事宜1</span>"},{head :"我的任务", body : "<span>代办事宜1</span>"},{head :"我的任务", body : "<span>代办事宜1</span>"} ] }',
			target:'accordionId',
			html:'<div id="accordionId"></div>'
        },
		collapse: {
            type: 'button',
            defaultValue: 'collapse',
            event: {
                eventName: 'onclick',
                handler: 'collapse'
            }
        },
		dispose: {
            type: 'button',
            defaultValue: 'dispose',
            event: {
                eventName: 'onclick',
                handler: 'dispose'
            }
        },
		getString: {
            type: 'button',
            defaultValue: 'getString',
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
            size: 50
        },
		itemHTMLBODY: {
            label: '项目内容HTML：',
            type: 'text',
            defaultValue: '<p>new body</p>',
            size: 50
        },
		itemINDEX: {
            label: 'index：',
            type: 'text',
            defaultValue: '0',
            size: 1,
            maxlength: 1
        },
		insertItemHTML: {
            type: 'button',
            defaultValue: 'insertItemHTML',
			depend: ['itemHTMLHEAD','itemHTMLBODY','itemINDEX'],
            event: {
                eventName: 'onclick',
                handler: function(h,b,i){
					this.insertItemHTML({head : h, body : b},i-0);
				}
            }
        }
    },
    
    groups: {
        'default': [
			['collapse','dispose','getString'],
			['itemHTMLHEAD','itemHTMLBODY','itemINDEX','insertItemHTML']
		]
    }
};