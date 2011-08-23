/**
 * 统计
 * filename: stat.js
 * author: dron
 * date: 2011-08-22
 */

// 当前页面总 pv 统计
statSend({ name: "pv" });

function statSend(data, delayCallback){
	var pageName = pageConfig.name || "";
	var gotoUrl = encodeURIComponent(location.href);
	var image = document.createElement("img");

	var params = [
		"pageName=" + pageName
	];

	for(var i in data)
		if(data.hasOwnProperty(i))
			params.push(i + "=" + encodeURIComponent(data[i]));

	with(image.style){
		width = height = "1px";
		left = top = "-10px";
		position = "absolute";
	}

	document.body.appendChild(image);
	image.onload = image.onerror = function(){
		image.onload = image.onerror = null;
		document.body.removeChild(image); }
	image.src = "http://nsclick.baidu.com/v.gif?pid=316&url=" + gotoUrl + "&type=0&" + params.join("&");

	delayCallback && setTimeout(delayCallback, 100);
}