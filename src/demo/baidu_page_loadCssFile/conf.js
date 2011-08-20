var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.page.loadCssFile'
    },
    
    demoType: [{key: 'default', val: 'baidu.page.loadCssFile'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">该实例将演示从服务器加载loadCssFileTest.css空文件，加载完成后将执行回调来表示已经加载完毕</div>'
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