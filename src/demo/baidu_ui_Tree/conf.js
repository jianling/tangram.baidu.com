function getNodes(){
    var tpl = '{id: "#{id}", #{type} text: "#{text}", children: [#{child}] }',
        array = [];
    for(var i = 0; i < 10; i++){
        array.push(baidu.string.format(tpl, {
            id: i,
            type: 'type: "leaf",',//leaf|trunk
            text: '节点' + i,
            child: ''
        }));
    }
    return baidu.string.format(tpl, {
        id: 'root',
        text: '根节点',
        child: array.join(',')
    });
}
var conf = {
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Tree'
    },
    
    demoType: [{key: 'default', val: 'Tree核心例子'}],
    'default': {
        pageConf: {
            options: '{data: '+ getNodes() +', onload: function(evt){evt.target.getRootNode().expandAll();}}',
            target: 'treeId',
            html: '<div id="treeId" style="padding: 50px;"></div>'
        },
        
        btn: {
            type: 'button',
            defaultValue: 'disable'
        }
    },
    groups: {
        'default': [['btn']]
    }
};