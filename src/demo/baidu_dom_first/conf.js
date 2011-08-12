var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.first'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.first'}],
    'default': {
        pageConf: {
            html: '<div id="holder">&lt;div id="holder"&gt;<div id="first" class="child">first</div><div id="prev" class="child">prev</div><div id="single" class="child">single</div><div id="next" class="child">next</div><div id="last" class="child">last</div>&lt;/div&gt;</div>',
			jsCode: 'var _focus = null;var focus = function(id){ if(_focus){ baidu.dom.removeClass(_focus, "focus"); } _focus = id; baidu.dom.addClass(_focus,"focus"); }'
			},
        formatBtn0: {
            type: 'button',
            defaultValue: 'T.dom.first(\'holder\')',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					focus(baidu.dom.first('holder').id);
                }
            }
        },
        formatBtn1: {
            type: 'button',
            defaultValue: 'T.dom.prev(\'single\')',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					focus(baidu.dom.prev('single').id);
                }
            }
        },
        formatBtn2: {
            type: 'button',
            defaultValue: 'T.dom.next(\'single\')',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					focus(baidu.dom.next('single').id);
                }
            }
        },
        formatBtn3: {
            type: 'button',
            defaultValue: 'T.dom.last(\'holder\')',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					focus(baidu.dom.last('holder').id);
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0', 'formatBtn1', 'formatBtn2', 'formatBtn3']]
    }
};