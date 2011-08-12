var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.dom.drag'
    },
    
    demoType: [{key: 'default', val: 'baidu.dom.drag'}],
    'default': {
        pageConf: {
            html: '<div id="drag" class="roundCorner"><div id="dragHeader" class="roundCorner"></div><div id="dragContent">单击色条后开始拖拽</div></div>'
		},
        formatBtn0: {
            type: 'button',
            defaultValue: '创建',
            depend: [],
            event: {
                eventName: 'onclick',
                handler: function(){
					var dragInstance, dragging = false;
					var startDrag = function(e){
						if(!dragging){
							dragInstance = T.dom.drag(T.g("drag"),{
								ondrag : function(){
									T.setStyle("drag", "opacity", "0.4");
									T.g("dragContent").innerHTML="拖动中，单击放下";
								},
								ondragend : function(){
									T.g("dragContent").innerHTML="已放下，单击色条后开始拖拽";
									T.setStyle("drag", "opacity", "1");
								},
								autoStop: false
							});
							dragging = true;
						}
						else {
							dragInstance.stop();
							dragging = false;
						}
					};
					T.event.on(document, "click", function(e){
						if(T.event.getTarget(e).id == "dragHeader"){
							startDrag();
						}
					});
                }
            }
        }
    },
    
    groups: {
        'default': [['formatBtn0']]
    }
};