var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.each'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.each'}],
    'default': {
        pageConf: {
            html:	'<div class="Conmain">'+
						'<div id="resultArea">结果为：</div>'+
						'<div class="explain">'+
						'遍历出数组所有的元素'+
						'<br />JS代码'+
						'<code>var input = ["one", "two", "three"];<br />T.array.each(input, function(item, i){'+
						'<br />baidu.dom.g("resultArea").innerHTML += i+" is :"+item+"  ,";'+
						'<br />})</code>'+
						'</div>'+
					'</div>'
        },
        formatBtn: {
            type: 'button',
            depend: [],
            defaultValue: 'GO',
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(){
                	var input = ["one", "two", "three"];
					T.array.each(input, function(item, i){
						baidu.dom.g('resultArea').innerHTML +=  i+" is :"+item+"  ,";
					});
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};