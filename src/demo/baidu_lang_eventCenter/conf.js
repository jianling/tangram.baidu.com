var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.eventCenter'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.eventCenter'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>',
            jsCode: 'function myclick(){ alert("this is my test click"); } baidu.lang.eventCenter.addEventListener("myclick",myclick);'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
						baidu.lang.eventCenter.dispatchEvent("myclick");
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  