var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.page.lazyLoadImage'
    },
    
    demoType: [{key: 'default', val: 'baidu.page.lazyLoadImage'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">该方法演示如何延迟加载图片，对于不处在页面可视区的图片将不会被加载</div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
				    T.g('resultArea').innerHTML = '<img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br /><img src="http://img.baidu.com/js/tangram-logo.png"/><br />';
				    T.page.lazyLoadImage();
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  