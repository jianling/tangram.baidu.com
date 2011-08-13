var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.element.Element'
    },
    
    demoType: [{key: 'default', val: 'baidu.element.Element'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '扩展document.body',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		var el = new baidu.element.Element(document.body);
    				T.g('resultArea').innerHTML = '扩展后的body拥有如下属性/方法:<br />';
            		for(key in el){
        				T.g('resultArea').innerHTML += key + '<br />';
            		}
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  