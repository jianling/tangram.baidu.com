/** Called automatically by JsDoc Toolkit. */
function publish(symbolSet) {
    IO.include('../templates/tangram/JsDocFile.js');
    var file = new JsDocFile();
    if(String(JSDOC.opt.srcFiles).lastIndexOf('empty.js') > -1){
        file.createTangramBaseFile();
        file.createTangramUIFile();
//        file.createTangramMobileFile();
    }else{
//        file.createDocJsonFile(symbolSet);
        
    }
    file.createPageJsonFile();
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
    String(JSDOC.opt.srcFiles).replace(/mobile|base|component/g, function(matcher){
        matcher = matcher.toLowerCase();
        json[matcher] = 1;
    });
    return fileName.replace(/#\{([^#]+)\}/g, function(m0, m1){
        return json[m1] ? '_' + m1 : '';
    });
}