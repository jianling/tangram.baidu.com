var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.trim'
    },
    
    demoType: [{key: 'default', val: 'baidu.json.trim'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>直接写入效果：<br /><div id="insert"></div>转换后写入效果:<br /><div id="wbrinsert"></div>'
        },
        dateInput: {
        	label: '输入字符：',
            type: 'text',
            defaultValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789',
            size: 30
        },
        btn1: {
            type: 'button',
            defaultValue: '转换',
            depend: ['dateInput'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		T.g('resultArea').innerHTML = '转换后的源代码为：<br />';
            		var textarea = document.createElement("textarea");
            		textarea.cols = 50;
            		textarea.rows = 5;
            		textarea.value = baidu.string.wbr(arg0);
            		T.g('resultArea').appendChild(textarea);
            		baidu.dom.insertHTML('insert','afterBegin', arg0);
            		baidu.dom.insertHTML('wbrinsert','afterBegin', baidu.string.wbr(arg0));
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['btn1']]
    }
};  