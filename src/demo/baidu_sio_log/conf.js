var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.sio.log'
    },
    
    demoType: [{key: 'default', val: 'baidu.sio.log'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击发送log',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		baidu.sio.log('./baidu_sio_log/request.php');
        			T.g('resultArea').innerHTML = '日志已发送';
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  