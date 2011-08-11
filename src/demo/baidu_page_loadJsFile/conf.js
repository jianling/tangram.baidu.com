var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.page.loadJsFile'
    },
    
    demoType: [{key: 'default', val: 'baidu.page.loadJsFile'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '加载JS文件',
            event: {
            	eventName: 'onclick',
            	handler: function(){
					baidu.page.loadJsFile('./baidu_page_loadJsFile/loadJsFileTest.js');
					T.g('resultArea').innerHTML = 'JS文件加载完成';
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};