var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.eventCenter.removeEventListener'
    },
    
    demoType: [{key: 'default', val: 'removeEventListener'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"><h2 id="element">点击这里触发</h2><button id="button">移除事件监听</button></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            	    function myclick(){
            	        alert('you click me');
            	    }
        		    baidu.lang.eventCenter.addEventListener("myclick", myclick, "e_click");
        		    T.event.on('element',"click",function(){
                        baidu.lang.eventCenter.dispatchEvent("myclick");
                    });
                    T.event.on('button',"click",function(){
                        baidu.lang.eventCenter.removeEventListener("myclick", "e_click");
                    });
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  