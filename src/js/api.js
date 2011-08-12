module.declare(function(require, exports, module){
	exports.start = start;
	var Lichee = require("./lichee");
	var tree = require("./simpletree");
	var E = Lichee.Element, Q = Lichee.queryElement;

	var apitree = E("apitree");
	var data = [];
	var treeInstance;

	function start(){

		if(typeof tangram_base != "undefined")
			data.push.apply(data, tangram_base.nameSpace);
		if(typeof tangram_component != "undefined")
			data.push.apply(data, tangram_component.nameSpace);

		treeInstance = new tree({
			container: apitree,
			data: data,
			enableCheckBox: false
		});

		treeInstance.render();

	}
});