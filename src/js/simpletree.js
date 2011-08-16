module.declare(function(require, exports, module){
	var Lichee = require("./lichee.js");
	var E = Lichee.Element, Q = Lichee.queryElement;

	// 格式化数据，输入扁平数据，产生树状数据和 dataMapping
	var formatData = function(data){
		var formatedData = [];
		var dataItemStates = {};
		var undefinedParentChilds = {};
		data.forEach(function(item, index){
			var p;
			item.childs = [];
			item.checked = 0;
			if(item.p){
				if(p = dataItemStates[item.p]){
					p.childs.push(item);
					dataItemStates[item.p].nodeType = "folder";
				}else if(p = undefinedParentChilds[item.p]){
					p.push(item);
				}else{
					undefinedParentChilds[item.p] = [item];
				}
			}else{
				formatedData.push(item);
			}

			item.nodeType = "normal";
			dataItemStates[item.n] = item;
			if(undefinedParentChilds[item.n]){
				item.childs = undefinedParentChilds[item.n].concat(item.childs);
				item.nodeType = "folder";
				delete undefinedParentChilds[item.n];
			}
		});

		Lichee.each(undefinedParentChilds, function(childs, name){
			var item = { n: name, p: "", childs: childs, checked: 0, nodeType: "folder"  };
			formatedData.push(item);
			dataItemStates[name] = item;
//			formatedData.push.apply(formatedData, childs);
		});

		return [formatedData, dataItemStates];
	};

	// 根据数据节点的状态，关联更新其它数据节点（与界面无关）
	var updateCheckStates = function(dataMapping, dataItem, value, _dire){ // _dire: 1 向外 0 向里
		dataItem.checked = value;

		// 向里
		var inwards = function(){
			if(value == .5)return ;
			dataItem.childs.forEach(function(dataItem){
				updateCheckStates(dataMapping, dataItem, value, 0);
			});
		};

		// 向外
		var forth = function(){
			var p, c, sum;
			if(p = dataItem.p){
				p = dataMapping[p];
				c = p.childs;
				sum = c.reduce(function(sum, dataItem){
					return sum + dataItem.checked;
				}, 0);
				if(sum === 0){
					p.checked = 0;
				}else if(sum === c.length){
					p.checked = 1;
				}else{
					p.checked = .5;
				}
				updateCheckStates(dataMapping, p, p.checked, 1);
			}
		};

		if(_dire === 0){
			inwards();
		}else if(_dire === 1){
			forth();
		}else{
			inwards();
			forth();
		}
	};

	var nodeTemplate = new Lichee.Template(
		"<div class='relation' id='@{relationId}'>",
			"<div class='expanded-viewer' id='@{expandedViewerId}'></div>",
		"</div>",
		"<div class='selection'>",
			"<div class='selection-inputer'>",
				"<input type='checkbox' id='@{checkinputId}' onfocus='this.blur()' onmousedown='return false' onclick='return false;' />",
			"</div>",
			"<div class='selection-clicker' id='@{checkClickerId}'></div>",
		"</div>",
		"<div class='icon' id='@{iconId}'></div>",
		"<div class='name'><a id='@{namelinkId}' href='' title='@{name}' onclick='return false;'>@{name} </a></div>");

	var nodeTemplate2 = new Lichee.Template(
		"<div class='relation' id='@{relationId}'>",
			"<div class='expanded-viewer' id='@{expandedViewerId}'></div>",
		"</div>",
		"<div class='icon' id='@{iconId}'></div>",
		"<div class='name'><a id='@{namelinkId}' href='' onclick='return false;'>@{name} </a></div>");

	var node = new Lichee.Class(
		/* constructor */ function(conf){
			this.container = E(conf.container);
			this.name = conf.name || "";
			this.childsData = conf.childsData;
			this.tree = conf.tree;
			this.expanded = !! conf.expanded;
			this.checked = 0;
			this.tree.nodes.push(this);
			this.tree.nodeMapping[this.name] = this;
			this.clickHandler = conf.clickHandler || function(){};
			this.nameRenderer = conf.nameRenderer || function(text){ return text; };

			if(conf.icon){
				this.icon = conf.icon;
			}else if(this.childsData.length){
				this.icon = "images/tree/etfolder.gif";
			}else{
				this.icon = "images/tree/etfile.gif";
			}
		},

		/* methods */ {
			render: function(){
				var enableCheckBox = this.tree.enableCheckBox;
				var template = enableCheckBox ? nodeTemplate : nodeTemplate2;

				this.container.html(template.apply({
					name: this.nameRenderer(this.name).htmlEncode(),
					iconId: this.iconId = Lichee.id(),
					namelinkId: this.namelinkId = Lichee.id(),
					expandedViewerId: this.expandedViewerId = Lichee.id(),
					relationId: this.relationId = Lichee.id(),
					checkinputId: this.checkinputId = Lichee.id(),
					checkClickerId: this.checkClickerId = Lichee.id()
				}));

				E(this.iconId).style("backgroundImage", "url(" + this.icon + ")");
				this.disposeEvent();

				if(this.childsData.length){
					E(this.expandedViewerId).display(true);
					var dropDownLayer = Lichee.makeElement("div", { "class": "dropdownlayer" });
					E(this.container).add(dropDownLayer);
					dropDownLayer = this.dropDownLayer = E(dropDownLayer);
				}

				if(this.dropDownLayer && !this.expanded)
					this.collapse();
				else
					this.expand();
			},

			expand: function(_callback){
				if(!this.hasExpanded && this.childsData.length){
					this.hasExpanded = true;
					this.renderChilds(this.childsData, function(){
						this.tree.updateListLastNodes();
						this.tree.updateNodeCheckStates(this);
						this.expand(_callback);
					}.bind(this));
					return ;
				}

				if(!this.dropDownLayer)return ;
				this.dropDownLayer.display(true);
				E(this.expandedViewerId).style("backgroundPosition", "0 -20px");
				E(this.iconId).style("backgroundPosition", "0 -20px");
				this.expanded = true;
				this.tree.fixRelativeEls();
				_callback && _callback();
			},

			collapse: function(){
				if(!this.dropDownLayer)return ;
				this.dropDownLayer.display(false);
				E(this.expandedViewerId).style("backgroundPosition", "0 0");
				E(this.iconId).style("backgroundPosition", "0 0");
				this.expanded = false;
				this.tree.fixRelativeEls();
			},

			setCheck: function(value){
				updateCheckStates(this.tree.dataMapping, this.tree.dataMapping[this.name], value);
				this.tree.updateNodeCheckStates(this);
				this.tree.fireEvent("nodeCheck", [this.name, value]);
			},

			setHidden: function(bool){
				this.isHidden = bool;
				this.container.display(bool);
				if(this.dropDownLayer)
					this.dropDownLayer.display(bool);
			},

			focus: function(){
				var nameEl = E(this.namelinkId);
				if(this.tree.selectionNode){
					var lastNameEl = E(this.tree.selectionNode.namelinkId);
					lastNameEl.delClass("selected");
				}
				this.tree.selectionNode = this;
				nameEl.addClass("selected");
				this.clickHandler(this.name);

				var parent = this;
				while(parent = parent.parent)
					parent.expand && parent.expand();
			},

			setItsLast: function(bool){
				var relation = E(this.relationId);
				if(bool){
					this.dropDownLayer && this.dropDownLayer.addClass("dropdownlayer-last");
					relation.addClass("relation-last");
				}else{
					this.dropDownLayer && this.dropDownLayer.delClass("dropdownlayer-last");
					relation.delClass("relation-last");
				}
			},

			// privates
			renderChilds: function(childsData, callback){
				var dropDownLayer = this.dropDownLayer;
				dropDownLayer.html("loading..");
				dropDownLayer.display(true);
				void function(){
					dropDownLayer.html("");
					dropDownLayer.display(false);
					var subContainerIds = [];
					var subContainers = [];
					childsData.forEach(function(item, index){
						subContainerIds[index] = Lichee.id();
						subContainers[index] = "<div id='" + subContainerIds[index] + "' class='node clearfix'></div>";
					});
					dropDownLayer.html(subContainers.join(""));
					var list = [];
					childsData.forEach(function(item, index){
						var nodeItem = new node({
							container: subContainerIds[index],
							name: item.n,
							childsData: item.childs,
							tree: this.tree,
							expanded: item.expanded,
							clickHandler: this.clickHandler,
							nameRenderer: this.nameRenderer
						});
						nodeItem.parent = this;
						nodeItem.render();
						list.push(nodeItem);
					}.bind(this));
					this.tree.lists.push(list);
					this.childs = list;
					callback && callback();
				}.defer(this, 0);
			},

			setViewChecked: function(){
				var checkinput = E(this.checkinputId, true);
				var checkedValue = this.tree.dataMapping[this.name].checked;
				if(checkedValue == this.checked)
					return ;
				this.checked = checkedValue;
				switch(checkedValue){
					case 0:
						checkinput.disabled = false;
						checkinput.checked = false;
						break;
					case .5:
						checkinput.disabled = true;
						checkinput.checked = true;
						break;
					case 1:
						checkinput.checked = true;
						checkinput.disabled = false;
						break;
				}
			},

			disposeEvent: function(){
				var nameEl = E(this.namelinkId);
				var expandedViewer = E(this.expandedViewerId);
				var checkinput = E(this.checkinputId);
				var checkClicker = E(this.checkClickerId);

				nameEl.addEvents({
					focus: function(){
						nameEl.addClass("focus");
					}.bind(this),

					blur: function(){
						nameEl.delClass("focus");
					}.bind(this),

					mousedown: function(){
						if(this.tree.selectionNode){
							var lastNameEl = E(this.tree.selectionNode.namelinkId);
							lastNameEl.delClass("selected");
						}

						this.tree.selectionNode = this;
						nameEl.addClass("selected");
					}.bind(this),

					click: function(){
						if(!this.expanded)
							this.expand();
						this.clickHandler(this.name);
					}.bind(this)
				});

				expandedViewer.addEvents({
					click: function(){
						if(this.expanded){
							this.collapse();
						}else{
							this.expand();
						}
					}.bind(this)
				});

				if(this.tree.enableCheckBox){
					checkClicker.addEvents({
						click: function(){
							var checkValue = this.tree.dataMapping[this.name].checked;
							switch(checkValue){
								case 0:
								case .5:
									this.setCheck(1);
									break;
								case 1:
									this.setCheck(0);
									break;
							}
						}.bind(this)
					});
				}
			},

			// 修正 checkClicker 位置偏差问题
			fixRelativeEls: function(step){
				if(!this.tree.enableCheckBox)return ;
				if(step == 1){
					E(this.checkClickerId).style("top", "0");
				}else if(step == 2){
					E(this.checkClickerId).style("top", "-20px");
				}
			}
		}
	);

	var tree = new Lichee.Class(
		/* constructor */ function(conf){
			this.container = E(conf.container);
			this.data = conf.data;
			this.enableCheckBox = typeof conf.enableCheckBox == "boolean" ?
				conf.enableCheckBox : true;
			this.clickHandler = conf.clickHandler;
			this.nameRenderer = conf.nameRenderer;
			this.nodes = [];
			this.nodeMapping = {};
			this.lists = [];

			var formatedData = formatData(conf.data);
			this.formatedData = formatedData[0];
			this.dataMapping = formatedData[1];
		},

		/* methods */ {
			render: function(){
				var innerContainer = Lichee.makeElement("div", { "class": "simpletree" });
				this.container.add(innerContainer = E(innerContainer));

				var subContainerIds = [];
				var subContainers = [];
				this.formatedData.forEach(function(item, index){
					subContainerIds[index] = Lichee.id();
					subContainers[index] = "<div id='" + subContainerIds[index] + "' class='node clearfix'></div>";
				});
				innerContainer.html(subContainers.join(""));

				var list = [];
				this.formatedData.forEach(function(item, index){
					var nodeItem = new node({
						container: subContainerIds[index],
						name: item.n,
						childsData: item.childs,
						tree: this,
						expanded: item.expanded,
						clickHandler: this.clickHandler,
						nameRenderer: this.nameRenderer
					});
					nodeItem.parent = this;
					nodeItem.render();
					list.push(nodeItem);
				}.bind(this));
				this.lists.push(list);
				this.childs = list;
				this.updateListLastNodes();
			},

			getCheckedData: function(){
				// TODO:
			},

			getRoot: function(){
				return this.nodes[0];
			},

			focusToKey: function(key){
				var dataMapping = this.dataMapping;
				var data = dataMapping[key];
				var nodeMapping = this.nodeMapping;
				var arr = [], pn;

				var tp = data;
				while(true){
					tp = dataMapping[tp.p];
					if(tp){
						arr.unshift(tp.n);
					}else{
						break;
					}
				}

				var expand = function(){
					var d, n;
					if(d = arr.shift()){
						n = nodeMapping[d];
						n.expand(expand);
					}else if(d = nodeMapping[key]){
						d.focus();
					}
				};
				expand();
			},

			// 只更新 dataMapping 中某个节点的选中状态（会自动关联更新其它节点的更新状态），但界面上不作更新
			setNodeCheckWithoutUpdate: function(name, value){
				var dataMapping = this.dataMapping;
				var dataItem = dataMapping[name];
				updateCheckStates(dataMapping, dataItem, value);
			},

			// 根据 dataMapping 中记录的选中状态，更新界面，obj 为参考的节点实例，会根据 obj 来自动找出需要更新的节点的界面
			// 如果没有 obj 参数，则更新所有已渲染的节点
			updateNodeCheckStates: function(obj){
				if(obj){
					var nodes = [obj], p = obj;
					var inwards = function(node){
						if(node.childs){
							nodes.push.apply(nodes, node.childs);
							node.childs.forEach(function(node){
								if(node.expanded)
									inwards(node);
							});
						}
					};
					inwards(p);
					while(p = p.parent)
						nodes.push(p);
				}else{
					nodes = this.nodes;
				}

				nodes.forEach(function(node, index){
					node.setViewChecked && node.setViewChecked();
				});
			},

			// privates
			updateListLastNodes: function(){
				var lists = this.lists;
				lists.forEach(function(list, index){
					var length = list.length;
					var found = false;
					for(var i = length - 1; i >= 0; i --){
						var node = list[i];
						if(!node.isHidden){
							if(found){
								node.setItsLast(false);
							}else{
								found = true;
								node.setItsLast(true);
							}
						}
					}
				});
			},

			// 修正 checkClicker 位置偏差问题
			fixRelativeEls: function(){
				var nodes = this.nodes;
				nodes.forEach(function(node){
					node.fixRelativeEls(1);
				});
				setTimeout(function(){
					nodes.forEach(function(node){
						node.fixRelativeEls(2);
					});
				}, 0);
			}
		}
	);

	return tree;
});