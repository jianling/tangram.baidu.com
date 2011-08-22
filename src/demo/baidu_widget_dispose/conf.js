var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.widget.dispose',
        dependPackages: ['baidu.widget.create']
    },
    
    demoType: [{key: 'default', val: 'dispose核心程序'}],
    
    'default': {
        pageConf: {
            html: '<div style="margin:40px 20px;">通过baidu.widget.dispose来销毁一个已经创建的程序模块<div id="myconsole"></div></div>',
            jsCode: 'baidu.widget.create("mywidget", function(require, exports){baidu.g("myconsole").innerHTML = "mywidget模块已经创建"}, {dispose: function(){baidu.g("myconsole").innerHTML = "mywidget模块已经 销毁"}});'
        },
        createBtn: {
            type: 'button',
            defaultValue: 'dispose()',
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(){
                    baidu.widget.dispose('mywidget');
                }
            }
        }
    },
    
    groups: {
        'default': [['createBtn']]
    }
};