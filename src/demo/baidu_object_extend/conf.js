var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.object.extend'
    },
    
    demoType: [{key: 'default', val: 'baidu.object.extend'}],
    'default': {
        pageConf: {
            html: '<div class="Conmain">'+
						'<div id="resultArea" style="">#resultArea</div>'+
						'<div class="explain">'+
						'拷贝一个对象属性到另一个对象中，目标对象{a:1}，继承对象{a:2,b:2}'+
						'<br />JS代码<code>'+
						'baidu.g("resultArea").innerHTML= baidu.json.encode ( baidu.object.extend({a:1},{a:2,b:2}) )'+
						'</code></div>'+
					'</div>'        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
					baidu.g("resultArea").innerHTML= "结果："+baidu.json.encode ( baidu.object.extend({a:1},{a:2,b:2}) )
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  