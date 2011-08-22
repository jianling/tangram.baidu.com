var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.Event'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.Event'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">自定义的事件对象，引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。</div>'
        }
    },
    groups: {
        'default': []
    }
};  