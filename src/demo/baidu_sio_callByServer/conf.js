var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.sio.callByServer'
    },
    
    demoType: [{key: 'default', val: 'baidu.sio.callByServer'}],
    'default': {
        pageConf: {
            html: '<p>服务器返回"var responseName = tom;"</p><div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		baidu.sio.callByServer('./baidu_sio_callByServer/request.php', 'localFunction');
            		window['localFunction'] = function(){
            			T.g('resultArea').innerHTML = 'responseName=' + responseName;
            		}
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  