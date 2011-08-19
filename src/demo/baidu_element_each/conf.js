var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.element.each',
        dependPackages: ['baidu.dom.query']
    },
    
    demoType: [{key: 'default', val: 'baidu.element.each'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">可以通过baidu.element的链式调用来使用each，示例代码：baidu.element(baidu.query(".item")).each(function(item){alert(item.innerHTML)});<UL><li class="item">项目1</li><li class="item">项目2</li><li class="item">项目3</li></UL></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            	    baidu.element(baidu.dom.query('.item')).each(function(item){
            	        alert(item.innerHTML);
            	    });
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  