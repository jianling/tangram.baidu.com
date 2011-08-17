/**
 * API及文档查询
 */
(function(){
	var executeSearch = function(apiData, searchkey){
		var result = [], count = 0, keyReg = new RegExp(searchkey, "gi");
		for(key in apiData){
			var apiItem = apiData[key],
				name = apiItem.name,
				desc = apiItem.desc,
				methods = apiItem.methods,
				resultItem = null;
			if(keyReg.test(key) || keyReg.test(desc)){
				resultItem = {'name': key, 'desc': desc};
				count++;
			}
			if(methods){
				for(var j = 0, methodsLen = methods.length; j<methodsLen; j++){
					var method = methods[j];
					if(keyReg.test(method.name) || keyReg.test(method.desc)){
						////console.log(name);
						if(!resultItem){
							resultItem = {'name': key, 'methods': []};
						}else{
							resultItem.methods = [];
						}
						resultItem.methods.push(method);
						count++;
					}
				}
			}
			if(resultItem){
				result.push(resultItem);
				//console.log(resultItem.name);
			}
		}
		//console.log(result);
		return {
			'searchKey': searchkey,
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
			if(!result[i].methods){
				var item = result[i];
				var link = './api.html#' + item.name;
				//console.log(key);
				html.push('<h3><a href="' + link + '" target="_blank">' + item.name.replace(new RegExp(key, "gi"), keyReplacer) + '</a></h3>');
				html.push('<p>' + item.desc.replace(new RegExp(key, "gi"), keyReplacer) + '</p>');
			}else{
				name = result[i].name;
				html.push('<h2>' + name.replace(new RegExp(key, 'gi'), keyReplacer) + '</h2>');
				var methods = result[i].methods;
				for(var j = 0, methodsLen = methods.length; j<methodsLen; j++){
					//console.log(methods[j].name);
					var method = methods[j];
					var link = './api.html#' + method.name;
					html.push('<h3><a href="' + link + '" target="_blank">' + method.name.replace(new RegExp(key, "gi"), keyReplacer) + '</a></h3>');
					if(method.desc) html.push('<p>' + method.desc.replace(new RegExp(key, "gi"), keyReplacer) + '</p>');
				}
			}
		}
		baidu.dom.query(".search-result")[0].innerHTML = html.join('');
	};
	
	var bindSearchInput = function(apiData){
		//console.log(apiData);
		var searchInput = T.e(T.g('searchinput')),
			searchTimeout;
		searchInput.on("keyup", function(){
			var key = this.value.replace(/^\s+|\s+$/g, '');
			//console.log('需要查询的关键字为：' + key);
			if(!key)
				return;
			if(searchTimeout){
				window.clearTimeout(searchTimeout);
				//console.log('取消定时器...');
			}
			//console.log('设定定时器...');
			searchTimeout = window.setTimeout(function(){
				//console.log('开始查询API...');
				var result = executeSearch(apiData, key);
				renderSearchResult(result.searchKey, result.searchResult, result.resultCount);
			}, 500);
		});
	};
	
	T.dom.ready(function(){
		var baseApiUrl = "./js/tangram_base_api.js",
			componentApiUrl = "./js/tangram_component_api.js",
			docApiUrl = "./js/tangram_doc_api.js",
			apiData = {},
			apiLoaded = 0;
		
		//加载base
		T.async.get(baseApiUrl).then(function(obj){
			eval(obj.responseText.replace(/[\n\r]*ig, ''/));
			apiData = baidu.object.merge(apiData, tangram_base_api.docMap);
			apiLoaded++;
			if(apiLoaded == 2){
				bindSearchInput(apiData);
			}
		});
		
		//加载component
		T.async.get(componentApiUrl).then(function(obj){
			eval(obj.responseText.replace(/[\n\r]*ig, ''/));
			apiData = baidu.object.merge(apiData, tangram_component_api.docMap);
			apiLoaded++;
			if(apiLoaded == 2){
				bindSearchInput(apiData);
			}
		});
		
		//加载doc
		T.async.get(docApiUrl).then(function(obj){
			eval(obj.responseText.replace(/[\n\r]*ig, ''/));
			apiData = baidu.object.merge(apiData, tangram_doc);
			apiLoaded++;
			if(apiLoaded == 2)
				bindSearchInput(apiData);
		});
		
	});
})();