var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.browser'
    },
    
    demoType: [{key: 'default', val: 'baidu.browser'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">结果为：</div>'
        },
        formatBtn: {
            type: 'button',
            defaultValue: '执行',
            depend: [],
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
                	var bs = ['chrome','firefox','ie','isGecko','isStrict','isWebkit','maxthon','opera','safari'];
					var html = []
					for(var i=0;i<bs.length;i++){
					    html.push(    '<tr><td>T.browser.'+bs[i]+'</td><td>'+T.browser[bs[i]]+'</td></td>'    )
					}
					var html = '<table width="80%">'+html.join(' ')+'</table>'
					T.g("resultArea").innerHTML = unescape("%u7ED3%u679C%u4E3A%uFF1A") + '<br>'+html;
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};