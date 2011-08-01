function JsDocFile(){
    IO.include('../templates/tangram/tangram-conf.js');
    this._conf = conf;
}
JsDocFile.prototype = {
    isJsFile: function(file){
        return /\.js$/i.test(file.getName());
    },
    
    _importRecursion: function(packAge, resultSet){
        if(resultSet.hash[packAge]){return;}
        var array = [],
            content = IO.readFile(this._conf[resultSet.type + '_in'] + '/' + packAge + '.js')
                .replace(/\/\/\/import\s([^;]+);/g, function(mc, c){
                    array.push(c.replace(/\./g, '/'));
                    return '';//replace ///import to ''
                });
        for(var i = 0; i < array.length; i++){
            this._importRecursion(array[i], resultSet);
        }
        resultSet.hash[packAge] = packAge;
        resultSet.list.push(packAge);
        resultSet.content.push(content);
    },
    
    _fileRecursion: function(file, resultSet){
        var path = file.getPath();
        if(file.isFile()){
            if(!this.isJsFile(file)
                || file.getName() == 'import.js'){return;}
            var packAge = String(path.substring(path.lastIndexOf('baidu'), path.length() - 3));
            this._importRecursion(packAge.replace(/\\/g, '/'), resultSet);
        }else{
            var fileList = file.list(),
                len = fileList.length;
            for(var i = 0; i < len; i++){
                this._fileRecursion(new File(path + '/' + fileList[i]), resultSet);
            }
        }
    },
    
    createTangramBaseFile: function(){
        var file = new File(this._conf.tangram_base_in),
            conf = this._conf,
            resultSet = {type: 'tangram_base', list: [], hash: {}, content: []};
        this._fileRecursion(file, resultSet);
        IO.mkPath(conf.tangram_base_out.split('/'));
        IO.saveFile(conf.tangram_base_out, conf.tangram_base_fileName, resultSet.content.join('\n'));
    },
    
    createTangramUIFile: function(){
        var file = new File(this._conf.tangram_base_in),
            conf = this._conf,
            resultSet = {type: 'tangram_base', list: [], hash: {}, content: []};
        this._fileRecursion(file, resultSet);
        file = new File(this._conf.tangram_ui_in);
        resultSet.type = 'tangram_ui';
        this._fileRecursion(file, resultSet);
        IO.mkPath(conf.tangram_ui_out.split('/'));
        IO.saveFile(conf.tangram_ui_out, conf.tangram_ui_fileName, resultSet.content.join('\n'));
    },
    
    createTangramMobileFile: function(){
        
    },
    
    createDocJsonFile: function(symbolSet){
        var conf = this._conf,
            template = new JSDOC.JsPlate(conf.tangram_docjson_template),
            fileName = this.getFileName(),
            list = symbolSet.toArray().filter(function(item){
		        return /^(?:T|baidu)\.[^#:_\-]+$/.test(item.alias);
		    }).sort(this.makeSortby("alias"));
        IO.mkPath(conf.tangram_docjson_out.split('/'));
        IO.saveFile(conf.tangram_docjson_out, fileName + '.js', template.process({ident: fileName, list: list}));
    },
    
    createPageJsonFile: function(){
        var conf = this._conf,
            template = new JSDOC.JsPlate(conf.tangram_pagejson_template),
            content = IO.readFile(conf.tangram_pagejson_in).replace(/[\r\n]/g, ''),
            json = {},
            dis = {
                'version': 'tangramLatestVersion',
		        'all_release.js': 'fullVersion',
		        'all_release_src.js': 'fullVersionSrc',
		        'core_release.js': 'coreVersion',
		        'core_release_src.js': 'coreVersionSrc'
		    };
        content.split(';').forEach(function(item){
            var c = item.split('='),
                key = dis[c[0]];
                val = key && c[1].split(','),
                fileSize = 0;
            if(key){
                c[0] == 'version' && (json[key] = val);
                if(val.length > 1){
                    fileLen = parseInt(val[1])/1024;
                    json[key + 'Md5'] = val[0];
                    json[key + 'Size'] = fileLen.toFixed(1);
                    json[key + 'GzipSize'] = '0';
                }
            }
        });
        IO.mkPath(conf.tangram_pagejson_out.split('/'));
        IO.saveFile(conf.tangram_pagejson_out, 'conf.js', template.process(json));
    },
    
    getFileName: function(){
        var fileName = 'tangram#{mobile}#{base}#{component}', json = {};
	    String(JSDOC.opt.srcFiles).replace(/mobile|base|component/g, function(matcher){
	        matcher = matcher.toLowerCase();
	        json[matcher] = 1;
	    });
	    return fileName.replace(/#\{([^#]+)\}/g, function(m0, m1){
	        return json[m1] ? '_' + m1 : '';
	    });
    },

	/** Make a symbol sorter by some attribute. */
	makeSortby: function(attribute) {
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
};