var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Button'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Button核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{element: "buttonContent", content: "<span class=\'tangram-button-label\' style=\'width: 60px;\'><strong>确定</strong></span>"}',
			html:'<div id="log"></div>',
			jsCode: 'function log(s){ document.getElementById("log").innerHTML += "<br />"+s }'
        },
        disable: {
            type: 'button',
            defaultValue: 'disable',
            event: {
                eventName: 'onclick',
                handler: 'disable'
            }
        },
        enable: {
            type: 'button',
            defaultValue: 'enable',
            event: {
                eventName: 'onclick',
                handler: 'enable'
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
        isDisabled: {
            type: 'button',
            defaultValue: 'isDisabled',
            event: {
                eventName: 'onclick',
                handler: function(){
                    var s = this.isDisabled() || 0;
                    alert( s );
                }
            }
        },
        upcontent: {label:'按钮文本信息：',defaultValue: '<span class=\'tangram-button-label\'>不确定</span>',type:'text',size:50},
        updisabled:{label:'失效按钮：',defaultValue: 'false',type:'text',size:5},

        uponmouseover:{label:'onmouseover：',defaultValue: '',type:'text',size:30},
        uponmousedown:{label:'onmousedown：',defaultValue: '',type:'text',size:30},
        uponmouseup:{label:'onmouseup：',defaultValue: '',type:'text',size:30},
        uponmouseout:{label:'onmouseout：',defaultValue: '',type:'text',size:30},
		
        uponclick:{label:'onclick：',defaultValue: 'alert(5)',type:'text',size:30},
        uponupdate:{label:'onupdate：',defaultValue: '',type:'text',size:30},
        uponload:{label:'onload：',defaultValue: '',type:'text',size:30},
        upondisable:{label:'ondisable：',defaultValue: '',type:'text',size:30},
        uponenable:{label:'onenable：',defaultValue: '',type:'text',size:30},
        
        //    更新基本信息
        runupbaseinfo: {
            type: 'button',
            defaultValue: '更新信息',
            depend: ['upcontent','updisabled'],
            event: {
                eventName: 'onclick',
                handler: function(c,d){
                    var opt= {
                        content:c,
                        disabled:eval(d)
                    };
                    this.update(opt)
                }
            }
        },
        //    更新鼠标事件
        runupmouseevent: {
            type: 'button',
            defaultValue: '更新事件',
            depend:  ['uponmouseover','uponmousedown','uponmouseup','uponmouseout',
			'uponclick','uponupdate','uponload','upondisable','uponenable'],
            event: {
                eventName: 'onclick',
                handler: function(){
					var a = arguments;
					var al = a.length;
					var f = [];
					for(var i=0;i<al;i++){
						try{
							var s = eval('s = function(){'+a[i]+'}'); 
						}catch(e){
						}
						f[i] = typeof s == 'function' ? s : function(){};
					}
					var opt={
						onmouseover : f[0],
						onmousedown : f[1],
						onmouseup : f[2],
						onmouseout :f[3],
						onclick:f[4],
						onupdate:f[5],
						onload:f[6],
						ondisable:f[7],
						onenable:f[8]
					};
					console.log( f )
                    this.update(opt)
                }
            }
        },
		
        
        
    },
    
    groups: {
        'default': [
            ['disable','enable','dispose','isDisabled'],
            ['upcontent','updisabled','runupbaseinfo'],
            ['uponmouseover','uponmousedown','uponmouseup','uponmouseout',
			'uponclick','uponupdate','uponload','upondisable','uponenable',	'runupmouseevent'],
        ]
    }
};