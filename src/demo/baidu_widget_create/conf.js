var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.widget.create'
    },
    
    demoType: [{key: 'default', val: 'create核心程序'}],
    
    'default': {
        pageConf: {
            html: '<div style="margin:40px 20px;">通过baidu.widget.create来创建一个程序模块<div id="myconsole"></div></div>'
        },
        createBtn: {
            type: 'button',
            defaultValue: 'create(id, main, opts)',
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(){
                    baidu.widget.create('mywidget', function(require, exports){
                        baidu.g('myconsole').innerHTML = '名称mywidget的模块已经创建';
                    });
                }
            }
        }
    },
    
    groups: {
        'default': [['createBtn']]
    }
};