var conf = {
    tangram_base_in: SYS.userDir + '/../../source/github/Tangram-base/src',
    tangram_ui_in: SYS.userDir + '/../../source/github/Tangram-component/src',
    tangram_mobile_in: '',
    
    tangram_base_out: SYS.userDir + '/mycode',
    tangram_ui_out: SYS.userDir + '/mycode',
    tangram_mobile_out: SYS.userDir + '/mycode',
    
    
    tangram_base_fileName: 'tangram-base.js',
    tangram_ui_fileName: 'tangram-component.js',
    tangram_mobile_fileName: 'tangram-base-mobile.js',
    
    tangram_conf_out: '',
    tangram_conf_fileName: '',
    
    tangram_docjson_out: JSDOC.opt.d || SYS.userDir + '/out',
    tangram_docjson_template: SYS.userDir + '/templates/tangram/tangram-json.tmpl',
    
    tangram_pagejson_in: SYS.userDir + '/../../source/md5.properties',
    tangram_pagejson_out: JSDOC.opt.d || SYS.userDir + '/../../src/js',
    tangram_pagejson_template: SYS.userDir + '/templates/tangram/tangram-page-conf.tmpl'
};