module.declare(function(require, exports, module){
	var conf = require("./conf");
	var Lichee = require("./lichee");
	var E = Lichee.Element, Q = Lichee.queryElement;

	var variableElements = Q(".variable").map(function(dom){
		return E(dom);
	});

	variableElements.forEach(function(el){
		var name = el.attr("name");
		var type = typeof conf[name];
		switch(type){
			case "undefined":
				return ;
			case "string":
				el.html(conf[name].htmlEncode());
				break;
			default:
				el.html(conf[name].toString());
				break;
		}
	});
});