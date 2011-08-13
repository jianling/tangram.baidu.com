var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.event.getKeyCode'
    },
    
    demoType: [{key: 'default', val: 'baidu.event.getKeyCode'}],
    'default': {
        pageConf: {
            html: '<p>请输入任意字符：<input type="text" size="10" id="inputArea" /></p><div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		T.event.on(T.g('inputArea'), "keypress", function(e){
					   T.g("resultArea").innerHTML += "key code:"+T.event.getKeyCode(e)+"<br>";
					});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};