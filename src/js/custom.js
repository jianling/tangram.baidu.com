module.declare(function(require, exports, module){
	exports.start = start;
	exports.toggleVersion = toggleVersion;
	exports.printCode = printCode;
	exports.importCode = importCode;

	var Lichee = require("./lichee");
	var E = Lichee.Element, Q = Lichee.queryElement;
	var tree = require("./simpletree");
	var treeInstance;
	var filetree = E("filetree");
    
    
    function toggleVersion(){
        var form = document.myform,
            combobox = document.myform.version;
        if(combobox.value == 'Tangram-mobile'){
            form.nobase.disabled = true;
            form.nouibase.disabled = true;
        }else{
            form.simple.disabled = true;
        }
        E('simple_con')[combobox.value == 'Tangram-mobile' ? 'delClass' : 'addClass']('hide');
        E('base_con')[combobox.value.indexOf('Tangram-component') > -1 ? 'delClass' : 'addClass']('hide');  
    }
    toggleVersion();//执行一次，防止刷新保留原值
    function printCode(){
        var form = document.myform;
//        form.src.value = '///import baidu.ui.Carousel';
        form.viewSource.value = '1';
        document.myform.submit();
    }
    function importCode(){
        var form = document.myform;
//        form.src.value = '///import baidu.ui.Carousel';
        form.viewSource.value = '0';
        document.myform.submit();
    }
    
	function setupSideBar(){
		var exportBtn = E("export");
		var viewcodeBtn = E("viewcode");
		exportBtn.useMouseAction("btn", "over,out,down,up");
		viewcodeBtn.useMouseAction("btn", "over,out,down,up");
	}

	function start(){
		setupSideBar();

		var data = tangram_base_csmap.nameSpace.concat(
			tangram_component_csmap.nameSpace);

		data.filter(function(item){
			return item.n == "baidu";
		}).forEach(function(item){
			item.expanded = true;
		});

		var relatedMapping1 = tangram_base_csmap.docMap;
		var relatedMapping2 = tangram_component_csmap.docMap;

		// 从一个 normal 节点搜索联系
		var relatedWithNormalNode = function(dataItem, value){
			var ret = [];
			var n = dataItem.n;
			var r1 = relatedMapping1[n];
			var r2 = relatedMapping2[n];
			var dataMapping = treeInstance.dataMapping;
			if(r1)
				ret = ret.concat(r1);
			if(r2)
				ret = ret.concat(r2);
			ret.forEach(function(r){
				if(dataMapping[r].nodeType == "folder")
					return ;
				if(value == 1){
					treeInstance.setNodeCheckWithoutUpdate(r, 1);
				}else{
					// TODO:
				}
			});
		};

		// 从一个 folder 节点搜索联系
		var relatedWithFolderNode = function(dataItem, value){
			var normals = [];
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
			normals.forEach(relatedWithNormalNode);
		};

		treeInstance = new tree({
			container: filetree,
			data: data
		});

		treeInstance.on("nodeCheck", function(name, value){
			var dataMapping = this.dataMapping;
			var dataItem = dataMapping[name];

			// 如果选中的节点是一个 folder
			if(dataItem.nodeType == "folder"){
				relatedWithFolderNode(dataItem, value);
			// 如果选中的节点是一个正常节点
			}else if(dataItem.nodeType == "normal"){
				relatedWithNormalNode(dataItem, value);
			}

			this.updateNodeCheckStates();
		});

		treeInstance.render();

	}
});