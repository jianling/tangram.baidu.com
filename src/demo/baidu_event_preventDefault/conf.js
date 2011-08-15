var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.event.preventDefault'
    },
    
    demoType: [{key: 'default', val: 'baidu.event.preventDefault'}],
    'default': {
        pageConf: {
            html: '<p><a href="http://www.baidu.com" target="_blank" id="mylink">我是链接</a></p><div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
					T.g("resultArea").innerHTML = '<p>阻止了链接的默认事件...</p>'
            		T.event.on('mylink', "click", function(e){
					   baidu.event.preventDefault(e);
					});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};