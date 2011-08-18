var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.ajax.post'
    },
    
    demoType: [{key: 'default', val: 'baidu.ajax.post'}],
    'default': {
        pageConf: {
            html: '<div class="Conmain">'+
						'<form style="display:block;height:30px;">'+
					        '附加参数: <input type="text" id="GetValue" value="x=3&y=4" />'+
						'</form>'+
						'<div id="resultArea" style="">#resultArea</div>'+
						'<div class="explain">'+
						'用ajax请求一个URL（POST方式），将参数。并且得到返回值。（此示例仅接受数值类型的值）'+
						'<br />JS代码'+
						'<code>baidu.ajax.get("images/ajaxRequest.php",baidu.dom.g("GetValue").value, function(xhr, msg){T.g("resultArea").innerHTML = "状态 ：" + xhr.status + " 返回信息：" + msg;});</code>'+
						'<br />PHP代码'+
						'<code>echo "来自服务器端的响应x:".($_REQUEST["x"]-0).",y:".($_REQUEST["y"]-0);</code>'+
						'</div>'+
					'</div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '发送请求',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		baidu.ajax.post("images/ajaxRequest.php",baidu.dom.g("GetValue").value, function(xhr, msg){
	            			T.g("resultArea").innerHTML = "状态 ：" + xhr.status + " 返回信息：" + msg;
            		});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  