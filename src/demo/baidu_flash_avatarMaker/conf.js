var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'method',
        'method': 'baidu.flash.avatarMaker'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'avatarMaker示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '',
			html:'<div id="content" style="width:630px; height:360px;padding:10px;display:block;background:#EEE;border: 1px solid #ddd;"></div><div id="info" style="width:630px;height:auto;line-height:20px;background:#EEE;border: 1px solid #ddd;font-size:12px;padding:10px;"><p style="color:green">本例每次上传的文件覆盖前面的文件。上传后的路径为 .images/upload/big.png、.images/upload/middle.png、.images/upload/small.png、大小限制为200K</p>',
			jsCode:'var info = baidu.g("info");'+
			'var options = {'+
				'uploadURL: "images/getfileAvatar.php",'+
				'tipHandle: function(tip){alert(tip);},'+
				'uploadCallBack: function(){console.log(arguments);},'+
				'createOptions:{'+
					'id: "flashID",url: "images/avatarMaker.swf",width: "630px",height: "360px",container: "content"'+
				'}'+
			'};'+
			'var up = new baidu.flash.avatarMaker(options);var t = function (){var d = new Date();return [d.getHours(),d.getMinutes(),d.getSeconds()].join(":")}'
        },
        upload: {
            type: 'button',
            defaultValue: '上传 upload()',
            event: {
                eventName: 'onclick',
                handler: function(){
					up.upload();
				}
            }
        },
        pause: {
            type: 'button',
            defaultValue: '暂停 pause()',
            event: {
                eventName: 'onclick',
                handler: function(){
					up.pause();
				}
            }
        },
        
		
    },    
    groups: {
        'default': [
            ['upload','pause']
        ]
    }
};