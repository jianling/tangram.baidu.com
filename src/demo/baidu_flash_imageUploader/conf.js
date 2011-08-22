var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'method',
        'method': 'baidu.flash.imageUploader'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'baidu.flash.imageUploader示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '',
			html:'<div id="content" style="width:630px; height:360px;padding:10px;display:block;background:#EEE;border: 1px solid #ddd;"></div><div id="info" style="width:630px;height:auto;line-height:20px;background:#EEE;border: 1px solid #ddd;font-size:12px;padding:10px;"><p style="color:green">本例每次上传的文件覆盖前面的文件。上传后的路径为 ./upload/test.png</p>',
			jsCode:'var info = baidu.g("info");var options = {createOptions: {id: "flashID",url: "images/imageUploader.swf",width: "630px",height: "360px",errorMessage: "载入FLASH出错",ver: "9.0.0",vars:{url: "getfile.php",	fileType: "{\'description\':\'图片\', \'extension\':\'*.gif; *.jpeg; *.png; *.jpg; *.bmp\'}",maxNum: 32,maxSize: 3,compressSize: 3,compressLength: 1200,uploadDataFieldName: "uploadDataField",	picDescFieldName: "DESC",ext: "{\'aaa\':\'bbb\', \'ccc\':\'ddd\'}",supportGif: 1},container: "content"},allComplete: function(){console.log(arguments);info.innerHTML += "<p>"+ t()+" 所有操作已经完成。</p>";},complete: function(stat,obj){var arr = document.location.href.split("/") , url;arr.pop();url = arr.join("/") + "/" + eval( "("+obj.info+")" ).path;info.innerHTML += "<p>"+ t()+" 图片发送完毕。返回信息："+obj.info+"</p><p><a target=\'_blank\' href=\'"+url+"\'>查看</a></p>";},changeHigh: function(){alert("high");}};var up = new baidu.flash.imageUploader(options);var t = function (){var d = new Date();return [d.getHours(),d.getMinutes(),d.getSeconds()].join(":")}'
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