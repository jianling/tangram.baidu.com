module.declare(function(require, exports, module){
	var Lichee = require("./lichee.js");
	var E = Lichee.Element, Q = Lichee.queryElement;

	var formatData = function(data){
		var formatedData = [];
		var dataItemStates = {};
		var undefinedParentChilds = {};
		data.forEach(function(item, index){
			var p;
			item.childs = [];
			if(item.p){
				if(p = dataItemStates[item.p]){
					p.childs.push(item);
				}else if(p = undefinedParentChilds[item.p]){
					p.push(item);
				}else{
					undefinedParentChilds[item.p] = [item];
				}
			}else{
				formatedData.push(item);
			}

			dataItemStates[item.n] = item;
			if(undefinedParentChilds[item.n]){
				item.childs = undefinedParentChilds[item.n].concat(item.childs);
				delete undefinedParentChilds[item.n];
			}
		});
		return formatedData;
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
		"<div class='name'><a id='@{namelinkId}' href='' onclick='return false;'>@{name} </a></div>");

	var node = new Lichee.Class(
		/* constructor */ function(conf){
			this.container = E(conf.container);
			this.icon = conf.icon || "images/tree/etfolder.gif";
			this.name = conf.name || "";
			this.childsData = conf.childsData;
			this.tree = conf.tree;
			this.expanded = !! conf.expanded;
			this.checked = 0; // 0, 0.5, 1
			this.tree.nodes.push(this);
		},

		/* methods */ {
			render: function(){
				this.container.html(nodeTemplate.apply({
					name: this.name.htmlEncode(),
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

			expand: function(){

				if(!this.hasExpanded && this.childsData.length){
					this.hasExpanded = true;
					this.renderChilds(this.childsData);
					if(this.checked === 0 || this.checked == 1){
						this.updateSubsCheckState();
					}
				}

				if(!this.dropDownLayer)return ;
				this.dropDownLayer.display(true);
				E(this.expandedViewerId).style("backgroundPosition", "0 -20px");
				this.expanded = true;
				this.tree.updateListLastNodes();
				this.tree.fixRelativeEls();
			},

			collapse: function(){
				if(!this.dropDownLayer)return ;
				this.dropDownLayer.display(false);
				E(this.expandedViewerId).style("backgroundPosition", "0 0");
				this.expanded = false;
				this.tree.fixRelativeEls();
			},

			setCheck: function(value, _dire){ // _dire 1: 向外 0: 向里
				this.checked = value;
				var checkinput = E(this.checkinputId, true);
				switch(value){
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

				if(_dire === 1 && this.parent){
					var updateCheckState = this.parent.updateCheckState;
					updateCheckState && updateCheckState.defer(this.parent, 0);

				}else if(_dire === 0 && this.childs){
					this.updateSubsCheckState.defer(this, 0);
				}else{
					this.childs && this.updateSubsCheckState();
					if(this.parent){
						var updateCheckState = this.parent.updateCheckState;
						updateCheckState && updateCheckState.defer(this.parent, 0);
					}
				}
			},

			updateCheckState: function(){
				var childs = this.childs;
				var sum = childs.reduce(function(sum, node){
					return sum + node.checked;
				}, 0);
				if(sum == 0){
					this.setCheck(0, 1);
				}else if(sum == childs.length){
					this.setCheck(1, 1);
				}else{
					this.setCheck(.5, 1);
				}
			},

			updateSubsCheckState: function(){
				var checked = this.checked;
				this.childs.forEach(function(node){
					node.setCheck(checked, 0);
				});
			},

			setHidden: function(bool){
				this.isHidden = bool;
				this.container.display(bool);
				if(this.dropDownLayer)
					this.dropDownLayer.display(bool);
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
			renderChilds: function(childsData){
				var dropDownLayer = this.dropDownLayer;

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
						expanded: item.expanded
					});
					nodeItem.parent = this;
					nodeItem.render();
					list.push(nodeItem);
				}.bind(this));
				this.tree.lists.push(list);
				this.childs = list;
			},

			disposeEvent: function(){
				var nameEl = E(this.namelinkId);
				var expandedViewer = E(this.expandedViewerId);
				var checkinput = E(this.checkinputId);
				var checkClicker = E(this.checkClickerId);

//				if(this.name == "baidu.tools"){
//					checkClicker.style("backgroundColor", "red");
//				}

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
						if(!this.expanded){
							this.expand();
						}
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

				checkClicker.addEvents({
					click: function(){
						var checkValue = this.checked;
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
			},

			fixRelativeEls: function(step){
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
			this.formatedData = formatData(conf.data);
			this.nodes = [];
			this.lists = [];
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
						expanded: item.expanded
					});
					nodeItem.parent = this;
					nodeItem.render();
					list.push(nodeItem);
				}.bind(this));
				this.lists.push(list);
				this.childs = list;
				this.updateListLastNodes();
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

			updateSubsCheckState: function(){
				var checked = this.checked;
				this.childs.forEach(function(node){
					node.setCheck(this.checked, 0);
				});
			},

			fixRelativeEls: function(){
				this.nodes.forEach(function(node){
					node.fixRelativeEls(1);
				});
				setTimeout(function(){
					this.nodes.forEach(function(node){
						node.fixRelativeEls(2);
					});
				}.bind(this), 0);
			}
		}
	);

	return tree;
});