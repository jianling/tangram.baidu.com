var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.each'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.each'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">结果为：</div>'
        },
        formatBtn: {
            type: 'button',
            depend: [],
            defaultValue: 'GO',
            event: {
                eventName: 'onclick',
                handler: function(){
                	var input = ["one", "two", "three"];
					T.array.each(input, function(item, i){
						baidu.dom.g('resultArea').innerHTML += item+"  ";
					});
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};