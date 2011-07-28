module.declare(function(require, exports, module){
	exports.start = start;

	var conf = require("./conf");
	var Lichee = require("./lichee");
	var E = Lichee.Element, Q = Lichee.queryElement;

	E("q1").addEvents({
		click: function(){
			var x = E(Q(".an", this.parentNode.parentNode)[0]);
			x.display(!x.display());
		}
	});

	var donwloadUrl = new Lichee.Template(
		"http://tangram.baidu.com/download/@{fileName}");

	var downloadFile = [
		new Lichee.Template("tangram-@{version}.js"),
		new Lichee.Template("tangram-@{version}.source.js"),
		new Lichee.Template("tangram-@{version}.core.js"),
		new Lichee.Template("tangram-@{version}.core.source.js") ];

	var scriptTagTemplate = new Lichee.Template(
		"<script type=\"text/javascript\" src=\"http://img.baidu.com/js/@{fileName}\"></script>");
	var fileNameTemplate = [
		new Lichee.Template("tangram-base-@{version}.js"),
		new Lichee.Template("tangram-base-core-@{version}.js")];

	function start(){
		var version = { version: conf.tangramLatestVersion };

		var downloadLink = Q(".download-link");
		downloadLink.forEach(function(downloadLink, index){
			E(downloadLink).attr("href", donwloadUrl.apply({
				fileName: downloadFile[index].apply(version) }));
		});

		var cdnInput = Q(".cdn-input");
		cdnInput.forEach(function(cdnInput, index){
			cdnInput.value = scriptTagTemplate.apply({
				fileName: fileNameTemplate[index].apply(version) });
			E(cdnInput).addEvents({
				focus: function(){
					setTimeout(function(){
						this.select()
					}.bind(this), 0);
				}
			});
		});
	}
});