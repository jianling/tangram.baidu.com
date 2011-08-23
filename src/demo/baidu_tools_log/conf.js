var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.tools.log',
        dependPackages: ['baidu.tools.log.Dialog']
    },
    
    demoType: [{key: 'default', val: 'log核心实例'}],
    
    'default': {
        pageConf: {
            html: '<div id="divId" style="margin: 20px;"></div>',
            jsCode: 'baidu.tools.log.callBack = function(data){var c = data[data.length - 1]; baidu.g("divId").innerHTML += c.type + ">>> " + c.data + "<br/>"};'
        },
        errorTxt: {
            type: 'text',
            defaultValue: 'hello world',
            size: 5,
            maxlength: 50
        },
        
        errorBtn: {
            type: 'button',
            defaultValue: 'error(data)',
            depend: ['errorTxt'],
            event: {
                eventName: 'onclick',
                handler: function(c) {
                    baidu.tools.log.error(c);
                }
            }
        },
        
        infoTxt: {
            type: 'text',
            defaultValue: 'hello world',
            size: 5,
            maxlength: 50
        },
        
        infoBtn: {
            type: 'button',
            defaultValue: 'info(data)',
            depend: ['infoTxt'],
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(c) {
                    baidu.tools.log.info(c);
                }
            }
        },
        
        warnTxt: {
            type: 'text',
            defaultValue: 'hello world',
            size: 5,
            maxlength: 50
        },
        
        warnBtn: {
            type: 'button',
            defaultValue: 'warn(data)',
            depend: ['warnTxt'],
            event: {
                eventName: 'onclick',
                handler: function(c) {
                    baidu.tools.log.warn(c);
                }
            }
        },
        
        timeTxt: {
            type: 'text',
            defaultValue: 'mytime',
            size: 5,
            maxlength: 50
        },
        
        timeBtn: {
            type: 'button',
            defaultValue: 'time(name)',
            depend: ['timeTxt'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    baidu.tools.log.time(c);
                }
            }
        },
        
        timeEndBtn: {
            type: 'button',
            defaultValue: 'timeEnd(name)',
            depend: ['timeTxt'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    baidu.tools.log.timeEnd(c);
                }
            }
        },
        
        enableDialog: {
            type: 'button',
            defaultValue: 'enableDialog()',
			isMain:true,
            event: {
                eventName: 'onclick',
                handler: function(){
                    baidu.tools.log.enableDialog();
                }
            }
        },
        
        disableDialog: {
            type: 'button',
            defaultValue: 'disableDialog()',
            event: {
                eventName: 'onclick',
                handler: function(){
                    baidu.tools.log.disableDialog();
                }
            }
        },
        
        setTimeIntervalTxt: {
            type: 'text',
            defaultValue: '1000',
            size: 5,
            maxlength: 8
        },
        
        setTimeIntervalBtn: {
            type: 'button',
            defaultValue: 'setTimeInterval(ts)',
            depend: ['setTimeIntervalTxt'],
            event: {
                eventName: 'onclick',
                handler: function(time){
                    baidu.tools.log.setTimeInterval(parseInt(time));
                }
            }
        }
        
    },
    
    groups: {
        'default': [['enableDialog', 'disableDialog'], ['errorTxt', 'errorBtn'], ['infoTxt', 'infoBtn'], ['warnTxt', 'warnBtn'], ['timeTxt', 'timeBtn', 'timeEndBtn'], ['setTimeIntervalTxt', 'setTimeIntervalBtn']]
    }
}