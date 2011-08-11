var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.swf.createHTML'
    },
    
    demoType: [{key: 'default', val: 'baidu.swf.createHTML'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        dateInput: {
        	label: '输入配置：',
            type: 'text',
            defaultValue: "{id: 'flash',url: './baidu_swf_createHTML/test.swf',width:200,height:150}",
            size: 40
        },
        btn1: {
            type: 'button',
            defaultValue: '生成HTML片段',
            depend: ['dateInput'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		var code = baidu.swf.createHTML(eval('(' + arg0 + ')'));
            		var area = document.createElement('textarea');
            		area.cols = 50;
            		area.rows = 10;
            		area.value = code;
            		T.g('resultArea').appendChild(area);
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['btn1']]
    }
};  