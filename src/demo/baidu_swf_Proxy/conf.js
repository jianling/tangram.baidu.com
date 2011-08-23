var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.swf.create'
    },
    
    demoType: [{key: 'default', val: 'baidu.swf.create'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"><object width="100%" height="160" align="middle" id="test" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"><param value="transparent" name="wmode"><param value="always" name="allowscriptaccess"><param value="./baidu_swf_Proxy/line.swf" name="movie"><embed width="100%" height="160" align="middle" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" name="test" src="./baidu_swf_Proxy/line.swf" allowscriptaccess="always" ver="9.0.0" errormessage="载入FLASH出错" wmode="transparent"></object></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '给Flash传递数据',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		function flashLoaded() {   
					    baidu.ajax.get('./baidu_swf_Proxy/two_line.json', function(xhr){
					        var data = baidu.json.decode(xhr.responseText);
					        if (data) {
					          proxy.call("setFlashLineData", data, 1);
					        }
					      });  
					}
					var proxy = new T.swf.Proxy("test", "setFlashLineData", flashLoaded);
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  