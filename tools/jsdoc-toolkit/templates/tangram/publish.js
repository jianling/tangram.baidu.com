/** Called automatically by JsDoc Toolkit. */
function publish(symbolSet) {
    IO.include('../templates/tangram/JsDocFile.js');
    var file = new JsDocFile();
    if(String(JSDOC.opt.srcFiles).lastIndexOf('empty.js') > -1){
        file.createTangramBaseFile();
        LOG.warn('----------tangram base big file created----------');
        file.createTangramUIFile();
        LOG.warn('----------tangram component big file created----------');
        file.createTangramMobileFile();
        LOG.warn('----------tangram mobild big file created----------');
        file.createPageJsonFile();
        LOG.warn('----------conf.js file created----------');
        file.createCodeSearchTreeMapFile();
        LOG.warn('----------codesearch tree map file created----------');
    }else{
        file.createDocJsonFile(symbolSet);
        LOG.warn('----------doc json file created----------');
    }
    file.createPageJsonFile();
}