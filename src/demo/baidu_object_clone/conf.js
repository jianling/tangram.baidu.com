var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.object.clone'
    },
    
    demoType: [{key: 'default', val: 'baidu.object.clone'}],
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
            		function Engineer(){
				        this.name = "haijian"
					}
					Engineer.prototype.eat = function(){
				        return "Not Enough!";
					}
					var source = new Engineer();    //source具有属性name="haijian"，以及方法eat。
					T.g('resultArea').innerHTML = "source.name:"+source.name+"<br>";
					T.g('resultArea').innerHTML += "source.eat():"+source.eat()+"<br>";
					var clone =T.object.clone(source);
					T.g('resultArea').innerHTML += "<p id='prompt'>After T.object.clone...</p>";
					T.g('resultArea').innerHTML += "clone.name:"+clone.name+"<br>";
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  