var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.ajax.get'
    },
    
    demoType: [{key: 'default', val: 'baidu.ajax.get'}],
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
            		baidu.ajax.get('./baidu_ajax_get/request.php?x=5&y=2', function(xhr, msg){
	            		T.g('resultArea').innerHTML = unescape('%20%u4FE1%u606F%uFF1A') + xhr.status + unescape('%20%20%u4FE1%u606F%uFF1A') + msg;
            		});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  