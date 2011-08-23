var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.form.Validator',
        dependPackages: ['baidu.form.Validator.Validator$message']
    },
    demoType: [{key: 'default', val: 'Validator核心例子'}],
    'default': {
        pageConf: {
            html: '<form id="myformtest" name="myformtest" method="post" action="javascript:alert(\'成功提交啦！\')"><div style="padding:5px;"><span style="color:red;">*</span>&nbsp;<label>姓名：（文本域名称：userName）</label><input id="userName" name="userName" type="text"/></div><div style="padding:5px;"><span style="color:red;">*</span>&nbsp;<label>年龄：（文本域名称：age）</label><input id="age" name="age" type="text"/></div><div style="padding:5px;"><label>email：（文本域名称：email）</label><input id="email" name="email" type="text"/></div><div style="padding:5px;"><input type="submit" value="提交"/></div></form>',
            jsCode: 'var validator = new baidu.form.Validator("myformtest", {userName: {rule: {required: {message: "姓名不能为空"}}}, age: {rule: {required: {message: "年龄不能为空"}, number: {message: "请填写数字"}}}, email: {rule: {email: {message: "email不合法"}}}});'
        },
        
        addRuleName: {
            type: 'text',
            defaultValue: 'myRule',
            size: 2,
            maxlength: 50
        },
        
        addRuleFn: {
            type: 'text',
            defaultValue: 'function(){return true;}',
            size: 2,
            maxlength: 255
        },
        
        addRuleMsg: {
            type: 'text',
            defaultValue: "{success: 'yeah~', failure: 'no~'}",
            size: 2,
            maxlength: 255
        },
        
        addRule: {
            type: 'button',
            defaultValue: 'addRule(n, c, m)',
            depend: ['addRuleName', 'addRuleFn', 'addRuleMsg'],
            event: {
                eventName: 'onclick',
                handler: function(a, b, c){
                    var invoke = new Function('return ' + (b || 'function(){}'))(); // b ? eval('(true, '+ b +')') : function(){},
                        msg = c ? eval('('+ c +')') : {};
                    validator.addRule(a, invoke, msg);
                    alert('规律添加完成!');
                }
            }
        },
        
        validateFn: {
            type: 'text',
            defaultValue: 'function(c){alert(c);}',
            size: 2,
            maxlength: 255
        },
        
        validate: {
            type: 'button',
            defaultValue: 'validate(callback)',
            depend: ['validateFn'],
            event: {
                eventName: 'onclick',
                handler: function(c){
                    var invoke = c ? eval('(true, '+ c +')') : function(){};
                    validator.validate(invoke);
                }
            }
            
        },
        
        fieldName: {
            type: 'text',
            defaultValue: 'userName',
            size: 5,
            maxlength: 50
        },
        
        fieldFn: {
            type: 'text',
            defaultValue: 'function(c){alert(c);}',
            size: 2,
            maxlength: 255
        },
        
        validateField: {
            type: 'button',
            defaultValue: 'validateField(name)',
            depend: ['fieldName', 'fieldFn'],
            event: {
                eventName: 'onclick',
                handler: function(a, b){
                    var invoke = new Function('return ' + (b || 'function(){}'))(); // b ? eval('(true, '+ b +')') : function(){};
                    validator.validateField(a, invoke);
                }
                
            }
        }
    },
    
    groups: {
        'default': [['addRuleName', 'addRuleFn', 'addRuleMsg', 'addRule'], ['validateFn', 'validate'], ['fieldName', 'fieldFn', 'validateField']]
    }
};