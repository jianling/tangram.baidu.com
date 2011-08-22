T.dom.ready(function(){
	
	url = 'tangram/api.js';
	T.ajax.request(url,
	{

		onsuccess:function(x,s){ 

			window.apiData = eval(s.replace(/\n|\r|\n\r/ig,''));
			
			var shortstr = [];
			for(var i=0;i<apiData.length;i++){
				for(var ii=0;ii<apiData[i].interfaces.length;ii++){
					if(apiData[i].interfaces[ii].meta!='' && typeof apiData[i].interfaces[ii].meta == 'string'){
						var n = apiData[i].interfaces[ii];
						shortstr.push(	'<tr><td><a href="tangram/'+n.name.split('.').join('_')+'.html">'+n.name+'</td><td>'+n.desc+'</td></tr>'	)
					}
				}
			}
			var html = "<table class='headtable'><thead><tr><th>接口名称</th><th>接口说明</th></tr></thead><tbody>"+shortstr.join('')+"</table>";
			T.g('Content').innerHTML = "<h1>核心接口(core)</h1><p>在核心版中提供的接口</p>"+html;

	}


	})
})