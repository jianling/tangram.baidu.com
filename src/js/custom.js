module.declare(function(require, exports, module){
	exports.start = start;

	var Lichee = require("./lichee");
	var E = Lichee.Element, Q = Lichee.queryElement;
	var tree = require("./simpletree");
	var treeInstance;
	var filetree = E("filetree");

	function start(){
		var data = tangram_base_csmap.nameSpace.concat(
			tangram_component_csmap.nameSpace);

		data.filter(function(item){
			return item.n == "baidu";
		}).forEach(function(item){
			item.expanded = true;
		});

		treeInstance = new tree({
			container: filetree,
			data: data
		});

		treeInstance.render();

	}
});