function JsDocFile(){
    IO.include('../templates/tangram/tangram-conf.js');
    this._conf = conf;
}
JsDocFile.prototype = {
    isJsFile: function(file){
        return /\.js$/i.test(file.getName());
    },
    
    _recursionImport: function(file, entity, resultSet){
        if(resultSet.hash[entity.name]){return;}
        var _this = this,
            array = [],
            packages = entity.name.replace(/\./g, '/') + '.js';
            content = IO.readFile(this._conf[resultSet.type + '_in'] + '/' + packages)
                .replace(/\/\/\/import\s([^;]+);/g, function(mc, c){
                    array.push(c);
                    return '';//replace ///import to ''
                });
        array.forEach(function(item){
            _this._recursionImport(null, {name: item}, resultSet);
        });
        resultSet.hash[entity.name] = entity.name;
        resultSet.content.push(content);
    },
    
    _recursion: function(file, resultSet, opt){
        var _this = this;
        if(file.isFile()){
            if(!this.isJsFile(file) || file.getName() == 'import.js'){return;}
            //
            var fileName = String(file.getName()),
                parent = String(file.getParent()),
                index = parent.lastIndexOf('baidu'),
                entity;
            fileName = fileName.replace(/\.js$/, '');
            parent = index > -1 ? parent.substring(index, parent.length).replace(/[\/\\]/g, '.') : null;
            entity = {name:(parent ? parent + '.' + fileName : fileName), par: parent};
            resultSet.packages.push(entity);
//            opt && opt.fileHandler && opt.fileHanldler.call(_this, file, entity);
            opt && opt.fileHandler && opt.fileHandler.apply(_this, [file, entity, resultSet]);
        }else{
            var fileList = file.list();
            fileList.forEach(function(item){
                _this._recursion(new File(file.getPath() + '/' + item), resultSet, opt);
            });
        }
    },
    
    createTangramBaseFile: function(){
        var conf = this._conf,
            file = new File(conf.tangram_base_in),
            resultSet = {type: 'tangram_base', packages: [], hash: {}, content: []};
        this._recursion(file, resultSet, {fileHandler: this._recursionImport});
        IO.mkPath(conf.tangram_base_out.split('/'));
        IO.saveFile(conf.tangram_base_out, conf.tangram_base_fileName, resultSet.content.join('\n'));
    },
    
    createTangramUIFile: function(){
        var file = new File(this._conf.tangram_base_in),
            conf = this._conf,
            resultSet = {type: 'tangram_base', packages: [], hash: {}, content: []};
        this._recursion(file, resultSet, {fileHandler: this._recursionImport});
        file = new File(this._conf.tangram_ui_in);
        resultSet.type = 'tangram_ui';
        resultSet.content = [];
        this._recursion(file, resultSet, {fileHandler: this._recursionImport});
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
                fileSize = 0,
                gzFileSize = 0;
            if(key){
                c[0] == 'version' && (json[key] = val);
                if(val.length > 1){
                    fileSize = parseInt(val[1])/1024;
                    gzFileSize = parseInt(val[2])/1024;
                    json[key + 'Md5'] = val[0];
                    json[key + 'Size'] = fileSize.toFixed(1);
                    json[key + 'GzipSize'] = gzFileSize.toFixed(1);
                }
            }
        });
        IO.mkPath(conf.tangram_pagejson_out.split('/'));
        IO.saveFile(conf.tangram_pagejson_out, 'conf.js', template.process(json));
    },
    
    
    createCodeSearchTreeMapFile: function(){
        var _this = this,
            conf = this._conf,
            template = new JSDOC.JsPlate(conf.tangram_csTreeMap_template),
            file = new File(conf.tangram_csTreeMap_in),
            path = file.getPath(),
            resultSet;
            
        function depend(file, entity, resultSet){
            var array = [],
                content = IO.readFile(file)
                .replace(/\/\/\/import\s([^;]+);/g, function(mc, c){
                    array.push(c);
                    return '';//replace ///import to ''
                });
            resultSet.depend[entity.name] = array;
        }
        
        resultSet = {packages: [], depend: {}};
        _this._recursion(new File(path + '/' + file.list()[0]+ '/' + 'src'),
            resultSet,
            {fileHandler: depend});
        file.list().forEach(function(item){
            resultSet = {type: item.toLowerCase().replace('-', '_') + '_csmap', packages: [], depend: {}};
            _this._recursion(new File(path + '/' + item+ '/' + 'src'),
                resultSet,
                {fileHandler: depend});
            IO.mkPath(conf.tangram_csTreeMap_out.split('/'));
            IO.saveFile(conf.tangram_csTreeMap_out, resultSet.type + '.js', template.process(resultSet));
        });
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