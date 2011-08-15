var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.empty'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.empty'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea"></div><div id="holder"><div class="child">child1</div><div class="child">child2</div></div>',
			jsCode: 'T.g("resultTextarea").innerHTML="<b>holder\'s children elements:</b>" + T.dom.children("holder")+"<br>"; '
		},
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: 'empty',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					T.dom.empty("holder");
					T.g("resultTextarea").innerHTML='<p id="prompt">After T.dom.empty("holder")...</p>';
					T.g("resultTextarea").innerHTML="<b>holder's children elements:</b>" + T.dom.children("holder")+"<br>"; 
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};