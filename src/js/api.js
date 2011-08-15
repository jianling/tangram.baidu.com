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
	var group_methods = E("group_methods");
	var group_events = E("group_events");
	var group_plugs = E("group_plugs");

	[group_options, group_methods, group_events, group_plugs].forEach(defineGroupEvent);

	var tr_template = new Lichee.Template(
		"<tr class='@{trClass}'>",
			"<td class='type'>&lt;@{type}&gt;</td>",
			"<td class='name'><a href='' onclick='return false;'>@{name}</a></td>",
			"<td class='description'>@{desc}</td>",
		"</tr>");

	var table_template = new Lichee.Template(
		"<table cellspacing='0' cellpadding='0'>",
			"@{records}",
		"</table>");

	var jump_template = new Lichee.Template(
		"<a href='#@{name}'>@{text}</a>");

	function setContent(el, data){
		var groupContent = E(Q(".group-content", el.dom)[0]);
		var htmls = data.map(function(data, index){
			return tr_template.apply({
				trClass: index % 2 ? "dark" : "",
				type: data.type || "void",
				name: data.name || "",
				desc: data.desc || ""
			});
		});
		htmls = table_template.apply({
			records: htmls.join("")
		});
		groupContent.html(htmls);
	}

	function defineGroupEvent(el){
		var groupTitle = E(Q(".group-title", el.dom)[0]);
		var groupContent = E(Q(".group-content", el.dom)[0]);
			groupContent.displayd = true;
		groupTitle.addEvents({
			click: function(){
				groupContent.displayd = !groupContent.displayd;
				groupContent.display(groupContent.displayd);
				groupContent.displayd ?
					groupTitle.delClass("group-title-close") :
					groupTitle.addClass("group-title-close");
			}
		});
	}

	function setJump(data){
		var html = [];
		data.options && html.push(jump_template.apply({ name: "group_options", text: "options参数" }));
		data.methods && html.push(jump_template.apply({ name: "group_methods", text: "方法" }));
		data.events && html.push(jump_template.apply({ name: "group_events", text: "事件" }));
		data.plugins && html.push(jump_template.apply({ name: "group_plugs", text: "扩展插件" }));
		html.push(jump_template.apply({ name: "demo", text: "demo" }));
		html = "快速跳转：" + html.join(" | ");
		E("api_jump").html(html);
	}

	function loadAPI(key){
		var data = tangram_base_api.docMap[key] || tangram_component_api.docMap[key] || null;
		if(!data)return ;

		api_name.html(key);
		api_desc.html(data.desc);

		if(data.options){
			setContent(group_options, data.options);
			group_options.display(true);
		}else{
			group_options.display(false);
		}

		if(data.methods){
			setContent(group_methods, data.methods);
			group_methods.display(true);
		}else{
			group_methods.display(false);
		}

		if(data.events){
			setContent(group_events, data.events);
			group_events.display(true);
		}else{
			group_events.display(false);
		}

		if(data.pulgins){
			setContent(group_plugs, data.pulgins);
			group_plugs.display(true);
		}else{
			group_plugs.display(false);
		}

		setJump(data);
		E("api_demo_iframe").attr("src", "demo/demo-console.html?package=" + key);
	}

	function start(){

		if(typeof tangram_base_api != "undefined")
			data.push.apply(data, tangram_base_api.nameSpace);
		if(typeof tangram_component_api != "undefined")
			data.push.apply(data, tangram_component_api.nameSpace);

		treeInstance = new tree({
			container: apitree,
			data: data,
			enableCheckBox: false
		});

		treeInstance.render();

		loadAPI("baidu.ui.Carousel");

	}
});