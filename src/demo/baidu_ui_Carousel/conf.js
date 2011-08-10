function getItems(){
    var tplItem = '{content: "<img src=\'#{src}\'/>"}',
        array = [];
    for(var i = 0; i < 9; i++){
        array.push(baidu.string.format(tplItem, {
            src: 'baidu_ui_Carousel/' + i + '.png'
        }));
    }
    return 'contentText: [' + array.join(',') + ']';
}
var conf= {
    clazz: {
        type: 'class',//class|method|field
        'class': 'baidu.ui.Carousel'
    },
    demoType: [{key: 'default', val: 'Carousel核心例子'}],
    'default': {
        pageConf: {
            options: '{'+ getItems() +', supportTable: false, isCycle: false, isAutoScroll: false, showButton: true, btnLabel: {prev: "&nbsp;", next: "&nbsp;"}}',
            target: 'carouselId',
            html: '<div id="carouselId" style="width:520px; height:150px; padding: 50px;"></div>'
        },
        currentIndex: {
            type: 'button',
            defaultValue: 'getCurrentIndex()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert(this.getCurrentIndex());
                }
            }
        },
        totalCount: {
            type: 'button',
            defaultValue: 'getTotalCount()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    alert(this.getTotalCount());
                }
            }
        },
        itemParam: {
            label: 'index：',
            type: 'text',
            defaultValue: '0',
            size: 1,
            maxlength: 1
        },
        item: {
            type: 'button',
            defaultValue: 'getItem(index)',
            depend: ['itemParam'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    var item = this.getItem(c);
                    item ? alert(item.innerHTML)
                        : alert(c + '对于节点还未滚动到可视区');
                }
            }
        },
        scrollIndex: {
            type: 'text',
            defaultValue: '2',
            size: 1,
            maxlength: 1
        },
        scrollOffset: {
            type: 'text',
            defaultValue: '1',
            size: 1,
            maxlength: 1
        },
        scrollDirection: {
            type: 'select',
            defaultValue: '',
            data: {
                key: ['自动', 'next', 'prev'],
                val: ['', 'next', 'prev']
            }
        },
        scrollTo: {
            type: 'button',
            defaultValue: 'scrollTo(a, b, c)',
            depend: ['scrollIndex', 'scrollOffset', 'scrollDirection'],
            event: {
                eventName: 'onclick',
                handler: 'scrollTo'
            }
        },
        prev: {
            type: 'button',
            defaultValue: 'prev()',
            event: {
                eventName: 'onclick',
                handler: 'prev'
            }
        },
        next: {
            type: 'button',
            defaultValue: 'next()',
            event: {
                eventName: 'onclick',
                handler: 'next'
            }
        },
        isFirst: {
            type: 'button',
            defaultValue: 'isFirst()',
            event: {
                eventName: 'onclick',
                handler: function(){alert(this.isFirst());}
            }
        },
        isLast: {
            type: 'button',
            defaultValue: 'isLast()',
            event: {
                eventName: 'onclick',
                handler: function(){alert(this.isLast());}
            }
        },
        focusIndex: {
            type: 'text',
            defaultValue: '0',
            size: 1,
            maxlength: 1
        },
        focus: {
            type: 'button',
            defaultValue: 'focus(index)',
            depend: ['focusIndex'],
            event: {
                eventName: 'onclick',
                handler: 'focus'
            }
        }
    },
    
    groups: {
        'default': [['currentIndex', 'totalCount'], ['itemParam', 'item'], ['scrollIndex', 'scrollOffset', 'scrollDirection', 'scrollTo'], ['prev', 'next'], ['isFirst', 'isLast'], ['focusIndex', 'focus']]
    }
};