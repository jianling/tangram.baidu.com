var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.widget.load'
    },
    
    demoType: [{key: 'default', val: 'getPath核心程序'}],
    
    'default': {
        pageConf: {
            html: '<div style="margin:40px 20px;">通过baidu.widget.load来装载一个外部的mywidget.js模块，模块内容为弹出窗口显示hello world。<div id="myconsole"></div></div>'
        },
        createBtn: {
            type: 'button',
            defaultValue: 'load(widgets, executer)',
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(){
                    baidu.widget.load('baidu_widget_load/mywidget', function(require){
                        baidu.g('myconsole').innerHTML = '模块装载完成';
                    });
                }
            }
        }
    },
    
    groups: {
        'default': [['createBtn']]
    }
};