var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.swf.create'
    },
    
    demoType: [{key: 'default', val: 'baidu.swf.create'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"><object width="200" height="150" align="middle" id="flash" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"><param value="./baidu_swf_create/test.swf" name="movie"><embed width="200" height="150" align="middle" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" name="flash" src="./baidu_swf_create/test.swf"></object></div>'
        },
        dateInput1: {
        	label: '宽：',
            type: 'text',
            defaultValue: "300",
            size: 5
        },
        dateInput2: {
        	label: '高：',
            type: 'text',
            defaultValue: "200",
            size: 5
        },
        btn1: {
            type: 'button',
            defaultValue: '设置影片尺寸',
            depend: ['dateInput1', 'dateInput2'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0, arg1){
            		var movie = baidu.swf.getMovie("flash");
            		movie.width = arg0;
            		movie.height = arg1;
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput1', 'dateInput2'], ['btn1']]
    }
};  