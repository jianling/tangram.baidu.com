var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.url.queryToJson'
    },
    
    demoType: [{key: 'default', val: 'baidu.url.queryToJson'}],
    'default': {
        pageConf: {
            html: '<div id="mydiv">JSON对象与query字符串互相转换</div>'
			//jsCode: 'var getStringForObj = function(obj){var s=[];baidu.object.each(obj,function(val,key){s.push(key+\":\'\"+val+\"\'\");})return \'{\'+s.join()+\'}\';};'
        },
        param0: {
            type: 'text',
            defaultValue: 'name=John&age=30',
            size: 60,
            maxlength: 80
        },
        formatBtn: {
            type: 'button',
            defaultValue: 'Query到JSON',
            depend: ['param0'],
            event: {
                eventName: 'onclick',
                handler: function(arg0){
					var oJson = baidu.url.queryToJson(arg0);
					var getStringForObj = function(obj){
						var s=[];
						baidu.object.each(obj,function(val,key){
							s.push(key+":'"+val+"'");
						})
						return '{'+s.join()+'}';
					}
                    baidu.dom.g('mydiv').innerHTML = '转换后的JSON：' + getStringForObj(oJson);
                }
            }
        }
    },
    
    groups: {
        'default': [['param0', 'formatBtn']]
    }
};