T.dom.ready(function(){
	
	url = '../js/base-short-api.js';
	T.ajax.request(url,
	{

		onsuccess:function(x,s){ 

			window.apiData = eval(s.replace(/\n|\r|\n\r/ig,''));
			var shortstr = [];
			for(var i=0;i<apiData.length;i++){
				for(var ii=0;ii<apiData[i].interfaces.length;ii++){
					if(apiData[i].interfaces[ii].shortcut!='' && typeof apiData[i].interfaces[ii].shortcut == 'string'){
						var n = apiData[i].interfaces[ii];
						var ln = 'baidu.'+n.name.split('.').slice(1).join('.');
						shortstr.push(	'<tr><td><a href="../api.html#'+ln+'">'+n.name+'</td><td>T.'+n.shortcut+'</td><td>'+n.desc+'</td></tr>'	)
					}
				}
			}
			var html = "<table class='headtable'><thead><tr><th>名称</th><th>快捷方式</th><th>描述</th></tr></thead><tbody>"+shortstr.join('')+"</table>";
			T.g('Content').innerHTML = html;

	}


	})

	
})