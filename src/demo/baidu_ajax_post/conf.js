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
	            			T.g('resultArea').innerHTML = '状态 ：' + xhr.status + ' 信息：' + msg;
            		});
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  