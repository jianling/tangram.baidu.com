var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.event.un'
    },
    
    demoType: [{key: 'default', val: 'baidu.event.un'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"><input id="buttonId" type="button" value="按钮"/><div id="divId">请点击上面的按钮看看是否已经有事件，再点击左边控制台的执行按钮来执行baidu.event.un来注销事件</div></div>',
            jsCode: 'var handler = function(evt){baidu.g("divId").innerHTML += "<br/>hello world"}; baidu.event.on(baidu.g("buttonId"), "click", handler);'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
					baidu.event.un(baidu.g('buttonId'), 'click', handler);
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};