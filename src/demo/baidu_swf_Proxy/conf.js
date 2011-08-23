var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.swf.create'
    },
    
    demoType: [{key: 'default', val: 'baidu.swf.create'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '给Flash传递数据',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            	    baidu.swf.create({      
                        id:"test",      
                        url: "./baidu_swf_Proxy/line.swf",      
                        width:"100%",      
                        height:"160",      
                        wmode : "transparent",      
                        errorMessage:"载入FLASH出错",      
                        ver:"9.0.0",      
                        allowscriptaccess:"always"    
                    },"resultArea");

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