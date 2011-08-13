module.declare(function(require, exports, module){
	exports.start = start;
	var Lichee = require("./lichee");
	var tree = require("./simpletree");
	var E = Lichee.Element, Q = Lichee.queryElement;

	var apitree = E("apitree");
	var data = [];
	var treeInstance;

	var api_name = E("api_name");
	var api_desc = E("api_desc");
	var group_options = E("group_options");

	function loadAPI(key){
		var data = tangram_base_api[key] || tangram_component_api || null;
		if(!data)return ;

		api_name.html(key);
		api_desc.html(data.desc);

		if(data.options){
			group_options.display(true);

		}else{
			group_options.display(false);
		}

	}

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