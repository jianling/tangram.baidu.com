var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.getParent'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.getParent'}],
    'default': {
        pageConf: {
            html: '<div id="resultTextarea"><iframe width="300px" height="100px" src="getWindowTest.html" name="fname1" id="fid1"></iframe><iframe width="300px" height="100px" src="getWindowTest.html" name="fname2" id="fid2"></iframe><iframe width="300px" height="100px" src="getWindowTest.html" name="fname3" id="fid3"></iframe><iframe width="300px" height="100px" src="getWindowTest.html" name="fname4" id="fid4"></iframe><iframe width="300px" height="100px" src="getWindowTest.html" name="fname5" id="fid5"></iframe><iframe width="300px" height="100px" src="getWindowTest.html" name="fname6" id="fid6"></iframe><iframe width="300px" height="100px" src="getWindowTest.html" name="fname7" id="fid7"></iframe><iframe width="300px" height="100px" src="getWindowTest.html" name="fname8" id="fid8"></iframe></div>'
		},
        formatBtn: {
			isMain: true,
            type: 'button',
            defaultValue: '随机删除红色框',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					var rand =Math.round(Math.random()*7);
					var ifr = window.frames[rand];
					var ele = ifr.document.getElementById("test");
					var removeEle = baidu.dom.getWindow(ele).document.getElementById("inner");
					if(removeEle)baidu.dom.remove(removeEle);
				}
            }
        }
    },
    
    groups: {
        'default': [['formatBtn']]
    }
};