var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.ajax.form'
    },
    
    demoType: [{key: 'default', val: 'baidu.ajax.form'}],
    'default': {
        pageConf: {
            html: '<div class="Conmain">'+
						'<form action="images/ajaxRequest.php" method="post" id="testForm" style="display:block;height:30px;">'+
					        'X: <input type="text" name="x" value="1" />'+
					        'Y: <input type="text" name="y" value="12" />' +
						'</form>'+
						'<div id="resultArea" style="">#resultArea</div>'+
						'<div class="explain">'+
						'代码执行时，通过获得表单的action和method的值，以ajax提交表单的内容。（此示例仅接受数值类型的值）'+
						'<br />JS代码'+
						'<code>baidu.ajax.form(T.g("testForm"), {onsuccess:function(xhr,responseText) {T.g("resultArea").innerHTML = responseText}})</code>'+
						'<br />PHP代码'+
						'<code>echo "来自服务器端的响应x:".($_REQUEST["x"]-0).",y:".($_REQUEST["y"]-0);</code>'+
						'</div>'+
					'</div>'
        },
        btn1: {
            type: 'button',
            defaultValue: 'ajax提交表单',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		baidu.ajax.form(T.g("testForm"), {
            			async: true,
					    onsuccess:function(xhr,responseText) {
					    	T.g("resultArea").innerHTML = responseText 
					    },
					    onfailure:function(xhr){ 
					    	alert ("请求失败！");
					    }
            		});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  