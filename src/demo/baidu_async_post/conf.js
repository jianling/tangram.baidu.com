var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.async.post'
    },
    
    demoType: [{key: 'default', val: 'baidu.async.post'}],
    'default': {
        pageConf: {
            html:'<div class="Conmain">'+
						'<div id="resultArea" style="">#resultArea</div>'+
						'<div class="explain">'+
						'与ajax不同的是可以支持链式调用。（此示例仅接受数值类型的值）'+
						'<br />JS代码'+
						'<code>'+
						
						'<p>baidu.async.post( "images/ajaxRequest.php", 1"x=5&y=2").then(</p>'+
							'<p>  function(obj){T.g("resultArea").innerHTML = obj.responseText;},</p>'+
							'<p>  function(obj){T.g("resultArea").innerHTML = "请求失败";}</p>'+
						'<p>);</p>'+
						
						
						'</code>'+
						'<br />PHP代码'+
						'<code>echo "来自服务器端的响应x:".($_REQUEST["x"]-0).",y:".($_REQUEST["y"]-0);</code>'+
						'</div>'+
					'</div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '正确地址请求',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		baidu.async.post('images/ajaxRequest.php','x=5&y=2').then(
            			function(obj){
            				T.g('resultArea').innerHTML = obj.responseText;
            			},function(obj){
            				T.g('resultArea').innerHTML = '请求失败';
            			}
            		);
            	}
            }
        },
        btn2: {
            type: 'button',
            defaultValue: '错误地址请求',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		baidu.async.post('images/error.php','x=5&y=2').then(
            			function(obj){
            				T.g('resultArea').innerHTML = obj.responseText;
            			},function(obj){
            				T.g('resultArea').innerHTML = '请求失败';
            			}
            		);
            	}
            }
        }
    },
    groups: {
        'default': [['btn1','btn2']]
    }
};  