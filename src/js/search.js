/**
 * API及文档查询
 */
(function(){
	var executeSearch = function(apiData, key){
		var result = [], count = 0, keyReg = new RegExp(key, "gi");
		for(var i = 0, len = apiData.length; i<len; i++){
			var apiItem = apiData[i],
				name = apiItem.name,
				interfaces = apiItem.interfaces,
				resultItem = null;
			for(var j = 0, interfacesLen = interfaces.length; j<interfacesLen; j++){
				var interfaceItem = interfaces[j];
				if(keyReg.test(interfaceItem.name) || keyReg.test(interfaceItem.desc) || keyReg.test(name)){
					//console.log(name);
					if(!resultItem){
						resultItem = {'name': name, 'interfaces': []}
					}
					resultItem.interfaces.push(interfaceItem);
					count++;
				}
			}
			if(resultItem){
				result.push(resultItem);
				console.log(resultItem.name);
			}
		}
		console.log(result);
		return {
			'searchKey': key,
			'searchResult': result,
			'resultCount': count
		};
	};//executeSearch()
	
	var renderSearchResult = function(key, result, count){// TODO 每遍历20条，渲染一次页面，防止结果过多时渲染慢
		var index = 0, //保存搜索结果条数
			html = ['<h1>搜索结果[' + count + ']</h1>'],
			keyReplacer = function($0){
				return '<span class="key-match">' + $0 + '</span>';
			};
		for(var i=0, len=result.length; i<len; i++){
			name = result[i].name;
			html.push('<h2>' + name.replace(new RegExp(key, 'gi'), keyReplacer) + '</h2>');
			var interfaces = result[i].interfaces;
			for(var j = 0, interfacesLen = interfaces.length; j<interfacesLen; j++){
				var interfaceItem = interfaces[j];
				var link = './api.html#' + interfaceItem.name;
				html.push('<h3><a href="' + link + '" target="_blank">' + interfaceItem.name.replace(new RegExp(key, "gi"), keyReplacer) + '</a></h3>');
				html.push('<p>' + interfaceItem.desc.replace(new RegExp(key, "gi"), keyReplacer) + '</p>');
			}
		}
		baidu.dom.query(".search-result")[0].innerHTML = html.join('');
		
	};
	
	T.dom.ready(function(){
		var apiUrl = "./js/api-all.js";
		T.ajax.request(apiUrl, {
			onsuccess: function(xhr, msg){
				var apiData = eval(msg.replace(/[\n\r]*/ig, ''));
				// console.log(apiData);
				var searchInput = T.e(T.g('searchinput')),
					searchTimeout;
				searchInput.on("keyup", function(){
					var key = this.value.replace(/^\s+|\s+$/g, '');
					console.log('需要查询的关键字为：' + key);
					if(!key)
						return;
					if(searchTimeout){
						window.clearTimeout(searchTimeout);
						console.log('取消定时器...');
					}
					console.log('设定定时器...');
					searchTimeout = window.setTimeout(function(){
						console.log('开始查询API...');
						var result = executeSearch(apiData, key);
						renderSearchResult(result.searchKey, result.searchResult, result.resultCount);
					}, 500);
				});
			}
		})
	});
})();