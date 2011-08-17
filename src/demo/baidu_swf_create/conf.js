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
        dateInput: {
        	label: '输入配置：',
            type: 'text',
            defaultValue: "{id: 'flash',url: './baidu_swf_create/test.swf',width:360,height:270}",
            size: 21
        },
        btn1: {
            type: 'button',
            defaultValue: '载入flash',
            depend: ['dateInput'],
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		baidu.swf.create(eval('(' + arg0 + ')'), 'resultArea');
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['btn1']]
    }
};  