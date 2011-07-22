/** Called automatically by JsDoc Toolkit. */
function publish(symbolSet) {
    var conf = {
        ext: '.js',
        outDir: JSDOC.opt.d || SYS.pwd + '../out/jsdoc/',
        templatesDir: SYS.pwd + '../templates/tangram/'
    },
    list = symbolSet.toArray().filter(function(item){
        return /^(?:T|baidu)\.[^#:_\-]+$/.test(item.alias);
    }).sort(makeSortby("alias")),
    template = new JSDOC.JsPlate(conf.templatesDir + 'tangram-json.tmpl'),
    fileName = getFileName();
    
    IO.mkPath(conf.outDir.split('/'));
    IO.saveFile(conf.outDir, fileName + conf.ext, template.process({ident: fileName, list: list}));
}
/** Make a symbol sorter by some attribute. */
function makeSortby(attribute) {
	return function(a, b) {
		if (a[attribute] != undefined && b[attribute] != undefined) {
			a = a[attribute].toLowerCase();
			b = b[attribute].toLowerCase();
			if (a < b) return -1;
			if (a > b) return 1;
			return 0;
		}
	}
}
/** */
function getFileName(){
    var fileName = 'tangram#{mobile}#{base}#{component}', json = {};
    JSDOC.opt.srcFiles.toString().replace(/mobile|base|component/g, function(matcher){
        matcher = matcher.toLowerCase();
        json[matcher] = 1;
    });
    return fileName.replace(/#\{([^#]+)\}/g, function(m0, m1){
        return json[m1] ? '_' + m1 : '';
    });
}