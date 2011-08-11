var conf = {
    //    定义包类型
    //    class|method|field
    clazz: {
        type: 'class',
        'class': 'baidu.ui.ScrollPanel'
    },
    //    定义DEMO可选项
    demoType: [
        {key: 'default', val: 'ScrollPanel核心示例'}
    ],
    //    默认可选项的配置
    'default': {
        //    类实例化选项
        pageConf: {
            options: '{container: "scrollPanel", element: "scrollPanel"}',
			target:'scrollPanel',
			html:'<div style="padding:50px"><div id="scrollPanel" style="width:120px; height:200px; overflow:hidden;background:#FFF;">         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         ABCDEFG,HIJKLMN,OPQ,RST,UVW,XYZ<br/>         </div> </div>'
        },
        disable: {
            type: 'button',
            defaultValue: 'disable',
            event: {
                eventName: 'onclick',
                handler: function(){
					console.log(this)
				}
            }
        }
        
    },    
    groups: {
        'default': [
            ['disable']
        ]
    }
};