(function(){
    window.Entity = function(options){baidu.object.extend(this, options);};
    baidu.ui.DemoConsole = baidu.ui.createUI(function(options){
        var me = this;
        me._toggleId = null;//
        me._instance = null;//
        if(me.clazz.dependPackages){
            document.writeln('<script type="text/javascript" src="../js/fragment/Tangram-component/src/import.php?f='+ me.clazz.dependPackages.join(',') +'"></script>');
        }
    }).extend({
        uiType: 'democonsole',
        tplPanel: '<div id="#{panelId}" class="#{panelClass}"></div>',
        tplDOM: '<div id="#{id}" class="#{class}"><div id="#{consoleId}" class="#{consoleClass}"><div align="center" class="#{comboboxClass}"><select id="#{demoType}" class="#{demoTypeClass}" onchange="#{handler}">#{content}</select></div>#{defaultContent}</div>#{panelContent}<div class="#{btnClass}"><input type="button" value="code" onclick="#{codeHandler}"/>&nbsp;<input type="button" value="#{infoWinVal}" onclick="#{infoWinHandler}"/></div></div>',
        tplHTML: '<!DOCTYPE html>\n<html>\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n<title>#{packages}</title>\n<link type="text/css" rel="stylesheet" href="#{cssPath}/default.css"/>\n<script type="text/javascript" src="../js/download/tangram-1.3.9.core.js"></script>\n<script type="text/javascript" src="../js/fragment/Tangram-component/src/import.php?f=#{packages}"></script>\n</head>\n<body>\n#{content}\n</body>\n<script type="text/javascript">\n#{jscode}\n</script>\n</html>',
        
        getPanelString: function(){
            var me = this;
            return baidu.string.format(me.tplPanel, {
                panelId: me.getId('panel'),
                panelClass: me.getClass('panel')
            });
        },
        
        getString: function(){
            var me = this,
                demoType = me.demoType,
                len = demoType.length,
                array = [];
            for(var i = 0; i < len; i++){
                array.push('<option value="' +demoType[i].key+ '">' +demoType[i].val+ '</option>');
            }
            return baidu.string.format(me.tplDOM, {
                id: me.getId(),
                'class': me.getClass(),
                consoleId: me.getId('console'),
                consoleClass: me.getClass('console'),
                comboboxClass: me.getClass('combobox'),
                demoType: me.getId('demoType'),
                demoTypeClass: me.getClass('demoTypeClass'),
                handler: me.getCallString('_onChangeHandler'),
                content: array.join(''),
                defaultContent: me.getDemoString(demoType[0].key),
                panelContent: me.getPanelString(),
                btnClass: me.getClass('btn'),
                codeHandler: me.getCallString('getCode'),
                infoWinVal: unescape('%u5728%u65B0%u7A97%u53E3%u6253%u5F00'),
                infoWinHandler: ''
            });
        },

        getEntityString: function(typeId, key){
            var me = this,
                entity = me[typeId][key],
                data = entity.data,
                event = entity.event,
                is = entity.type == 'select',
                tpl = '#{des}<#{target} id="#{id}" name="#{name}" class="#{class}" #{type} #{size} #{maxlength} value="#{val}" #{checked} #{handler}>#{content}#{foot}',
                array = [];
            data && baidu.array.each(data.key, function(item, index){
                array.push(baidu.string.format(tpl, {
                    des: is ? '' : '<label for="'+ (key + index) +'">'+ data.val[index] +'</label>',
                    target: is ? 'option' : 'input',
                    id: is ? '' : (key + index),
                    name: is ? '' : key,
                    type: is ? '' : 'type="'+ entity.type +'"',
                    val: data.key[index],
                    checked: data.key[index] == entity.defaultValue ? (is ? 'selected' : 'checked') : '',
                    content: is ? data.val[index] : '',
                    foot: is ? '</options>' : ''
                }));
            });
            return is || !data ? baidu.string.format(tpl, {
                des: entity.label ? '<label for="'+ key +'">'+ entity.label +'</label>' : '',
                target: is ? 'select' : 'input',
                id: key,
                'class': me.getClass('form' + entity.type),
                type: is ? '' : 'type="' + entity.type + '"',
                size: baidu.lang.isNumber(entity.size) ? 'size="'+ entity.size +'"' : '',
                maxlength: baidu.lang.isNumber(entity.maxlength) ? 'maxlength="'+ entity.maxlength +'"' : '',
                val: entity.defaultValue,
                handler: event ? event.eventName + '="' +me.getCallRef()+ '._onEntityHandler(event, \''+ typeId +'\', \''+ key +'\');"' : '',
                content: is ? array.join('') : '',
                foot: is ? '</select>' : ''
            }) : array.join('&nbsp;');
        },


        getDemoString: function(typeId){
            var me = this,
                groups = me.groups[typeId],
                array = [];//整体group数组
            groups && baidu.array.each(groups, function(item){//循环groups
                var is = (typeof item == 'string'),
                    entity = [];//一个group中的一个数组项
                baidu.array.each(is ? [item] : item, function(it){
                    entity.push(me.getEntityString(typeId, it));
                });
                array.push(baidu.string.format((is ? '#{content}' : '<div>#{content}</div>'), {
                    content: entity.join('&nbsp;')
                }));
            });
            return baidu.string.format('<div id="#{id}" class="#{class}">#{content}</div>', {
                id: me.getId(typeId),
                'class': me.getClass('consolegroup'),
                content: array.join('')
            });
        },

        _createInstance: function(typeId){
            var me = this,
                clazz = eval(me.clazz[me.clazz.type]),
                container = me.getPanelContainer(),
                pageConf = me[typeId].pageConf,
                opts = pageConf.options ? eval('('+ pageConf.options +')') : {},
                target;
            pageConf.html && (container.innerHTML = pageConf.html);
            pageConf.jsCode && (me.getScript().text = pageConf.jsCode);
            if(me.clazz.type == 'class'){
                me._instance = new clazz(opts);
                !opts.autoRender && me._instance.render
                    && me._instance.render(pageConf.target || container);
            }
        },

        _disposeInstance: function(){
            var me = this;
            if(me._instance){
                me._instance.dispose();
                me._instance = null;
                baidu.dom.insertHTML(me.getConsoleContainer(), 'afterEnd', me.getPanelString());
            }else{
                me.getPanelContainer().innerHTML = '';
            }
        },

        render: function(target){
            var me = this, script;
            if (!target || me.getMain()) {return;}
            script = document.createElement('script');
            script.id = me.getId('demoScript');
            script.type = 'text/javascript';
            document.body.appendChild(script);
            script = null;
            baidu.dom.insertHTML(me.renderMain(target), 'beforeEnd', me.getString());
            me._createInstance(me.demoType[0].key);
            me.dispatchEvent('onload');
        },

        _onChangeHandler: function(){
            var me = this,
                defaultKey = me.demoType[0].key,
                val = me.getSelect().value,
                ele = baidu.dom.g(me.getId(val));
            !ele && baidu.dom.insertHTML(me.getConsoleContainer(), 'beforeEnd', me.getDemoString(val));
            me._toggleId && me._toggleId != defaultKey
                && (baidu.dom.g(me.getId(me._toggleId)).style.display = 'none');
            val != defaultKey && (baidu.dom.g(me.getId(val)).style.display = '');
            me._toggleId = val;
            me._disposeInstance();
            me._createInstance(val);
        },

        _onEntityHandler: function(evt, typeId, key){
            var me = this,
                entity = me[typeId][key],
                handler = entity.event.handler,
                depend = entity.depend,
                isFn = (typeof handler == 'function'),
                fn = isFn ? handler : (me._instance[handler] || eval(handler)),
                param = [];
            //取得参数
            depend && baidu.array.each(depend, function(item){
                var list = document.getElementsByName(item);
					list.length <= 0 && (list = baidu.dom.g(item));
                if(list.length){
                    var val = [];
                    for(var i = 0; i < list.length; i++){
                        list[i].checked && val.push(list[i].value);
                    }
                    param.push(val);
                }else{
                    param.push(list.value);
                }
            });
            fn.apply(me._instance, param);
        },

        getDemoInstance: function(){
            return this._instance;
        },

        getSelect: function(){
            return baidu.dom.g(this.getId('demoType'));
        },

        getPanelContainer: function(){
            return baidu.dom.g(this.getId('panel'));
        },

        getConsoleContainer: function(){
            return baidu.dom.g(this.getId('console'));
        },

        getScript: function(){
            return baidu.dom.g(this.getId('demoScript'));
        },

        getCode: function(){
            var me = this,
                packages = me.clazz[me.clazz.type],
                demoConf = me[me.getSelect().value],
                pageConf = demoConf.pageConf,
                jsCode = [],
                param = [],
                opts, code;
            pageConf.jsCode && jsCode.push(pageConf.jsCode);
            if(me.clazz.type == 'class'){
                opts = pageConf.options ? eval('(' + pageConf.options + ')') : {};
                jsCode.push('var c = new '+ me.clazz[me.clazz.type] +'('+ (pageConf.options || '{}') +');');
                !opts.autoRender && me._instance.render
                    && jsCode.push('c.render("'+ (pageConf.target || 'demoId') +'");');
            }else{
                baidu.object.each(demoConf, function(item, key){
                    if(item.isMain){
                        item.depend && baidu.array.each(item.depend, function(rsid){
                            param.push('"'+ baidu.dom.g(rsid).value +'"');
                        });
                        jsCode.push('var main = '+ item.event.handler +'\n main('+ param.join(',') +');');
                        return false;
                    }
                });
            }
            code = baidu.string.format(me.tplHTML, {
                packages: me.clazz.dependPackages ? [packages].concat(me.clazz.dependPackages).join(',') : packages,
                cssPath: packages.replace(/\./g, '_'),
                content: pageConf.html || '<div id="demoId"></div>',
                jscode: jsCode.join('\n')
            });
            alert(code);
        }
    });
})();