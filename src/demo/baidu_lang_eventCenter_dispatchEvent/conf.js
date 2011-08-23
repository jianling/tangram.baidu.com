var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.eventCenter.dispatchEvent'
    },
    
    demoType: [{key: 'default', val: 'dispatchEvent'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"><h2 id="element">点击这里</h2></div>'
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
        		    baidu.lang.eventCenter.addEventListener("myclick",myclick);
        		    T.event.on('element',"click",function(){
                        baidu.lang.eventCenter.dispatchEvent("myclick");
                    });
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  