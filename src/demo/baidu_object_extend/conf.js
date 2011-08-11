var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.object.extend'
    },
    
    demoType: [{key: 'default', val: 'baidu.object.extend'}],
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
            		function Source(){
				        this.name="source";
						this.other="others";
					}
					function Target(){
						this.name="target";
					}
				    Source.prototype.method = function(){
				        return "It is the method of source!";
				    }
				    var source = new Source();
					var target =new Target();
					T.object.extend(target,source);
					console.log(target);
					T.g("resultArea").innerHTML = "after extends...<br />";
					T.object.each(target,function(item,key){
						T.g("resultArea").innerHTML+=key+":"+item+"<br/>";
					});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  