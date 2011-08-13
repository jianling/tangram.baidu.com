var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.string.toHalfWidth'
    },
    
    demoType: [{key: 'default', val: 'baidu.string.toHalfWidth'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        dateInput: {
        	label: '输入字符：',
            type: 'text',
            defaultValue: '全角逗号，全角英文ｂb',
            size: 30
        },
        btn1: {
            type: 'button',
            defaultValue: '截取',
            depend: ['dateInput'],
            event: {
            	eventName: 'onclick',
            	handler: function(arg0){
            		T.g('resultArea').innerHTML = '转换后为：' + baidu.string.toHalfWidth(arg0);
            		T.g('resultArea').innerHTML += '<br /><br />支持转换的全角字符： {！ => !,＂ => ",＃ => #,＄ => $,％ => %,＆ => &,＇ => \',（ => (,） => ),＊ => *,＋ => +,， => ,,－ => -,． => .,／ => /,０ => 0,１ => 1,２ => 2,３ => 3,４ => 4,５ => 5,６ => 6,７ => 7,８ => 8,９ => 9,： => :,； => ,,＜ => <,＝ => =,＞ => >;？ => ?;＠ => @;Ａ => A;Ｂ => B;Ｃ => C;Ｄ => D;Ｅ => E;Ｆ => F;Ｇ => G,Ｈ => H,Ｉ => I,Ｊ => J,Ｋ => K,Ｌ => L,Ｍ => M,Ｎ => N,Ｏ => O,Ｐ => P,Ｑ => Q,Ｒ => R,Ｓ => S,Ｔ => T,Ｕ => U,Ｖ => V,Ｗ => W,Ｘ => X,Ｙ => Y,Ｚ => Z, => [,＼ => \,］ => ],＾ => ^,＿ => _,｀ => `,ａ => a,ｂ => b,ｃ => c,ｄ => d,ｅ => e,ｆ => f,ｇ => g,ｈ => h,ｉ => i,ｊ => j,ｋ => k,ｌ => l,ｍ => m,ｎ => n,ｏ => o,ｐ => p,ｑ => q,ｒ => r,ｓ => s,ｔ => t,ｕ => u,ｖ => v,ｗ => w,ｘ => x,ｙ => y,ｚ => z,｛ => {,｜ => |,｝ => },～ => ~}';
            	}
            }
        }
    },
    groups: {
        'default': [['dateInput'], ['btn1']]
    }
};  