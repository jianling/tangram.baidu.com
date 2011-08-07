var conf = {
    clazz: {
        type: 'class',//class|method|field
        'class': 'baidu.ui.Carousel'
    },
    demoType: [{key: 'default', val: 'Carousel核心例子'}, {key: 'Carousel$btn', val: 'Carousel按钮例子'}, {key: 'Carousel$cycle', val: 'Carousel循环'}],
    'default': {
        options: '{contentText: [{content: "text~0"}, {content: "text~1"}, {content: "text~2"}, {content: "text~3"}], supportTable: false, isCycle: false, isAutoScroll: false, showButton: false}',
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
                    alert(this.getItem(c).innerHTML);
                }
            }
        },
        scrollIndex: {
            type: 'text',
            defaultValue: '0',
            size: 1,
            maxlength: 1
        },
        scrollOffset: {
            type: 'text',
            defaultValue: '0',
            size: 1,
            maxlength: 1
        },
        scrollDirection: {
            type: 'select',
            defaultValue: 'next',
            data: {
                key: ['next', 'prev'],
                val: ['next', 'prev']
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
    
    
    'Carousel$btn': {
        parameter: '',
        'a': {type: 'select', defaultValue: 'c', data: {key: ['a', 'b', 'c'], val: ['a', 'b', 'c']}, event: {eventName: 'onchange', handler: ''}},
        'b': {type: 'button', defaultValue: 'x', event: {eventName: 'onclick', handler: ''}}
    },
    'Carousel$cycle': {
        paramenter: '',
        'c': {type: 'checkbox', defaultValue: 'a', data: {key: ['a', 'b', 'c'], val: ['a', 'b', 'c']}, event: {eventName: 'onchange', handler: ''}},
        'd': {type: 'button', defaultValue: 'x', event: {eventName: 'onclick', handler: ''}}
    },
    
    groups: {
        'default': [['currentIndex', 'totalCount'], ['itemParam', 'item'], ['scrollIndex', 'scrollOffset', 'scrollDirection', 'scrollTo'], ['prev', 'next'], ['isFirst', 'isLast'], ['focusIndex', 'focus']],
        'Carousel$btn': ['a', 'b'],
        'Carousel$cycle': ['c', 'd']
    }
};