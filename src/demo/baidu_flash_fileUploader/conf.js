var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'method',
        'method': 'baidu.flash.fileUploader'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'fileUpLoader示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '',
			html:'<div id="content" style="width:630px; height:110px;padding:10px;display:block;background:#EEE;border: 1px solid #ddd;"></div><div id="info" style="width:630px;height:auto;line-height:20px;background:#EEE;border: 1px solid #ddd;font-size:12px;padding:10px;"><p style="color:green">单击白色区域选择文件，只允许上传png类型文件，上传后的地址为 ./images/upload/file.png 、大小限制为200K</p>',
			jsCode:'var info = baidu.g("info");'+
			'var options = {'+
				'width: "100px",height: "100px",'+
				'selectiFile:function(f){console.log(f);var fs=f,fl=fs.length,html=[];for(var i=0;i<fl;i++){var c= fs[i];'+
					'html[html.length]="<p>["+c.index+"] name:"+c.name+" size:"+c.size+"</p>"'+
				'}baidu.dom.g("info").innerHTML += html.join("");console.log(html)},'+
				'createOptions:{'+
					'id: "flashID",url: "images/fileUpLoader.swf",width: "100px",height: "100px",container: "content"'+
				'},'+
				'uploadComplete:function(){alert("上传完毕!")}'+
			'};'+
			'var up = new baidu.flash.fileUploader(options);var t = function (){var d = new Date();return [d.getHours(),d.getMinutes(),d.getSeconds()].join(":")}'
        },
        upload: {
            type: 'button',
            defaultValue: '上传 upload()',
            event: {
                eventName: 'onclick',
				depeend:['num'],
                handler: function(idx){
					up.upload('getfileUpload.php','upfiles','',idx);
				}
            }
        },
        num: {
            type: 'input',
			label:'文件索引号',
            defaultValue: '0',size:1
        },
        
		
    },    
    groups: {
        'default': [
            ['num','upload']
        ]
    }
};