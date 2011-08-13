var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.ajax.request'
    },
    
    demoType: [{key: 'default', val: 'baidu.ajax.request'}],
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
            		baidu.ajax.request('./baidu_ajax_request/request.php', {
            			data: 'x=5&y=2',
            			onsuccess: function(xhr, msg){
	            			T.g('resultArea').innerHTML = '状态 ：' + xhr.status + ' 信息：' + msg;
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