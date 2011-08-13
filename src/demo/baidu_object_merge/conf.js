var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.object.merge'
    },
    
    demoType: [{key: 'default', val: 'baidu.object.merge'}],
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
            		var a = {
					    a1 : 1,
					    getA : function(){
					        return this.a1;
					    }
					}
					var b = {
					    a1 : 2,
					    b1 : 2,
					    getB : function(){
					        return this.b1;
					    }
					}
					var c = T.object.merge(a,b);
					T.g('resultArea').innerHTML += "c.getB()="+c.getB()+"<br>";
					//with overwrite option
					a = {
					    a1 : 1,
					    getA : function(){
					        return this.a1;
					    }
					}
					T.g('resultArea').innerHTML += "a.a1="+a.a1+"<br>";
					var d = T.object.merge(a,b,{overwrite:true});
					T.g('resultArea').innerHTML += "merge with overwrite option...<br>";
					T.g('resultArea').innerHTML += "d.a1="+d.a1+"<br>";
					//with whiteList option
					a = {
					    a1 : 1,
					    getA : function(){
					        return this.a1;
					    }
					}
					var e = T.object.merge(a,b,{whiteList:["b1"]});
					T.g('resultArea').innerHTML += "merge with whiteList option...<br>";
					T.g('resultArea').innerHTML += "e.b1="+e.b1+"<br>";
					T.g('resultArea').innerHTML += "e.getB="+e.getB+"<br>";
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  