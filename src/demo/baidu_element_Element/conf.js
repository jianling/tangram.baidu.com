var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.element.Element',
        dependPackages: ['baidu.dom.setStyle']
    },
    
    demoType: [{key: 'default', val: 'baidu.element.Element'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">所有扩展的链式调用的方法都会放在这个Element中，可以通过Element来做键式调用，示例代码baidu.element(baidu.g(id)).setStyle("background", "pink");<div id="elementId" style="border:gray solid 1px; width: 200px; height:50px; margin: 10px;">this is container</div></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: 'Element示例',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            	    baidu.element('elementId').setStyle('background', 'pink');
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  