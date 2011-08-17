var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.page.createStyleSheet'
    },
    
    demoType: [{key: 'default', val: 'createStyleSheet'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">新载入的样式将此段文字设置为红色</div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '载入CSS文件',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		var opt = {
				        document:document,
				        url:'baidu_page_createStyleSheet/loadCssFileTest.css'
				    }
				    baidu.page.createStyleSheet(opt);
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  