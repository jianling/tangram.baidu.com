var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.inherits'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.inherits'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            event: {
            	eventName: 'onclick',
            	handler: function(){
					  	function ClassA(){
					        this.name = "ClassA";
					        this.country = "China";
					    }
					    ClassA.prototype.getName = function(){ return this.name; }
					    function ClassB(){
					        ClassA.call(this);
					        this.name = "ClassB";
					    }
					    T.lang.inherits(ClassB, ClassA);
					    var obj = new ClassB();
					    T.g('resultArea').innerHTML = "返回：" + obj.getName() + "<br>";
					    T.g('resultArea').innerHTML += "返回：" + obj.country + "<br>";
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  