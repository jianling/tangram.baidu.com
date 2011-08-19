var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.object.merge'
    },
    
    demoType: [{key: 'default', val: 'baidu.object.merge'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">合并源对象{a:0,b:1}的属性到目标对象{a:1}</div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '执行',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
					T.g('resultArea').innerHTML +="<br />"+baidu.json.encode( baidu.object.merge({a:1},{a:0,b:1},{overwrite:true}) )
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  