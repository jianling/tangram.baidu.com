var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.widget.get',
        dependPackages: ['baidu.widget.create']
    },
    
    demoType: [{key: 'default', val: 'get核心程序'}],
    
    'default': {
        pageConf: {
            html: '<div style="margin:40px 20px;">通过baidu.widget.get来取得一个已经创建过的程序模块<div id="myconsole"></div></div>',
            jsCode: 'baidu.widget.create("mywidget", function(require, exports){baidu.g("myconsole").innerHTML = "mywidget模块已经创建";})'
        },
        createBtn: {
            type: 'button',
            defaultValue: 'get(name)',
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert('取得名称为：' + baidu.widget.get('mywidget').id + '的widget');
                }
            }
        }
    },
    
    groups: {
        'default': [['createBtn']]
    }
};