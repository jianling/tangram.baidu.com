var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.date.parse'
    },
    
    demoType: [{key: 'default', val: 'baidu.date.parse'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        date1: {
            type: 'text',
            defaultValue: '2010/5/10',
            size: 20
        },
        date2: {
            type: 'text',
            defaultValue: 'July,2010,3,23:',
            size: 20
        },
        date3: {
            type: 'text',
            defaultValue: 'Tuesday November 9 1996 7:30 PM',
            size: 20
        },
        date4: {
            type: 'text',
            defaultValue: '2010-01-01 12:23:39',
            size: 20
        },
        btn1: {
            type: 'button',
            defaultValue: 'parse',
            depend: ['date1'],
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
					T.g('resultArea').innerHTML += T.date.parse(arg0) + '<br />';
            	}
            }
        },
        btn2: {
            type: 'button',
            defaultValue: 'parse',
            depend: ['date2'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		T.g('resultArea').innerHTML += T.date.parse(arg0) + '<br />';
            	}
            }
        },
        btn3: {
            type: 'button',
            defaultValue: 'parse',
            depend: ['date3'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		T.g('resultArea').innerHTML += T.date.parse(arg0) + '<br />';
            	}
            }
        },
        btn4: {
            type: 'button',
            defaultValue: 'parse',
            depend: ['date4'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		T.g('resultArea').innerHTML += T.date.parse(arg0) + '<br />';
            	}
            }
        }
    },
    
    groups: {
        'default': [['date1', 'btn1'],['date2', 'btn2'],['date3', 'btn3'],['date4', 'btn4']]
    }
};