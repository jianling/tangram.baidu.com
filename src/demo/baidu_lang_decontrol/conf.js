var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.decontrol'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.decontrol'}],
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
				     function myClass(){
						this.name="myclass";
					  	T.lang.Class.call(this);
					 }
					 T.lang.inherits(myClass,T.lang.Class);
					 var obj = new myClass();
					 obj.name="obj";
					 T.g('resultArea').innerHTML = T.lang.instance(obj.guid).name + "<br>";
					 T.lang.decontrol(obj.guid);
					 T.g('resultArea').innerHTML += "<p id='prompt'>After T.lang.decontrol...</p>";
					 T.g('resultArea').innerHTML += T.lang.instance(obj.guid) + "<br>";
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  