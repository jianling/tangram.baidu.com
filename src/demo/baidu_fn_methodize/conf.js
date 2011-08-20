var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.fn.methodize'
    },
    
    demoType: [{key: 'default', val: 'baidu.fn.methodize'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">对一个函数进行方法化。示例代码：<br/>var instance = {<br/>name: "hello world",<br/>run: baidu.fn.methodize(function(c){alert(c); alert(this.name);}, "name")<br/>};<br/>instance.run();</div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            	    var instance = {
            	        name: 'john',
            	        run: baidu.fn.methodize(function(c){
            	            alert(c);
            	            alert(this.name)
            	        }, 'name')
            	    };
            	    instance.run();
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};