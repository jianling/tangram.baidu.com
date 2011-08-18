module.declare(function(require, exports, module){
	exports.start = start;
	var Lichee = require("./lichee");
	var tree = require("./simpletree");
	var E = Lichee.Element, Q = Lichee.queryElement;

	{include includes/hash.js}

	if(!window.Lichee)
		window.Lichee = Lichee;

	var apitree = E("apitree");
	var data = [];
	var treeInstance;
	var toShowAPIHandle;
	var toShowMethodDetailHandle;
	var nulHandle;

	var api_name = E("api_name");
	var api_desc = E("api_desc");
	var group_options = E("group_options");
	var group_methods = E("group_methods");
	var group_events = E("group_events");
	var group_plugs = E("group_plugs");
	var grammar = E(Q("#api_detail .grammar .center")[0]);

	[group_options, group_methods, group_events, group_plugs].forEach(defineGroupEvent);

	var tr_template = new Lichee.Template(
		"<tr class='@{trClass}' id='@{thisID}'>",
			"<td class='type'>&lt;@{type}&gt;</td>",
			"<td class='name'><a href='' onclick='Lichee.handle(@{handleId})(\"@{dropDownElId}\",\"@{thisID}\");return false;'>@{name}</a></td>",
			"<td class='description'>@{desc}</td>",
		"</tr>");

	var tr2_template = new Lichee.Template(
		"<tr class='@{trClass}'>",
			"<td class='name'><a href='' onclick='Lichee.handle(@{handleId})(\"@{key}\");return false;'>@{name}</a></td>",
			"<td class='description'>@{desc}</td>",
		"</tr>");

	var tr3_template = new Lichee.Template(
		"<tr class='extend_tr' id='@{dropDownElId}' style='display: none;'>",
			"<td colspan='3'>",
				"<div class='method_tip'>",
					"<div class='method_tip_arr'></div>",
					"<div class='method_tip_top'></div>",
					"<div class='method_tip_content'>",
						"<div class='method_grammar'>语法: <em>instance</em>.<strong>@{methodName}</strong>(@{params});</div>",
						"@{records}",
					"</div>",
					"<div class='method_tip_bottom'></div>",
				"</div>",
			"</td>",
		"</tr>");

	var table_template = new Lichee.Template(
		"<table cellspacing='0' cellpadding='0' width='100%'>",
			"@{records}",
		"</table>");

	var jump_template = new Lichee.Template(
		"<a href='' onclick='Lichee.Element(\"@{name}\",true).scrollIntoView(true); return false;'>@{text}</a>");

	function setContent(el, data, contentType){
		var groupContent = E(Q(".group-content", el.dom)[0]);
		var htmls = data.map(function(data, index){
			var options = data.options;
			var dropDownElId = Lichee.id();
			var thisID = Lichee.id();
			var name = data.name;
			var afterName = "";

			if(contentType == "method")
				afterName = options ? "(<span style='font-size: 8px;'>...</span>)" : "()";

			var line = tr_template.apply({
				trClass: (index % 2 ? "dark" : "") + (options ? " comboline" : ""),
				type: data.type || "void",
				name: (name || "") + afterName,
				desc: data.desc || "",
				handleId: toShowMethodDetailHandle,
				dropDownElId: dropDownElId,
				thisID: thisID
			});
			if(options){
				var params = [];
				var subHtml = options.map(function(data, index){
					params.push(data.name);
					return tr_template.apply({
						trClass: index % 2 ? "dark" : "",
						type: data.type || "void",
						name: data.name || "",
						desc: data.desc || "",
						handleId: nulHandle,
						dropDownElId: Lichee.id(),
						thisID: Lichee.id()
					});
				});
				subHtml = table_template.apply({
					records: subHtml.join("")
				});
				line += tr3_template.apply({
					dropDownElId: dropDownElId,
					thisID: thisID,
					records: subHtml,
					methodName: name,
					params: params.join(", ")
				});
			}
			return line;
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

	function setJump(data, key){
		var html = [];
		data.options && html.push(jump_template.apply({ key: key, name: "group_options", text: "options参数" }));
		data.methods && html.push(jump_template.apply({ key: key, name: "group_methods", text: "方法" }));
		data.events && html.push(jump_template.apply({ key: key, name: "group_events", text: "事件" }));
		data.plugins && html.push(jump_template.apply({ key: key, name: "group_plugs", text: "扩展插件" }));
		html.push(jump_template.apply({ key: key, name: "demo", text: "demo" }));
		html = "快速跳转：" + html.join(" | ");
		E("api_jump").html(html);
	}

	function loadAPI(key){
		var data = tangram_base_api.docMap[key] || tangram_component_api.docMap[key] || null;
		if(!data)return ;

		E("api_list").display(false);
		E("api_detail").display(true);

		api_name.html(key);
		api_desc.html(data.desc);

		if(data.returns){
			var returns = data.returns[0];
			E("api_type").html(returns.type);
			E("api_returns_desc").html(returns.desc);
		}else if(data.methods){
			E("api_type").html("instance");
			E("api_returns_desc").html("实例对象");
		}else{
			E("api_type").html("void");
			E("api_returns_desc").html("");
		}

		if(data.grammar){
			grammar.html(grammarRenderer(data.grammar, key));
		}else{
			grammar.html("<span style='color: #ccc;'>无</span>");
		}

		if(data.options){
			setContent(group_options, data.options);
			group_options.display(true);
		}else{
			group_options.display(false);
		}

		if(data.methods){
			setContent(group_methods, data.methods, "method");
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

		setJump(data, key);
		E("api_demo_iframe").attr("src", "demo/demo-console.html?package=" + key);
	}

	function loadAPIList(key){
		E("api_list").display(true);
		E("api_detail").display(false);

		var dataMapping = treeInstance.dataMapping;
		var subs = dataMapping[key].childs;

		var htmls = subs.map(function(node, index){
			var name = node.n;
			var data = tangram_base_api.docMap[name] || tangram_component_api.docMap[name] || null;
			if(!data)
				return "";
			return tr2_template.apply({
				handleId: toShowAPIHandle,
				key: name,
				trClass: index % 2 ? "dark" : "",
				name: name,
				desc: data.desc
			});
		});

		htmls = table_template.apply({
			records: htmls.join("")
		});

		E("api_list").html(htmls);
	}

	function grammarRenderer(text, key){
		text = text.htmlEncode();
		text = text.replace(key, "<strong>" + key + "</strong>");
		return "语法: " + text;
	}

	toShowAPIHandle = Lichee.handle(function(key){
		treeInstance.focusToKey(key);
	});

	toShowMethodDetailHandle = Lichee.handle(function(dropDownElId, thisID){
		var dropDown = E(dropDownElId);
		var thiz = E(thisID);
		if(dropDown){
			var displayd = dropDown.displayd = !dropDown.displayd;
			if(displayd){
				thiz.addClass("expanded");
				dropDown.style("display", "");
			}else{
				thiz.delClass("expanded");
				dropDown.style("display", "none");
			}
		}
	});

	nulHandle = Lichee.handle(function(){});

	function start(){

		if(typeof tangram_base_api != "undefined")
			data.push.apply(data, tangram_base_api.nameSpace);
		if(typeof tangram_component_api != "undefined")
			data.push.apply(data, tangram_component_api.nameSpace);

		treeInstance = new tree({
			container: apitree,
			data: data,
			enableCheckBox: false,
			clickHandler: function(key){
				if(location.hash != "#" + key)
					location.hash = key;
			},
			nameRenderer: function(text){
				text = text.split(".");
				return text[text.length - 1].htmlEncode();
			}
		});

		treeInstance.render();
		treeInstance.getRoot().expand();

		hash(/^[^_]+$/, function(key){
			var node = treeInstance.dataMapping[key];
			if(node.nodeType == "folder"){
				loadAPIList(key);
			}else{
				loadAPI(key);
			}
			treeInstance.focusToKey(key);
		});
	}
});