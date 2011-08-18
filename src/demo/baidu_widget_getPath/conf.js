var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.widget.get',
        dependPackages: ['baidu.widget.create']
    },
    
    demoType: [{key: 'default', val: 'getPath核心程序'}],
    
    'default': {
        pageConf: {
            html: '<div style="margin:40px 20px;">通过baidu.widget.getPath来取得一个已经创建程序模块的路径<div id="myconsole"></div></div>',
            jsCode: 'baidu.widget.create("mywidget", function(require, exports){baidu.g("myconsole").innerHTML = "mywidget模块已经创建"})'
        },
        createBtn: {
            type: 'button',
            defaultValue: 'getPath(name)',
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert('取得路径为：' + baidu.widget.getPath('mywidget'));
                }
            }
        }
    },
    
    groups: {
        'default': [['createBtn']]
    }
};