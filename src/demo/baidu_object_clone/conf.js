var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.object.clone'
    },
    
    demoType: [{key: 'default', val: 'baidu.object.clone'}],
    'default': {
        pageConf: {
            html: '<div class="Conmain">'+
						'<div id="resultArea" style="">#resultArea</div>'+
						'<div class="explain">'+
						'深度克隆一个对象'+
						'<br />JS代码<code>'+
						
            		'<p>var source = {name:"tangram",type:"js"}</p>'+
					'<p>var clone =T.object.clone(source);</p>'+
					'<p>clone.name = "tangram-base";</p>'+
					'<p>T.g("resultArea").innerHTML = "source:"+ baidu.json.encode(source) +" ; new clone:"+baidu.json.encode(clone)</p>'+
						
						'</code></div>'+
					'</div>'
		},
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		var source = {name:"tangram",type:"js"}
					var clone =T.object.clone(source);
					clone.name = "tangram-base";
					T.g('resultArea').innerHTML = "source:"+ baidu.json.encode(source) +" ; new clone:"+baidu.json.encode(clone)
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  