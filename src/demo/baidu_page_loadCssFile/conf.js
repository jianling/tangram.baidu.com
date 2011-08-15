var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.page.loadCssFile'
    },
    
    demoType: [{key: 'default', val: 'baidu.page.loadCssFile'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '加载CSS文件',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
					baidu.page.loadCssFile('./baidu_page_loadCssFile/loadCssFileTest.css');
					T.g('resultArea').innerHTML = 'CSS文件加载完毕';
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};