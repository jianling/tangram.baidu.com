module.declare(function(require, exports, module){

	var Lichee = require("./lichee");
	var E = Lichee.Element, Q = Lichee.queryElement;

	var textover = function(text){
		return text.subByte(18, "..").replace(/\.\.$/, "<span class='textover'>...</span>");
	};

	var layerTemplate = new Lichee.Template(
		"<div class='simplemenu'>",
			"<div class='simplemenu-top'></div>",
			"<div class='simplemenu-main'>@{items}</div>",
			"<div class='simplemenu-bottom'></div>",
		"</div>");

	var itemTemplate = new Lichee.Template(
		"<div class='simplemenu-item@{extendClass}' id='@{id}' hasSubmenu='@{hasSubmenu}'><a href='name:@{name}' title='@{name}' onclick='return false;'>@{text}</a></div>");

	var simplemenu = new Lichee.Class(
		/* constructor */ function(conf){
			this.referrerElement = E(conf.referrerElement);
			this.direction = Lichee.fixString(conf.direction, "right");
			this.datas = conf.datas;
		},

		/* methods */ {
			stopCollapse: function(){
				clearTimeout(this.deferCollapse);
				if(this.parent)
					this.parent.stopCollapse();
				if(this.referrerElement)
					this.referrerElement.addClass("simplemenu-item-expanded");
			},

			expand: function(){
				this.layer.style("zIndex", ++ simplemenu.zIndex);
				this.resetPos();
				this.layer.fadeIn();
			},

			collapse: function(){
				this.layer.fadeOut();
				if(this.referrerElement)
					this.referrerElement.delClass("simplemenu-item-expanded");
			},

			setParent: function(menu){
				this.parent = menu;
			},

			resetPos: function(){
				var pos = this.referrerElement.getPos();
				var size = this.referrerElement.getSize();
				var x, y;

				if(this.direction == "down"){
					x = pos.x - 1;
					y = pos.y + size.height;
				}else if(this.direction == "right"){
					x = pos.x + size.width - 3;
					y = pos.y;
				}

				this.layer.left(x).top(y);
			},

			render: function(){
				var layer = Lichee.makeElement("div", {
					"style": "position: absolute; display: none;" });
				document.body.appendChild(layer);

				var subMenus = {};
				var itemsId = [];
				var itemsHtml = this.datas.map(function(data, index){
					var hasSubmenu = 0;
					itemsId[index] = Lichee.id();
					if(data.datas){
						hasSubmenu = 1;
						subMenus[itemsId[index]] = {
							referrerElement: itemsId[index],
							direction: "right",
							datas: data.datas
						};
					}

					return itemTemplate.apply({
						id: itemsId[index],
						name: data.name,
						text: textover(data.name),
						hasSubmenu: hasSubmenu,
						extendClass: hasSubmenu ? " simplemenu-arrow" : ""
					});
				});

				var html = layerTemplate.apply({
					items: itemsHtml.join("")
				});

				this.layer = E(layer);
				this.layer.html(html);
				this.items = Q(".simplemenu-item", this.layer.dom).map(function(dom){
					return E(dom);
				});

				this.disposeEvent();
				this.disposeSubMenus(subMenus);

				this.rendered = true;
			},

			// privates
			disposeEvent: function(){
				this.referrerElement.addEvents({
					mouseover: this.referrerElementMouseover.bind(this),
					mouseout: this.referrerElementMouseout.bind(this)
				});
				this.layer.addEvents({
					mouseover: this.layerElementMouseover.bind(this),
					mouseout: this.layerElementMouseout.bind(this)
				});
				this.items.forEach(function(item){
					item.addEvents({
						mouseover: function(){
							if(item.attr("hasSubmenu") == "1"){
								var id = item.attr("id");
								var menu = this.subMenus[id];
								if(!menu.rendered){
									menu.render();
									menu.expand();
								}
							}
						}.bind(this)
					});
				}.bind(this));
			},

			referrerElementMouseover: function(){
				this.stopCollapse();
				this.expand();
			},

			referrerElementMouseout: function(){
				this.deferCollapse = this.collapse.defer(this, 200);
				if(this.referrerElement)
					this.referrerElement.delClass("simplemenu-item-expanded");
			},

			layerElementMouseover: function(){
				this.stopCollapse();
			},

			layerElementMouseout: function(){
				this.deferCollapse = this.collapse.defer(this, 200);
				if(this.parent)
					this.parent.layerElementMouseout();
//				if(this.referrerElement)
//					this.referrerElement.delClass("simplemenu-item-expanded");
			},

			disposeSubMenus: function(subMenus){
				this.subMenus = {};
				Lichee.each(subMenus, function(conf, id){
					this.subMenus[id] = new simplemenu(conf);
					this.subMenus[id].setParent(this);
				}.bind(this));
			}
		}
	);

	simplemenu.zIndex = 1000;

	return simplemenu;

});