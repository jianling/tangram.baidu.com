module.declare(function(require, exports, module){
	exports.start = start;
//	exports.toggleVersion = toggleVersion;
	exports.printCode = printCode;
	exports.importCode = importCode;
	exports.buildText = buildText;
	exports.restoreChoose = restoreChoose;

	var Lichee = require("./lichee");
	var E = Lichee.Element, Q = Lichee.queryElement;
	var tree = require("./simpletree");
	var treeInstance;
	var filetree = E("filetree");
	var currentInfo = E("currentInfo");
	var checkedNodeByClick = {};

	currentInfo.setValue = function(value){
		this.dom.value = value;
	};

	var relatedMapping1 = tangram_base_csmap.docMap;
	var relatedMapping2 = tangram_component_csmap.docMap;

	var currentRelating = {};
	function currentRelatingAdd(who, whoInclude){
		var item = currentRelatingGet(who);
		if(!item.whoInclude[whoInclude]){
			item.includeTimes ++;
			item.whoInclude[whoInclude] = 1;
		}
	}

	function currentRelatingRemove(who, whoInclude){
		var item = currentRelatingGet(who);
		if(item.whoInclude[whoInclude]){
			item.includeTimes --;
			delete item.whoInclude[whoInclude];
		}
	}

	function currentRelatingGet(who){
		var item;
		if(item = currentRelating[who]){
			return item;
		}else{
			return currentRelating[who] = { includeTimes: 0, whoInclude: {} };
		}
	}

	function currentRelatingNumberGet(who){
		var item = currentRelatingGet(who);
		return item.includeTimes;
	}

	function currentRelatingModuleGet(who){
		var item = currentRelatingGet(who);
		var result = [];
		Lichee.each(item.whoInclude, function(value, key){
			result.push(key);
		});
		return result;
	}

//    function toggleVersion(){
//        var form = document.myform,
//            combobox = document.myform.version;
//        if(combobox.value == 'Tangram-mobile'){
//            form.nobase.disabled = true;
//            form.nouibase.disabled = true;
//        }else{
//            form.simple.disabled = true;
//        }
//        E('simple_con')[combobox.value == 'Tangram-mobile' ? 'delClass' : 'addClass']('hide');
//        E('base_con')[combobox.value.indexOf('Tangram-component') > -1 ? 'delClass' : 'addClass']('hide');
//    }

//    toggleVersion(); //执行一次，防止刷新保留原值

    function printCode(){
        var form = document.myform;
        form.viewSource.value = "1";
		form.src.value = getCheckedNode();
        document.myform.submit();
    }

    function importCode(){
        var form = document.myform;
        form.viewSource.value = "0";
		form.src.value = getCheckedNode();
        document.myform.submit();
    }

	function buildText(){
		currentInfo.setValue("生成中...");
		clearTimeout(buildText.timer);
		buildText.timer = setTimeout(function(){
			var choose = getCheckedNode(true);
			currentInfo.setValue(choose.join(","));
		}, 500);
	}

	function restoreChoose(){
		var value = currentInfo.dom.value;
		clearTimeout(restoreChoose.timer);

		if(value == ""){
			currentInfo.setValue("没有内容");
			return restoreChoose.timer = setTimeout(function(){
				currentInfo.setValue("");
			}, 500);
		}

		currentInfo.setValue("解析中...");
		restoreChoose.timer = setTimeout(function(){
			var values = value.split(",");
			values.forEach(function(value){
				value = value.trim();
				var dataItem = treeInstance.dataMapping[value];
				if(dataItem){
					treeInstance.setNodeCheckWithoutUpdate(value, 1);
					relatedWithNormalNode(dataItem, 1);
					checkedNodeByClick[value] = dataItem;
				}
			});
			treeInstance.updateNodeCheckStates();
			currentInfo.setValue("解析完成");
			setTimeout(resetButton, 200);
			setTimeout(function(){
				currentInfo.setValue("");
			}, 500);
		}, 500);
	}

	function getCheckedNode(cleanly){
		var result = {}, resultArr = [];
		var getAllChilds = function(dataItem){
			if(dataItem.nodeType == "normal"){
				result[dataItem.n] = 1;
			}else if(dataItem.nodeType == "folder"){
				dataItem.childs.forEach(getAllChilds);
			}
		};
		Lichee.each(checkedNodeByClick, function(dataItem){
			getAllChilds(dataItem);
		});
		Lichee.each(result, cleanly ?
			function(value, key){
				resultArr.push(key);
			} :
			function(value, key){
				resultArr.push("///import " + key + ";");
			}
		);
		return cleanly ? resultArr : resultArr.join("\r\n");
	}

	function setupSideBar(){
		var exportBtn = E("export");
		var viewcodeBtn = E("viewcode");
		var buildTextBtn = E("buildText");
		var restoreChooseBtn = E("restoreChoose");
		exportBtn.useMouseAction("btn", "over,out,down,up");
		viewcodeBtn.useMouseAction("btn", "over,out,down,up");
		buildTextBtn.useMouseAction("btn", "over,out,down,up");
		restoreChooseBtn.useMouseAction("btn", "over,out,down,up");
	}

	function disposeData(data){
		var mapping = {};
		var sames = {};
		var childsMap = {};

		data.forEach(function(item){
			var n = item.n, p = item.p;
			if(n == p)
				sames[n] = item;
			else
				mapping[n] = item;

			if(p){
				if(childsMap[p]){
					childsMap[p].push(item);
				}else{
					childsMap[p] = [item];
				}
			}
		});

		var after = ":folder";

		Lichee.each(sames, function(item){
			var p = item.p;
			if(childsMap[p]){
				childsMap[p].forEach(function(item){
					item.p += after;
				});
			}
			mapping[p].n += after;
		});
	}

	function resetButton(){
		switch(treeInstance.dataMapping["baidu"].checked){
			case 0.5:
			case 1:
				E("export").dom.disabled =
				E("viewcode").dom.disabled =
				E("buildText").dom.disabled = false;
				break;
			case 0:
				E("export").dom.disabled =
				E("viewcode").dom.disabled =
				E("buildText").dom.disabled = true;
				break;
		}
	}

	var relatedWithFolderNode; // 从一个 folder 节点搜索联系
	var relatedWithNormalNode; // 从一个 normal 节点搜索联系

	function start(){
		setupSideBar();

		var data = tangram_base_csmap.nameSpace.concat(
			tangram_component_csmap.nameSpace);

		disposeData(data);

		data.filter(function(item){
			return item.n == "baidu";
		}).forEach(function(item){
			item.expanded = true;
		});

		// 从一个 normal 节点搜索联系
		var relatedWithNormalNode_cache = {};
			relatedWithNormalNode = function(dataItem, value){
			var n = dataItem.n;
			var dataMapping = treeInstance.dataMapping;

			var ret = relatedWithNormalNode_cache[n];

			if(!ret){
				ret = [];
				var r1 = relatedMapping1[n];
				var r2 = relatedMapping2[n];
				if(r1)
					ret = ret.concat(r1);
				if(r2)
					ret = ret.concat(r2);
				if(ret.length == 0)
					return ;
				relatedWithNormalNode_cache[n] = ret;
			}

			ret.forEach(function(r){
				if(dataMapping[r] && dataMapping[r].nodeType == "folder")
					return ;
				if(value == 1){
					currentRelatingAdd(r, n);
					if(currentRelatingNumberGet(r) == 1){
						treeInstance.setNodeCheckWithoutUpdate(r, 1);
						// 递归搜索
						relatedWithNormalNode({ n: r }, 1);
					}
				}else{
					currentRelatingRemove(r, n);
					if(currentRelatingNumberGet(r) == 0){
						treeInstance.setNodeCheckWithoutUpdate(r, 0);
						// 递归搜索
						relatedWithNormalNode({ n: r }, 0);
					}
				}
			});
		};

		// 从一个 folder 节点搜索联系
		var relatedWithFolderNode_cache = {};
			relatedWithFolderNode = function(dataItem, value){
			var normals = relatedWithFolderNode_cache[dataItem.n];
			if(!normals){
				normals = [];
				var getChilds = function(data){
					if(data.childs){
						data.childs.forEach(function(c){
							if(c.nodeType == "normal")
								normals.push(c);
							else if(c.nodeType == "folder")
								getChilds(c);
						});
					}
				};
				getChilds(dataItem);
				relatedWithFolderNode_cache[dataItem.n] = normals;
			}
			normals.forEach(function(item){
				relatedWithNormalNode(item, value);
			});
		};

		treeInstance = new tree({
			container: filetree,
			data: data,
			nameRenderer: function(name, parentName){
				if(/:folder$/.test(name)){
					return name.replace(/:folder$/, "").htmlEncode();
				}else if(name + ":folder" == parentName){
					return "<span style=\"color: #808080;\">core</span>";
				}else{
					return name.htmlEncode();
				}
			}
		});

		treeInstance.on("beforeCheckBoxClick", function(nodeIns, value){
			var dataMapping = this.dataMapping;
			var dataItem = dataMapping[nodeIns.name];

			// 如果选中的节点是一个 folder
			if(dataItem.nodeType == "folder"){
				relatedWithFolderNode(dataItem, value);

			// 如果选中的节点是一个正常节点
			}else if(dataItem.nodeType == "normal"){
				relatedWithNormalNode(dataItem, value);
			}

			if(value){
				checkedNodeByClick[dataItem.n] = dataItem;
			}else{
				delete checkedNodeByClick[dataItem.n];
			}

			tree.updateCheckStates(nodeIns.tree.dataMapping, nodeIns.tree.dataMapping[nodeIns.name], value);
//			this.updateNodeCheckStates(nodeIns);
			this.updateNodeCheckStates();

			setTimeout(resetButton, 200);

//			传统用法
//			tree.updateCheckStates(nodeIns.tree.dataMapping, nodeIns.tree.dataMapping[nodeIns.name], value);
//			this.updateNodeCheckStates(nodeIns);
		});

		treeInstance.render();

	}
});