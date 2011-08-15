var conf = {
    clazz: {
        type: 'method',
        'method': 'baidu.lang.createClass'
    },
    
    demoType: [{key: 'default', val: 'baidu.lang.createClass'}],
    'default': {
        pageConf: {
            html: '<div id="resultArea"></div>'
        },
        btn1: {
            type: 'button',
            defaultValue: '点击执行代码',
            isMain: true,
            event: {
            	eventName: 'onclick',
            	handler: function(){
				        function People(){
						    this.name = "people";
						}
						People.prototype.eat =  function(){
						    return "I'm eating!";
						};
						var Engineer = T.lang.createClass(function (){
						    this.name = "engineer";
						},{
						    superClass : People
						}).extend({
						    coding : function(){
						        return "I'm coding now!";
						    }
						});
						var wang = new Engineer();
						T.g('resultArea').innerHTML = "my name is: " + wang.name + "<br>";
						T.g('resultArea').innerHTML += wang.eat() + "<br>";
						T.g('resultArea').innerHTML += wang.coding() + "<br>";
            	}
            }
        }
    },
    groups: {
        'default': [['btn1']]
    }
};  