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
			html:'<div id="tableId" style="margin:20px"></div> '
        },
        
        getRowIndex: {
            type: 'text',
            defaultValue: '0',
            size: 2,
            maxlength: 10
        },
        
        getRow: {
            type: 'button',
            defaultValue: 'getRow(index)',
            depend: ['getRowIndex'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    var row = this.getRow(parseInt(c, 10));
                    alert(row ? row.getString() : unescape('%u4E0D%u5B58%u5728%u8BE5%u884C'));
				}
            }
        },
        
        addRowTxt: {
            type: 'text',
            defaultValue: "{content: ['text-0', 'text-1', 'text-2', 'text-3']}",
            size: 5,
            maxlength: 255
        },
        
        addRowIndex: {
            type: 'text',
            defaultValue: '0',
            size: 3,
            maxlength: 3
        },
        
        addRow: {
            type: 'button',
            defaultValue: 'addRow(optoins, index)',
            depend: ['addRowTxt', 'addRowIndex'],
            event: {
                eventName: 'onclick',
                handler: function(a, b){
                    var opt = eval('(' +a+ ')'),
                        index = parseInt(b, 10);
                    this.addRow(opt, index);
                }
            }
        },
        
        removeRowIndex: {
            type: 'text',
            defaultValue: '0',
            size: 2,
            maxlength: 5
        },
        
        removeRow: {
            type: 'button',
            defaultValue: 'removeRow(index)',
            depend: ['removeRowIndex'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    this.removeRow(parseInt(c, 10))
                }
            }
        },
        
        getRowCount: {
            type: 'button',
            defaultValue: 'getRowCount()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert(this.getRowCount());
                }
            }
        }
        
    },    
    groups: {
        'default': [
            ['getRowIndex', 'getRow'],
            ['addRowTxt', 'addRowIndex', 'addRow'],
            ['removeRowIndex', 'removeRow'],
            ['getRowCount']
        ]
    }
};