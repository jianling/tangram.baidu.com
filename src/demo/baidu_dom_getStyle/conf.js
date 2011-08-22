var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.getStyle'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.getStyle'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">获取目标元素的指定样式</div><div id="test1" class="test1">.test1{	width:360px;	height:100px;	font-size:20px;	color:#f00;	background:#EEE;	margin:10px;	border:5px solid #DDD;}</div>'
		},
        getStyle: {
			isMain: true,
            type: 'button',
            defaultValue: '获取',
            depend: ['styleName'],
            event: {
                eventName: 'onclick',
                handler: function(styleName){					
					baidu.dom.g("resultTextarea").innerHTML=styleName+" : "+baidu.dom.getStyle("test1", styleName)

				}
            }
        },
        styleName: {
            type: 'text',
            defaultValue: 'width',size:5
        }
    },
    
    groups: {
        'default': [['styleName', 'getStyle']]
    }
};