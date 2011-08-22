var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.fn.bind'
    },
    
    demoType: [{key: 'default', val: 'baidu.fn.bind'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">该实例演示对函数function doit(txt){alert(txt);}重新绑定作用域并执行的过程，示例代码：var fn = baidu.fn.bind(doit); fn("hello world");</div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            	    function doit(txt){
            	        alert(txt)
            	    }
            	    var fn = baidu.fn.bind(doit);
            	    fn('hello world');
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};