var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.getText'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.getText'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea">获取文本</div><div id="test"><h3>测试元素 <!-- 注释 --></h3></div>'
		},
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '获取文本',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					var text = baidu.dom.getText("test");
					baidu.dom.g("resultTextarea").innerHTML="获取文本：\'"+text+"\'"+"<br>";
				}
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};