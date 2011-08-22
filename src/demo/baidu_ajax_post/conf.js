var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.ajax.post'
    },
    
    demoType: [{key: 'default', val: 'baidu.ajax.post'}],
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
            	handler: function(){
            		baidu.ajax.post('./baidu_ajax_post/request.php', 'x=5&y=2', function(xhr, msg){
	            			T.g('resultArea').innerHTML = unescape('%u72B6%u6001%20%uFF1A') + xhr.status + ' ' + unescape('%u4FE1%u606F%uFF1A') + msg;
            		});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  