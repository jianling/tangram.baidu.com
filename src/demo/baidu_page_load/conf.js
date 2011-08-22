var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.page.load'
    },
    
    demoType: [{key: 'default', val: 'baidu.page.load'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea">该实例将演示从服务器加载loadJsFileTest.js和loadCssFileTest.css空文件，加载完成后将执行回调来表示已经加载完毕<br/><br/></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '加载文件序列',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
            		var addLog = function(log){
						T.g('resultArea').innerHTML += log + '<br />';
					};
				    var files = [
								    {
								        url : "./baidu_page_load/loadJsFileTest.js",
								        onload: function(){
								        	addLog('JS写入DOM并且执行完毕!')
								        }
								    },
								    {
								        url : "./baidu_page_load/loadCssFileTest.css",
								        onload:  function(){
								        	addLog('CSS写入DOM渲染完毕!')
								        }
								    }
								];
					baidu.page.load(files);
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};