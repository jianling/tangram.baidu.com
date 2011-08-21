var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.array.hash'
    },
    
    demoType: [{key: 'default', val: 'baidu.array.hash'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">KEY数组为：[1,2,3,4,5]，VAL数组为：["a","b","c","d","e"]，取得合并后的对象hashObj，中KEY为3的元素，</div>'
        },
        formatBtn: {
            type: 'button',
            defaultValue: '执行',
            depend: [],
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(arg0, arg1){
                	var numArr=[1,2,3,4,5];
					var strArr=['a','b','c','d','e'];
					var hashObj=T.array.hash(numArr,strArr);
                    baidu.dom.g('resultArea').innerHTML = "结果为：" + hashObj[3];
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};