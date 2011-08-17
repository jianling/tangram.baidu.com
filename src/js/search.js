/**
 * API及文档查询
 * TODO 三个数据来源单独查找，单独显示
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
				if(apiData[key].link != undefined)
					resultItem.link = apiData[key].link;
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
	
	var renderSearchResult = function(key, result, count){
		var index = 0, //保存搜索结果条数
			html = ['<h1>搜索结果[' + count + ']</h1>'],
			keyReplacer = function($0){
				return '<span class="key-match">' + $0 + '</span>';
			};
		for(var i=0, len=result.length; i<len; i++){
			if(!result[i].methods){
				var item = result[i];
				var link = (item.link!=undefined ? item.link : './api.html#' + item.name);
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
			apiData = {
				'mobile web 的未来' :{'name':'', 'desc':'', 'link':''},
				'需要 jquery 吗' :{'name':'', 'desc':'', 'link':''},
				'链式调用' :{'name':'', 'desc':'', 'link':''},
				'常用技巧' :{'name':'', 'desc':'', 'link':''},
				'移动浏览器的 viewport' :{'name':'', 'desc':'', 'link':''},
				'iframe 的问题' :{'name':'', 'desc':'', 'link':''},
				'基础方法' :{'name':'', 'desc':'', 'link':''},
				'UI 组件' :{'name':'', 'desc':'', 'link':''},
				'事件处理(一)' :{'name':'', 'desc':'', 'link':''},
				'事件处理(二)' :{'name':'', 'desc':'', 'link':''},
				'事件处理(三)' :{'name':'', 'desc':'', 'link':''},
				'动画效果(一)' :{'name':'', 'desc':'', 'link':''},
				'动画效果(二)' :{'name':'', 'desc':'', 'link':''},
				'离线存储(一)' :{'name':'', 'desc':'', 'link':''},
				'离线存储(二)' :{'name':'', 'desc':'', 'link':''},
				'本地存储' :{'name':'', 'desc':'', 'link':''},
				'base入门' :{'name':'', 'desc':'', 'link':'./docs/Tangram-Base.html'},
				'component入门' :{'name':'', 'desc':'', 'link':'./docs/Tangram-Component.html'},
				'UI使用指导' :{'name':'', 'desc':'', 'link':'./docs/Tangram-UI.html'},
				'UI组件体系' :{'name':'', 'desc':'', 'link':'./docs/Tangram-Component-UISys.html'},
				'UIBase' :{'name':'', 'desc':'', 'link':'./docs/Tangram-Component-UIBase.html'},
				'UI组件开发' :{'name':'', 'desc':'', 'link':'./docs/Tangram-Component-Colligate.html'},
				'Component插件' :{'name':'', 'desc':'', 'link':'./docs/Tangram-Component-Plugins.html'},
				'behavior' :{'name':'', 'desc':'', 'link':'./docs/Tangram-Component-Behavior.html'},
				'base入门' :{'name':'', 'desc':'', 'link':''},
				'新手入门' :{'name':'', 'desc':'', 'link':''},
				'快捷方式' :{'name':'', 'desc':'', 'link':''},
				'API参考手册' :{'name':'', 'desc':'', 'link':''}
			},
			apiLoaded = 0;
		
		//加载base
		T.async.get(baseApiUrl).then(function(obj){
			eval(obj.responseText.replace(/[\n\r]*ig, ''/));
			apiData = baidu.object.merge(apiData, tangram_base.docMap);
			apiLoaded++;
			if(apiLoaded == 2){
				bindSearchInput(apiData);
			}
		});
		
		//加载component
		T.async.get(componentApiUrl).then(function(obj){
			eval(obj.responseText.replace(/[\n\r]*ig, ''/));
			apiData = baidu.object.merge(apiData, tangram_component.docMap);
			apiLoaded++;
			if(apiLoaded == 2){
				bindSearchInput(apiData);
			}
		});
		
	});
})();