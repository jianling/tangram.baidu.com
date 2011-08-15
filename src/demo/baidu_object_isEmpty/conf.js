var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.object.isEmpty'
    },
    
    demoType: [{key: 'default', val: 'baidu.object.isEmpty'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		T.g('resultArea').innerHTML = "检查{}是否为空：" + baidu.object.isEmpty({}) + '<br />';
            		T.g('resultArea').innerHTML += "检查new Object()是否为空：" + baidu.object.isEmpty(new Object()) + '<br />';
            		T.g('resultArea').innerHTML += "检查new Array()是否为空：" + baidu.object.isEmpty(new Array()) + '<br />';
            		T.g('resultArea').innerHTML += "污染Object.prototype<br />";
            		Object.prototype.__set__ = function(value){
            			this.value = value;
            		}
            		T.g('resultArea').innerHTML += "检查new Object()是否为空：" + baidu.object.isEmpty(new Object()) + '<br />';
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  