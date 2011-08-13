var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.ajax.form'
    },
    
    demoType: [{key: 'default', val: 'baidu.ajax.form'}],
    'default': {
        pageConf: {
            html: '<form action="./baidu_ajax_form/request.php" method="post" id="testForm">' +
					'<table>' +
					    '<tr>' +
					        '<td>用户名：</td>' +
					        '<td><input type="text" name="x" value="tom" /></td>' +
					    '</tr>' +
					    '<tr>' +
					        '<td>年龄：</td>' +
					        '<td><input type="text" name="y" value="12" /></td>' +
					    '</tr>' +
					    '</table>' +
					'</form><div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: 'ajax提交表单',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		baidu.ajax.form(T.g('testForm'), {
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