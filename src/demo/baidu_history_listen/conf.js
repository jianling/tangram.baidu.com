var conf = {
    clazz: {
        type: 'method',
        method: 'baidu.history.listen'
    },
    
    demoType: [{key: 'default', val: 'baidu.history.listen'}],
    
    'default': {
        pageConf: {
            html: '<div style="margin:20px;"><input type="button" value="add history" onclick="addHistory();"/><br/><br/>history说明：<br/>通过hash值来记录页面的状态。<br/>通过js改变hash的时候，浏览器会增加历史记录，并且执行回调函数。<br/>点击“前进/后退”时，浏览器会根据历史记录更新hash值，并执行回调函数。<br/>回调函数在执行时，可以获取当前url的hash值，并根据hash值的不同进行不同的处理。<br/></div>',
            jsCode: 'var ident = 0; function addHistory(){location.hash = ident++;}'
        },
        
        btn: {
            type: 'button',
            defaultValue: 'listen(callback)',
            
            event: {
                eventName: 'onclick',
                handler: function(){
                    baidu.history.listen(function(){
                        alert('callback hash = ' + location.hash);
                    });
                    baidu.g('btn').disabled = true;
                }
            }
        }
    },
    
    groups: {
        'default': [['btn']]
    }
};