/** Called automatically by JsDoc Toolkit. */
function publish(symbolSet) {
    IO.include('../templates/tangram/JsDocFile.js');
    var file = new JsDocFile();
    if(String(JSDOC.opt.srcFiles).lastIndexOf('empty.js') > -1){
        file.createTangramBaseFile();
        file.createTangramUIFile();
        file.createTangramMobileFile();
        file.createCodeSearchTreeMapFile();
    }else{
        file.createDocJsonFile(symbolSet);
    }
    file.createPageJsonFile();
}