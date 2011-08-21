function getNodes(){
    var tpl = '{id: "#{id}", type:"#{type}", text: "#{text}", children: [#{child}] }',
        array = [];
    function node(id, type, txt, child){
        return baidu.string.format(tpl, {
            id: id,
            type: type,
            text: txt,
            child: child ? child : ''
        });
    }
    for(var i = 0; i < 5; i++){
        var type = i < 2 ? 'trunk' : 'leaf',
            child = [];
        if(i < 2){
            for(var j = 0; j < 3; j++){
                child.push(node('rsid' + i + j, 'leaf', '子节点-' + i + '-' + j + '(节点id: rsid'+ i + j +')'));
            }
        }
        array.push(node('rsid' + i, type, '节点-' + i + '(节点id：rsid'+ i +')', child.join(',')));
    }
    
   return baidu.string.format(tpl, {
        id: 'root',
        text: '根节点',
        child: array.join(',')
    });
}
function getTreeNode(c){
    return this.getTreeNodeById(c || 'rsid0');
}
var conf = {
    clazz: {
        type: 'class',
        'class': 'baidu.ui.Tree'
    },
    
    demoType: [{key: 'treeNode', val: 'TreeNode（以\"节点-0\"为例）'}],
    'default': {
        pageConf: {
            options: '{data: '+ getNodes() +', onload: function(evt){evt.target.getRootNode().expandAll();}}',
            target: 'treeId',
            html: '<div id="treeId" style="padding: 50px;"></div>'
        },
        
        getRootNode: {
            type: 'button',
            defaultValue: 'getRootNode()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert(this.getRootNode().text);
                }
            }
        },
        
        getCurrentNode: {
            type: 'button',
            defaultValue: 'getCurrentNode()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    var current = this.getCurrentNode();
                    alert(current ? current.text : '请选择一个节点');
                }
            }
            
        },
        
        getTreeNodes: {
            type: 'button',
            defaultValue: 'getTreeNodes()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    var map = baidu.object.keys(this.getTreeNodes());
                    alert('总共有 ' + map.length + ' 个节点');
                }
            }
        },
        
        treeNodeId: {
            type: 'text',
            defaultValue: 'rsid0',
            size: 2,
            maxlength: 10
        },
        
        getTreeNodeById: {
            type: 'button',
            defaultValue: 'getTreeNodeById()',
            depend: ['treeNodeId'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    var node = getTreeNode.call(this, c);
                    alert(node ? node.text : '没有该节点，请检查id是否正确');
                }
            }
        }
    },
    
    treeNode: {
        pageConf: {
            options: '{data: '+ getNodes() +', onload: function(evt){evt.target.getRootNode().expandAll();}}',
            target: 'treeId',
            html: '<div id="treeId" style="padding: 50px;"></div>'
        },
        
        getParentNode: {
            type: 'button',
            defaultValue: 'getParent()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert(getTreeNode.call(this).getParentNode().text);
                }
            }
        },
        
        getTree: {
            type: 'button',
            defaultValue: 'getTree()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert(getTreeNode.call(this).getTree());
                }
            }
        },
        
        getChildNodes: {
            type: 'button',
            defaultValue: 'getChildNodes()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert('节点-0 总共有 ' + getTreeNode.call(this).getChildNodes().length + ' 个子节点');
                }
            }
        },
        
        isParentId: {
            type: 'text',
            defaultValue: 'root',
            size: 2,
            maxlength: 50
        },
        
        isParent: {
            type: 'button',
            defaultValue: 'isParent(node)',
            depend: ['isParentId'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    alert(getTreeNode.call(this).isParent(getTreeNode.call(this, c)));
                }
            }
        },
        
        appendToId: {
            type: 'text',
            defaultValue: 'root',
            size: 2,
            maxlength: 50
        },
        
        appendTo: {
            type: 'button',
            defaultValue: 'appendTo(parentNode)',
            depend: ['appendToId'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    var parent = getTreeNode.call(this, c),
                        current = getTreeNode.call(this);
                    current.appendTo(parent);
                }
            }
        },
        
        moveToId: {
            type: 'text',
            defaultValue: 'rsid10',
            size: 2,
            maxlength: 50
        },
        
        moveTo: {
            type: 'button',
            defaultValue: 'moveTo(node)',
            depend: ['moveToId'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    getTreeNode.call(this).moveTo(getTreeNode.call(this, c));
                }
            }
        },
        
        appendChild: {
            type: 'button',
            defaultValue: 'appendChild(treeNode, index)',
            event: {
                eventName: 'onclick',
                handler: function(){
                    var rsid = baidu.lang.guid();
                    getTreeNode.call(this).appendChild(new baidu.ui.Tree.TreeNode({
                        id: rsid,
                        type: 'leaf',
                        text: '新节点(节点id：'+ rsid +')'
                    }));
                }
            }
        },
        
        removeAllChildren: {
            type: 'button',
            defaultValue: 'removeAllChildren',
            event: {
                eventName: 'onclick',
                handler: function(){
                    getTreeNode.call(this).removeAllChildren();
                }
            }
        },
        
        removeChildId: {
            type: 'text',
            defaultValue: 'rsid00',
            size: 2,
            maxlength: 50
        },
        
        removeChild: {
            type: 'button',
            defaultValue: 'removeChild',
            depend: ['removeChildId'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    getTreeNode.call(this).removeChild(getTreeNode.call(this, c));
                }
            }
        },
        
        expand: {
            type: 'button',
            defaultValue: 'expand()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    getTreeNode.call(this).expand();
                }
            }
        },
        
        collapse: {
            type: 'button',
            defaultValue: 'collapse()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    getTreeNode.call(this).collapse();
                }
            }
        },
        
        toggle: {
            type: 'button',
            defaultValue: 'toggle()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    getTreeNode.call(this).toggle();
                }
            }
        },
        
        blur: {
            type: 'button',
            defaultValue: 'blur()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    getTreeNode.call(this).blur();
                }
            }
        },
        
        focus: {
            type: 'button',
            defaultValue: 'focus()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    getTreeNode.call(this).focus();
                }
            }
        },
        
        hide: {
            type: 'button',
            defaultValue: 'hide()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    getTreeNode.call(this).hide();
                }
            }
        },
        
        show: {
            type: 'button',
            defaultValue: 'show()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    getTreeNode.call(this).show();
                }
            }
        },
        
        expandAll: {
            type: 'button',
            defaultValue: 'expandAll()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    this.getRootNode().expandAll();
                }
            }
        },
        
        collapseAll: {
            type: 'button',
            defaultValue: 'collapseAll()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    this.getRootNode().collapseAll();
                }
            }
        },
        
        getIndex: {
            type: 'button',
            defaultValue: 'getIndex()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert('节点-0的索引是：' + getTreeNode.call(this).getIndex());
                }
            }
        },
        //
        getNext: {
            type: 'button',
            defaultValue: 'getNext()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert('节点-0的下一个节点是：' + getTreeNode.call(this).getNext().text);
                }
            }
        },
        
        getPrevious: {
            type: 'button',
            defaultValue: 'getPrevious()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert('节点-1的上一个节点是：' + getTreeNode.call(this, 'rsid1').getPrevious().text);
                }
            }
        },
        getFirstChild: {
            type: 'button',
            defaultValue: 'getFirstChild()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert('节点-0的首个子节点是：' + getTreeNode.call(this).getFirstChild().text);
                }
            }
        },
        
        getLastChild: {
            type: 'button',
            defaultValue: 'getLastChild()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert('节点-0的末个子节点是：' + getTreeNode.call(this).getLastChild().text);
                }
            }
        },
        isLastNode: {
            type: 'button',
            defaultValue: 'isLastNode()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert('节点-0的是否末节点：' + getTreeNode.call(this).isLastNode());
                }
            }
        }
       
    },
    
    
    
    groups: {
        'default': [['getRootNode', 'getCurrentNode', 'getTreeNodes'], ['treeNodeId', 'getTreeNodeById']],
        treeNode: [
            ['getTree', 'getParentNode'],
            ['getChildNodes'], ['isParentId', 'isParent'],
            ['appendToId', 'appendTo', 'moveToId', 'moveTo', 'appendChild'],
            ['removeAllChildren'],
            ['removeChildId', 'removeChild'],
            ['expand', 'collapse', 'toggle'],
            ['blur', 'focus', 'hide', 'show', 'expandAll', 'collapseAll'],
            ['getIndex', 'getNext', 'getPrevious', 'getFirstChild', 'getLastChild', 'isLastNode']
        ]
    }
};