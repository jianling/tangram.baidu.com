var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.element.extend'
    },
    
    demoType: [{key: 'default', val: 'baidu.element.extend'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">通过extend来在原有基础上做扩展，示例代码：baidu.element.extend({myFunction: function(){alert("hello world")}}); baidu.element(id).myFunction();<div id="containerId"></div></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		baidu.element.extend({
            		    myFunction: function(){
            		        alert('hello world');
            		    }
            		});
            		baidu.element('containerId').myFunction();
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  