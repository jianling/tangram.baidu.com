var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Toolbar',
		dependPackages:['baidu.ui.Toolbar.*','baidu.ui.Button','baidu.ui.Combox']
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Toolbar核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{items: [ { type: "combox", config:{ width: 93, skin: "family", name: "font-family", data:[ { content: \'宋体\', value: \'1\' }, { content: \'黑体\', value: \'2\' }, { content: \'楷体\', value: \'3\' } ] } }, { type: "toolbar-spacer", config: { width: "10px" } }, { type: "combox", config:{ width: 68, skin: "size", name: "font-size", data:[ { content: \'10\', value: \'1\' }, { content: \'12\', value: \'2\' }, { content: \'14\', value: \'3\' } ] } }, { type: "toolbar-spacer", config: { width: "10px" } }, { config: { skin: "boldBtn", onclick: function(){alert("bold");} } }, { config: { skin: "italicBtn", onclick: function(){alert("italic");} } }, { config: { skin: "underlineBtn", onclick: function(){alert("underline");} } }, { config: { skin: "colorBtn" } }, { config: { skin: "backColorBtn" } }, { config: { skin: "linkBtn" } } ] }',
			
			target:'toolbarId',
			html:'<div id="toolbarId"></div> '
        },

        addText: {
            type: 'text',
            defaultValue: "{config: {skin: 'underlineBtn', onclick: function(){alert('underline');}}}",
            size: 5,
            maxlength: 255
        },
        
        addContainer: {
            type: 'text',
            defaultValue: '',
            size: 5,
            maxlength: 50
        },
        
        add: {
            type: 'button',
            defaultValue: 'add(item, container)',
            depend: ['addText', 'addContainer'],
            event: {
                eventName: 'onclick',
                handler: function(a, b){
                    var opt = eval('('+a+')');
                    this.add(opt, b);
                }
            }
        },
        
        
        addRawTxt: {
            type: 'text',
            defaultValue: "baidu.ui.Button",
            size: 5,
            maxlength: 255
        },
        
        addRawContainer: {
            type: 'text',
            defaultValue: '',
            size: 5,
            maxlength: 50
        },
        
        addRaw: {
            type: 'button',
            defaultValue: 'addRaw(ui, container)',
            depend: ['addRawTxt', 'addRawContainer'],
            event: {
                eventName: 'onclick',
                handler: function(a, b){
                    var clazz = eval(a);
                    this.addRaw(new clazz({content: 'hello world'}), b);
                }
            }
        },
        
        removeName: {
            type: 'text',
            defaultValue: 'font-family',
            size: 5,
            maxlength: 50
        },
        
        remove: {
            type: 'button',
            defaultValue: 'remove(name)',
            depend: ['removeName'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    this.remove(c);
                }
            }
        },
        
        removeAll: {
            type: 'button',
            defaultValue: 'removeAll()',
            event: {
                eventName: 'onclick',
                handler: 'removeAll'
            }
        },
        
        enableName: {
            type: 'text',
            defaultValue: 'font-family',
            size: 5,
            maxlength: 50
        },
        
        disableName: {
            type: 'text',
            defaultValue: 'font-family',
            size: 5,
            maxlength: 50
        },
        
        enable: {
            type: 'button',
            defaultValue: 'enable(name)',
            depend: ['enableName'],
            event: {
                eventName: 'onclick',
                handler: 'enable'
            }
        },
        
        disable: {
            type: 'button',
            defaultValue: 'disable(name)',
            depend: ['disableName'],
            event: {
                eventName: 'onclick',
                handler: 'disable'
            }
        },
        
        enableAll: {
            type: 'button',
            defaultValue: 'enableAll()',
            event: {
                eventName: 'onclick',
                handler: 'enableAll'
            }
        },
        
        disableAll: {
            type: 'button',
            defaultValue: 'disableAll()',
            event: {
                eventName: 'onclick',
                handler: 'disableAll'
            }
        },
        
        uiName: {
            type: 'text',
            defaultValue: 'font-family',
            size: 5,
            maxlength: 50
        },
        
        getItemByName: {
            type: 'button',
            defaultValue: 'getItemByName(name)',
            depend: ['uiName'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    alert( this.getItemByName(c) );
                }
            }
        }
        
    },    
    groups: {
        'default': [
            ['addText', 'addContainer', 'add'],
            ['addRawTxt', 'addRawContainer', 'addRaw'],
            ['removeName', 'remove', 'removeAll'],
            ['enableName', 'enable', 'disableName', 'disable', 'enableAll', 'disableAll'],
            ['uiName', 'getItemByName']
        ]
    }
};