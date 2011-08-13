var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Suggestion',
		dependPackages:['baidu.ui.Suggestion.*']

    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'Suggestion核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{getData: function(word){var SD = [\'AF Afgan 阿富汗 \',\'AL Albania 阿尔巴尼亚 \',\'AD Andorra 安道尔 \',\'AO Angola 安哥拉 \',\'AI Angola 安圭拉 \',\'AQ Antarctica 南极洲 \',\'AG Ntigua and Barbuda 安提瓜和巴布达 \',\'AR Argentina 阿根廷 \',\'AM Armenia 亚美尼亚 \',\'AW Aruba 阿鲁巴 \',\'AU Australia 澳大利亚 \',\'AT Austria 奥地利 \',\'AZ Azerbaijan 阿塞拜疆 \',\'AE United Arab Emirates 阿联酋 \',\'BS Bahamas 巴哈马 \',\'BH Bahrain 巴林 \',\'BD Bangladesh 孟加拉 \',\'BB Barbados 巴巴多斯 \',\'BY White Russia 白俄罗斯 \',\'BZ Belize 伯利兹 \',\'BE Belgium 比利时\'],FD = []; baidu.array.each(SD, function(data, index){if(word && data.indexOf(word)!= -1){FD.push(data.replace(word, "<span style=\'color:red\'>"+word+"</span>"));}}); this.appendHTML = "总共"+FD.length+"条";this.show(word,FD); }, onbeforepick: function(evt){ var div = document.createElement(\'div\'); div.innerHTML = evt.data.item.content; evt.data.item.content = evt.data.item.value = baidu.dom.getText(div); } }',
			target:'suggestId',
			html:' <div style="margin:50px">请任意输入：<input type="text" id="suggestId" size="30" style="width:400px;" /></div>'
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
		
		hide: {
            type: 'button',
            defaultValue: '隐藏 hide()',
            event: {
                eventName: 'onclick',
                handler: 'hide'
            }
        },
		
		getTargetValue: {
            type: 'button',
            defaultValue: '获得输入框的值 getTargetValue()',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert(this.getTargetValue())
				}
            }
        },
		
		getTarget: {
            type: 'button',
            defaultValue: '获得输入框元素 getTarget().id',
            event: {
                eventName: 'onclick',
                handler: function(){
					alert(this.getTarget().id)
				}
            }
        },

		str:{type:'text',size:1,defaultValue:'A',label:'触发字符串'},
		dat:{type:'text',size:50,defaultValue:'[\'AAA\',\'BBB\',\'CCC\',\'ABC\']',label:'<br />数据'},
		iss:{type:'text',size:2,defaultValue:'false',label:'<br />是否强制展现'},
		show:{
            type: 'button',
            defaultValue: '绘制展现 show()',
            event: {
                eventName: 'onclick',
                handler:function(){
					this.show(str.value,eval(dat.value),eval(iss.value))
				}
            }
		},
		num:{type:'text',size:2,defaultValue:'0',label:'索引项'},
		pick:{
            type: 'button',
            defaultValue: '放入input pick()',
            event: {
                eventName: 'onclick',
                handler:function(){
					this.pick(num.value-0)
				}
            }
		},
		num2:{type:'text',size:2,defaultValue:'AD',label:'字符串'},
		pick2:{
            type: 'button',
            defaultValue: '放入input pick()',
            event: {
                eventName: 'onclick',
                handler:function(){
					this.pick(num2.value)
				}
            }
		},
		num3:{type:'text',size:2,defaultValue:'0',label:'索引项'},
		confirm:{
            type: 'button',
            defaultValue: '放入input confirm()',
            event: {
                eventName: 'onclick',
                handler:function(){					
					this.confirm( num3.value-0 );
				}
            }
		},
		num4:{type:'text',size:2,defaultValue:'0',label:'索引项'},
		highLight:{
            type: 'button',
            defaultValue: '高亮条目 highLight()',
            event: {
                eventName: 'onclick',
                handler:function(){					
					this.highLight( num4.value-0 );
				}
            }
		},
		dehighLight:{
            type: 'button',
            defaultValue: '延迟5s触发，请在输入框中输入A，等待高亮触发',
            event: {
                eventName: 'onclick',
                handler:function(){					
					var op = this;
					setTimeout(function(){op.highLight( num4.value-0 )},5000)
				}
            }
		},
		declearHighLight:{
            type: 'button',
            defaultValue: '延迟5s高亮&&延迟10s取消高亮',
            event: {
                eventName: 'onclick',
                handler:function(){					
					var op = this;
					setTimeout(function(){op.highLight( num4.value-0 )},5000)
					setTimeout(function(){op.clearHighLight( num4.value-0 )},10000)
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
            ['hide','getTarget','getTargetValue'],
            ['str','dat','iss','show'],
            ['num','pick'],
            ['num2','pick2'],
            ['num3','confirm'],
            ['num4','highLight','dehighLight','declearHighLight'],
			['dispose']
        ]
    }
};