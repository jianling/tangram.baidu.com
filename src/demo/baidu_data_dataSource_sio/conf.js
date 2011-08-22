var callback = {
    onsuccess: function(response){
        alert(baidu.json.stringify(response));
    },
    onfailure: function(){
        alert('failure');
    },
    callByType: 'browser'
};
function transition(source){
    var array = [],
        source = baidu.lang.isArray(source) ? source : eval(source);
    baidu.array.each(source, function(item){
        array.push({
            name: item.name,
            id: item.id
        });
    });
    return array;
};
var conf = {
    clazz: {
        type: 'method',
        method: 'baidu.data.dataSource',
        dependPackages: ['baidu.data.dataSource.sio']
    },
    
    demoType: [{key: 'sio', val: 'dataSource.sio例子'}],
    
    
    sio: {
        pageConf: {
            html : '<div id="container" style="padding: 50px;">使用sio取得数据源：[{id: "01", name: "john", age: 20}, {id: "02", name: "marray", age: 21}]，通过dataSource处理数据，只取出name和id</div>'
        },
        
        sio: {
            type: 'button',
            defaultValue: 'sio(url, options)',
			isMain:true,
            event: {
                eventName: 'onclick',
                handler: function(){
                    var dataSource = baidu.data.dataSource.sio('baidu_data_dataSource_sio/sioData.js', {
                        transition: function(){return transition(myData);}
                    });
                    dataSource.get(callback);
                }
            }
        }
    },
    
    
    groups: {
        sio: [['sio']]
    }
}