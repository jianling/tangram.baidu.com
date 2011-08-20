var conf = {
    clazz: {
        type: 'method',
        method: 'baidu.fn.multize'
    },
    
    demoType: [{key: 'default', val: 'baidu.fn.multize'}],
    
    'default': {
        pageConf: {
            html: '<div style="margin: 20px;">将函数集化处理，使处理后的函数的执行返回结果以第一参数为依据，如果第一参数为数组，则返回结果也是一个数组。代码示例：<br/>function doit(c){alert(c);}<br/>var fn = baidu.fn.multize(doit, false);<br/>fn(["hello world-1", "hello world-2", "hello world-3"]);</div>'
        },
        
        btn: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(){
                    function doit(c){
                        alert(c);
                    }
                    var fn = baidu.fn.multize(doit, false);
                    fn(['hello world-1', 'hello world-2', 'hello world-3']);
                }
            }
        }
    },
    
    groups: {
        'default': [['btn']]
    }
}