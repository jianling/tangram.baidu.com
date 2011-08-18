var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.ajax.request'
    },
    
    demoType: [{key: 'default', val: 'baidu.ajax.request'}],
    'default': {
        pageConf: {
            html: '<div class="Conmain">'+
						'<form style="display:block;height:30px;">'+
					        '配置#OPT: <input type="text" size="40" id="OPT" value="{method:\'post\',async:\'true\',data:\'x=5&y=6\'}" />'+
						'</form>'+
						'<div id="resultArea" style="">#resultArea</div>'+
						'<div class="explain">'+
						'ajax的高级用法，可以灵活的使用参数来与后台交互。（此示例仅接受数值类型的值）'+
						'<br />JS代码'+
						'<code>'+
						'<p>var opt = baidu.json.decode(OPT.value);</p>'+
						'<p>opt.onsuccess = function(xhr, msg){T.g("resultArea").innerHTML = "状态 ：" + xhr.status + " 返回信息：" + msg;}</p>'+
						'<p>baidu.ajax.request("images/ajaxRequest.php",opt);</p>'+
						'</code>'+
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
					var opt = baidu.json.decode(OPT.value);
					opt.onsuccess = function(xhr, msg){T.g("resultArea").innerHTML = "状态 ：" + xhr.status + " 返回信息：" + msg;}
            		baidu.ajax.request("images/ajaxRequest.php",opt);
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  