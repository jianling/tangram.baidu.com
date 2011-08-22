/**
 * tangram-doc-main
 * filename: main.js
 * author: dron
 * date: 2011-07-25
 */

void function(){

	var getpath = function(){
		var rootPath = "";
		if(pageConfig.prepath)
			rootPath = pageConfig.prepath.replace(/\w+/g, "..");
		return function(path){
			return rootPath + path;
		};
	}();

	// 布署顶部导航栏
	FlyScript.load(getpath("js/lichee"), function(Lichee){
		var E = Lichee.Element, Q = Lichee.queryElement;

		var template = new Lichee.Template(
			"<div class='item' id='@{id}'></div>");
		var navHighlights = E(Q("#nav-cont .nav-highlights")[0]);
		var containerIds = [];
		var htmls = [1,2,3,4].map(function(value, index){
			return template.apply({
				id: containerIds[index] = Lichee.id()
			});
		});
		navHighlights.html(htmls.join(""));

		var slippages = [];
		containerIds.forEach(function(id, index){
			var sp = slippages[index] = new Lichee.BasicSlippage({
				container: E(id),
				width: 126,
				height: 35,
				image: "images/nav-item.png",
				length: 2,
				position: 0
			});
			sp.render();
		});

		var texts = Q(".nav-texts .item").map(function(dom){
			return E(dom);
		});
		texts.forEach(function(element, index){
			var sp = slippages[index];
			element.addEvents({
				click: function(){
					var href = E(this).attr("href");
					if(href)
						location.href = getpath(href);
				},
				mouseover: function(){
					sp.change(1);
					element.addClass("hl");
				},
				mouseout: function(){
					sp.change(0);
					element.delClass("hl");
				}
			});
		});

		// 搜索框
		var searchinput = E("searchinput"), searchbutton = E("searchbutton");
		searchinput.useMouseAction("searchinput", "over,out");
		searchbutton.useMouseAction("searchbutton", "over,out,down,up");

		var doSearch = function(text){
			if(text = text.trim()){
				text = encodeURIComponent(text);
				page.statSend({
					name: "search-key",
					value: text
				}, function(){
					window.open(getpath("./search.html?key=" + text), "_self");
				});
			}
		};

		searchinput.addEvents({
			focus: function(){
				setTimeout(function(){
					this.select();
				}.bind(this), 0);
			},

			keydown: function(e){
				e = Lichee.Event(e);
				if(e.keyCode == 13){
					searchbutton.addClass("searchbutton-down");
//					doSearch(this.value);
				}
			},

			keyup: function(e){
				e = Lichee.Event(e);
				if(e.keyCode == 13){
					searchbutton.delClass("searchbutton-down");
					doSearch(this.value);
				}
			}
		});

		searchbutton.addEvents({
		    click: function(e){
				doSearch(searchinput.dom.value);
		    }
		});
	});

	// 布署顶部导航的下拉菜单
	setTimeout(function(){
		FlyScript.load(getpath("js/simplemenu"), getpath("js/lichee"), function(simplemenu, Lichee){
			var E = Lichee.Element, Q = Lichee.queryElement;

			var downMenu = new simplemenu({
				referrerElement: "menu-down",
				direction: "down",
				datas: [
					{ name: "常规下载", link: getpath("download.html"), target: "_self" },
					{ name: "自定义下载", link: getpath("custom.html"), target: "_self" }
				],
				handle: function(conf){
					conf.link && window.open(conf.link, conf.target);
				}
			});
			downMenu.render();

			var docMenu = new simplemenu({
				referrerElement: "menu-doc",
				direction: "down",
				datas: [
//					{ name: "mobile 开发系列", datas: [
//						{ name: "mobile web 的未来" },
//						{ name: "需要 jquery 吗" },
//						{ name: "链式调用" },
//						{ name: "常用技巧" },
//						{ name: "移动浏览器的 viewport" },
//						{ name: "iframe 的问题" },
//						{ name: "基础方法" },
//						{ name: "UI 组件" },
//						{ name: "事件处理", datas: [
//							{ name: "事件处理(一)" },
//							{ name: "事件处理(二)" },
//							{ name: "事件处理(三)" }
//						] },
//						{ name: "动画效果", datas: [
//							{ name: "动画效果(一)" },
//							{ name: "动画效果(二)" }
//						] },
//						{ name: "离线存储", datas: [
//							{ name: "离线存储(一)" },
//							{ name: "离线存储(二)" }
//						] },
//						{ name: "本地存储" }
//					] },
					{ name: "tangram 最佳实践", datas: [
						{ name: "Base 入门", link: getpath('docs/Tangram-Base.html'), target: '_self' },
						{ name: "Component 入门", link: getpath('docs/Tangram-Component.html'), target: '_self' },
						{ name: "UI 使用指导", link: getpath('docs/Tangram-UI.html'), target: '_self' },
						{ name: "UI 组件体系", link: getpath('docs/Tangram-Component-UISys.html'), target: '_self' },
						{ name: "UIBase", link: getpath('docs/Tangram-Component-UIBase.html'), target: '_self' },
						{ name: "UI 组件开发", link: getpath('docs/Tangram-Component-Colligate.html'), target: '_self' },
						{ name: "Component 插件", link: getpath('docs/Tangram-Component-Plugins.html'), target: '_self' },
						{ name: "Behavior", link: getpath('docs/Tangram-Component-Behavior.html'), target: '_self' }
					] },
					{ name: "新手入门",link: getpath('docs/tutorial.html'), target: '_self'  },
					{ name: "快捷方式",link: getpath('docs/short.html'), target: '_self'  },
					{ name: "API 参考手册", link: getpath("api.html"), target: '_self' }
//					{ name: "mobile 文档" }
				],
				handle: function(conf){
					conf.link && window.open(conf.link, conf.target);
				}
			});
			docMenu.render();

			var moreMenu = new simplemenu({
				referrerElement: "menu-more",
				direction: "down",
				datas: [
					{ name: "FAQ"  ,link: getpath('docs/faq.html'), target: '_self'},
					{ name: "BLOG" ,link: 'http://www.baiduux.com/tag/tangram/', target: '_blank' },
					{ name: "社区" ,link: 'http://tieba.baidu.com/f?kw=tangram', target: '_blank' },
					{ name: "关于" ,link: getpath('docs/about.html'), target: '_self'},
					{ name: "贡献" ,datas:[
						{ name: "贡献列表" ,link:  getpath('docs/contribution.html'), target: '_self'},
						{ name: "贡献说明" ,link:  getpath('docs/contribution-notice.html'), target: '_self'}
					]}
				],
				handle: function(conf){
					conf.link && window.open(conf.link, conf.target);
				}
			});
			moreMenu.render();
		});
	}, 0);

	// 变量替换处理
	FlyScript.load(getpath("js/variable"));

	{include stat.js}

	// 加载页面逻辑
	if(pageConfig.script){
		FlyScript.load(pageConfig.script, function(page){
			page.start();
			window.page = page;
			page.statSend = statSend;
		});
	}else{
		window.page = {
			statSend: statSend
		};
	}
}();