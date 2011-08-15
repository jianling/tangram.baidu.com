var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.Class'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.Classt'}],
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
            	handler: function(arg0){
				    function myClass(){
						this.name="myclass";
						T.lang.Class.call(this);
					}
					T.lang.inherits(myClass,T.lang.Class);
					var obj1 = new myClass();
					var obj2 = new myClass();
					T.g("resultArea").innerHTML=obj1.guid+"<br/>";
					T.g("resultArea").innerHTML+=obj2.guid;
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  