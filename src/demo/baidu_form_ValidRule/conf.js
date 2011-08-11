var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.form.ValidRule',
        dependPackages: ['baidu.ajax.request']
    },
    
    demoType: [{key: 'default', val: 'ValidaRule核心实例'}],
    'default': {
        pageConf: {
            html: '<h1 style="text-align:center; padding-top: 20px;">ValidaRule用来建立一套简单的验证机制</h1>',
            jsCode: 'var valid = new baidu.form.ValidRule();'
        },
        
        matchName: {
            type: 'select',
            defaultValue: 'required',
            data: {
                key: ['required', 'remote', 'email', 'number', 'maxlength', 'minlength', 'rangelength', 'equal', 'telephone'],
                val: ['必填项验证', 'ajax验证', '电子邮件验证', '数字验证', '最大长度验证', '最小长度验证', '长度范围验证', '相等验证', '电话号码验证']
            },
            event: {
                eventName: 'onchange',
                handler: function(){
                    baidu.dom.g('matchOpt').value = {
                        required: '{}',
                        remote: '{param: {url: "http://www.baidu.com", method:"post", data: "需要验证的值"}}',
                        email: '{}',
                        number: '{}',
                        maxlength: '{param: 2}',
                        minlength: '{param: 2}',
                        rangelength: '{param: [2, 4]}',
                        equal: '{param: "hello world"}',
                        telephone: '{}'
                    }[baidu.dom.g('matchName').value] || '';
                }
            }
        },
        
        matchVal: {
            type: 'text',
            defaultValue: 'val',
            size: 2,
            maxlength: 50
        },
        
        matchFn: {
            type: 'text',
            defaultValue: 'function(val){alert(val);}',
            size: 2,
            maxlength: 255
        },
        
        matchOpt: {
            type: 'text',
            defaultValue: '{}',
            size: 2,
            maxlength: 255
        },
        
        match: {
            type: 'button',
            defaultValue: 'match(name, value, callback, options)',
            depend: ['matchName', 'matchVal', 'matchFn', 'matchOpt'],
            isMain: true,
            event: {
                eventName: 'onclick',
                handler: function(a, b, c, d){
                    var invoke = eval('('+ c +')') || function(){},
                        opt = eval('('+ d +')') || {};
                    valid.match(a, b, invoke, opt);
                }
            }
        },
        
        ruleName: {
            type: 'text',
            defaultValue: 'myRule',
            size: 2,
            maxlength: 50
            
        },
        ruleHandler: {
            type: 'text',
            defaultValue: 'function(val, options){return val==1}',
            size: 2,
            maxlength: 1024,
        },
        addRule: {
            type: 'button',
            defaultValue: 'addRule(name, handler)',
            depend: ['ruleName', 'ruleHandler'],
            event: {
                eventName: 'onclick',
                handler: function(a, b){
                    valid.addRule(a, eval('('+ b +')'));
                    baidu.dom.g('matchName').options.add(new Option(a, a));//'text, value'
                    alert('已经添加到上面的选择域中');
                }
            }
        }
        
    },
    
    groups: {
        'default': [['matchName', 'matchVal', 'matchFn', 'matchOpt', 'match'], ['ruleName', 'ruleHandler', 'addRule']]
    }
}