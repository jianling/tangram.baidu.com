var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Tab'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Tab核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{items: [ { head: "label1", body: "<p>欢迎使用Tangram!</p>" }, { head: "label2", body: "<p>这是Tangram的Tab控件!</p>" }, { head: "label3", body: "<p>谢谢使用!</p>" } ], switchType: "click" }',
			target:'target',
			html:'<div style="padding:50px"><div id="target" style="width:400px;height:200px"></div></div>'
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
		idx:{type:'text',size:1,defaultValue:'0',label:'索引'},
		con:{type:'text',size:50,defaultValue:'在项目中插入内容'},
		insertContentHTML: {
            type: 'button',
            defaultValue: '插入内容 insertContentHTML()',
            event: {
                eventName: 'onclick',
                handler: function(){
					this.insertContentHTML(con.value,idx.value-0)
				}
            }
        },
		idx2:{type:'text',size:1,defaultValue:'0',label:'索引'},
		con2:{type:'text',size:50,defaultValue:'{head:\'新项\',body:\'新项内容\'}'},
		insertItemHTML: {
            type: 'button',
            defaultValue: '插入新项 insertItemHTML()',
            event: {
                eventName: 'onclick',
                handler: function(){
					this.insertItemHTML(baidu.json.decode(con2.value),idx.value-0)
				}
            }
        },
		dispose: {
            type: 'button',
            defaultValue: '销毁dispose()',
            event: {
                eventName: 'onclick',
                handler: 'dispose'
            }
        }
		
    },

	
    
    groups: {
        'default': [
            ['console'],
            ['idx','con','insertContentHTML'],
            ['idx2','con2','insertItemHTML'],
			['dispose']
        ]
    }
};