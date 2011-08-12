var conf = {
    clazz: {
        type: 'field',
        'field': 'baidu.platform'
    },
    
    demoType: [{key: 'default', val: 'baidu.platform'}],
    'default': {
        pageConf: {
            html: '<div id="mydiv">判断是何种平台[Windows,Android,iPad,iPhone,Macintosh,X11]</div><div id="result"></div>'
        },
        formatBtn: {
            type: 'button',
            defaultValue: '判断平台',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					var platform = '';
					switch(true)
					{
						case baidu.platform.isWindows:
							platform = 'Windows';
							break;
						case baidu.platform.isAndroid:
							platform = 'Android';
							break;
						case baidu.platform.isIpad:
							platform = 'iPad';
							break;
						case baidu.platform.isIphone:
							platform = 'iPhone';
							break;
						case baidu.platform.isMacintosh:
							platform = 'Macintosh';
							break;
						case baidu.platform.isX11:
							platform = 'X11';
							break;
					}
                    baidu.dom.g('result').innerHTML = '您当前的平台：' + platform;
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};