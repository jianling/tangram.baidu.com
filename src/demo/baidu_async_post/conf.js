var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.async.post'
    },
    
    demoType: [{key: 'default', val: 'baidu.async.post'}],
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
            		baidu.async.post('./baidu_async_post/request.php', 'x=5&y=2').then(
            			function(obj){
            				T.g('resultArea').innerHTML = obj.responseText;
            			}, function(obj){
            				T.g('resultArea').innerHTML = '请求失败';
            			}
            		);
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  