var conf = {
    clazz: {
        type: 'object',
        'object': 'baidu.fx.getTransition'
    },
    
    demoType: [{key: 'default', val: 'getTransition'}],
    
    'default': {
        pageConf: {
            html: '<div style="margin: 20px;" id="resourtArea">获取线型函数</div>'
        },
		
		key:{
			type: 'select',
				defaultValue: '',
				data: {
					val: ['斜线', '反斜线', '抛物线','反抛物线','正弦波','摇晃','弹性阻尼'],
					key: ['linear', 'reverse', 'parabola','antiparabola','sinoidal','wobble','spring']
				}
		},
        get: {
			isMain: true,
            type: 'button',
            defaultValue: '获取',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					var k = baidu.dom.g('key').value;
					var s = baidu.fx.getTransition(k);
					var t = baidu.dom.getText( baidu.dom.query('option[value='+baidu.dom.g('key').value+']',baidu.dom.g('key'))[0] );
					baidu.dom.g('resourtArea').innerHTML += '<p style="font-weight:bold">'+t+'</p><pre>'+s+'</pre>';
					
                }
            }
        }
    },
    
    groups: {
        'default': [['key','get']]
    }
}