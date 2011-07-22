// Copyright (c) 2009, Baidu Inc. All rights reserved.
// 
// Licensed under the BSD License
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http:// tangram.baidu.com/license.html
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/* BASE: baidu.js */
/** @namespace */
baidu.data = baidu.data || {};

﻿/* BASE: baidu/dom/setStyles.js */
/* BASE: baidu/event/on.js */
/* BASE: baidu/event/un.js */
/* BASE: baidu/lang/createClass.js */
/* BASE: baidu/fn/bind.js */

/**
 * XPC(cross page channel) 跨域通信模块
 * @name baidu.data.XPC
 * @function
 * @grammar new baidu.data.XPC(true, url[, {timeout:1000}])
 * @param {boolean} isParent 确定当前页面角色，如果是父页面，则为true，跨域的子页面为false，默认值为false.
 * @param {string} url 在对方域下部署的子页面，如果isParent为true，则此参数为必须，否则可以省略.
 * @param {number} timeout 设置超时时间(ms)，超过这个时间视为初始化失败，默认值是3000.
 * @author zhangyunlong
 */
baidu.data.XPC = baidu.lang.createClass(function(isParent, url, options) {

    options = options || {};

    //浏览器特性检查，判断是否支持postMessage，一次运行得到结果
    this._canUsePostMessage = (typeof window.postMessage === 'function' || typeof window.postMessage === 'object');
    //确定角色，父页面为true，子页面为false或undefined
    this._isParent = isParent;
    //初始化完毕标志位
    this.ready = false;
    //当前页面domain，形如(http://www.example.com)
    this.currentDomain = this._getDomainByUrl(location.href);
    //父页面的初始化过程
    if (isParent && url) {
        //创建iframe
        this._channel = this._createIframe(url);
        //设置对方域
        this.targetDomain = this._getDomainByUrl(url);
        this.source = (this._channel.contentWindow || this._channel);
        //页面载入完毕后，由父页面先发送初始化消息
        baidu.on(this._channel, 'load', baidu.fn.bind(function() {this.send('init');}, this));
        //设置超时时间，默认为30秒
        timeout = parseInt(options.timeout) || 30000;
        this._timer = setTimeout(baidu.fn.bind(function() {
            this.dispatchEvent(this._createEvent('error', 'Tiemout.'));
        }, this), timeout);
    } else if (!isParent) {
        //子页面初始化过程
        this.targetDomain = null;
        this.source = window.parent;
        //子页面允许与之通信的父页面domain列表
        this.allowDomains = options.allowDomains || ['*'];
    } else {
        //初始化失败，派发错误消息
        this.dispatchEvent(this._createEvent('error', 'need url.'));
    }

    var handler = baidu.fn.bind('_onMessage', this);

    if (this._canUsePostMessage) {
        baidu.on(window, 'message', handler);
    } else {
        try {
            //IE6-7通过opener对象挂载父子页面互调方法进行通信，这里不排除身份伪造漏洞，使用时请注意，目前没有很好的方法fix
            var win = isParent ? this.source : window,
                opener = win.opener || {},
                handlerNames = ['parentReceiveHandler', 'childReceiveHandler'],
                receiveHandlerName = handlerNames[isParent ? 0 : 1],
                sendHandlerName = handlerNames[isParent ? 1 : 0];
            opener.xpc = opener.xpc || {};
            opener.xpc[receiveHandlerName] = handler;
            this._sendHandlerName = sendHandlerName;
            this._xpc = opener.xpc;
            win.opener = opener;
        } catch (e) {
            this.dispatchEvent(this._createEvent('error', e.message));
        }
    }
}).extend({
    //创建iframe，并返回DOM引用
    _createIframe: function(url) {
        var ifrm = document.createElement('IFRAME');
        //firefox下，动态创建的iframe会从缓存中读取页面，通过将空白页指定给iframe的src属性来修正该问题
        ifrm.src = 'about:blank';
        ifrm.frameBorder = 0;
        baidu.dom.setStyles(ifrm, {
            position: 'absolute',
            left: '-10000px',
            top: '-10000px',
            width: '10px',
            height: '10px'
        });
        document.body.appendChild(ifrm);
        ifrm.src = url;
        return ifrm;
    },
    _createEvent: function(type, data) {
        return {
            type: type,
            data: data
        };
    },
    _checkDomain: function(domain) {
        if (this._isParent) {
            return domain === this.targetDomain;
        } else {
            var arr = this.allowDomains,
                len = arr.length;
            while (len--) {
                var tmp = arr[len];
                if (tmp === '*' || tmp === domain) {
                    return true;
                }
            }
            return false;
        }
    },
    //根据url获取domain信息
    _getDomainByUrl: function(url) {
        var a = document.createElement('A');
        a.href = url;
        //IE8将www.a.com:80和www.a.com认为是不同domain
        return a.protocol + '\/\/' + a.hostname + ((parseInt(a.port) || 80) === 80 ? '' : ':' + a.port);
    },
    _onMessage: function(evt) {
        evt = evt || window.event;
        if (this._checkDomain(evt.origin)) {
            this.source = evt.source;
            this.targetDomain = evt.origin;
            if (this.ready) {
                this.dispatchEvent(this._createEvent('message', evt.data));
            } else {
                //初始化进行一次握手
                if (this._isParent) {
                    //清除超时计时器
                    clearTimeout(this._timer);
                    delete this._timer;
                } else {
                    this.send('init');
                }
                //派发初始化事件
                this.ready = true;
                this.dispatchEvent(this._createEvent('ready'));
            }
        }
    },
    /**
     * 发送消息方法。
     * @param {string} msg 要发送的消息.
     */
    send: function(msg) {
        if (this._canUsePostMessage) {
            this.source.postMessage(msg, this.targetDomain);
        } else {
            var e = {
                type: 'message',
                data: msg,
                origin: this.currentDomain,
                source: window
            };
            this._xpc[this._sendHandlerName](e);
        }
    }
});

/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:data/dataSource.js
 * @author:walter
 * @version:1.0.0
 * @date:2010-11-30
 */



/**
 * @namespace 定义命名空间
 */
baidu.data.dataSource = baidu.dataSource = baidu.data.dataSource || {};
/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:data/dataSource/DataSource.js
 * @author:Walter
 * @version:1.0.0
 * @date:2010-11-30
 */


/* BASE: baidu/lang/Event.js */
/* BASE: baidu/object/extend.js */
/* BASE: baidu/object/keys.js */

/**
 * @class 数据源类
 * @param {Object}     [options]                     配置
 * @param {Number}     [options.maxCache = 10]       缓存数据的最大个数
 * @param {Boolean}    [options.cache = true]        是否使用缓存
 * @param {Function}   [optons.transition]           转换数据算法  
 */
baidu.data.dataSource.DataSource = baidu.lang.createClass(function(options){
    this._cacheData = {};
    baidu.object.extend(this, options);
    
    this.addEventListener("onbeforeget", function(evt){
        var me = this, 
			data;
        if (me.cache && (data = me._cacheData[evt.key]) && evt.onsuccess) {
            evt.onsuccess.call(me, data);
        }
        
        evt.returnValue = !!data;
    });
}, {
    className: "baidu.data.dataSource.DataSource"
}).extend(
    /**
     *  @lends baidu.data.dataSource.DataSource.prototype
     */
    {
    
	maxCache: 100,
    
	cache: true,
	
    /**
     * 更新配置
     * @param {Object} options
     */
    update: function(options){
        var me = this;
        baidu.object.extend(me, options);
    },
    
    /**
     * 
     * 获取数据
     * @interface 
     * @param {Object} options 配置信息
     */
    get: function(options){
    
    },
    
    /**
     * 转换数据格式并调用回调函数
     * @private 
     * @param {Object} options
     * @return {Object} 返回数据
     */
    _get: function(options){
        var me = this, 
			data;
        data = me.transition.call(me, me.source);
        me.cache && options.key && data && me._addCacheData(options.key, data);
        options.onsuccess && options.onsuccess.call(me, data);
        return data;
    },
    
    /**
	 * 转换数据格式
     * @function 
     * @param  {Object} source 数据源
     * @return {Object} source 转换格式后的数据源
     */
    transition: function(source){
        return source;
    },
    
    /**
     * 增加缓存数据
     * @privite 
     * @param {Object} key    数据键值对Key值
     * @param {Object} value  数据键值对value值
     */
    _addCacheData: function(key, value){
        var me = this, 
			keySet = baidu.object.keys(me._cacheData);
        while (me.maxCache > 0 && keySet.length >= me.maxCache) {
            delete me._cacheData[keySet.shift()];
        }
        if (me.maxCache > 0) {
            me._cacheData[key] = value;
        }
    }
});

/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:data/dataSource/ajax.js
 * @author:Walter
 * @version:1.0.0
 * @date:2010-11-30
 */

/* BASE: baidu/ajax/request.js */
/* BASE: baidu/json/stringify.js */


/**
 * 异步调用数据源类
 * @param {String}     url                           数据源地址
 * @param {Object}     [options]                     配置
 * @param {Number}     [options.maxCache = 10]       缓存数据的最大个数
 * @param {Boolean}    [options.cache = true]        是否使用缓存
 * @param {Function}   [optons.transition]           转换数据算法  
 * @param {Function}   [options.onbeforeget]         beforeget事件
 */
baidu.data.dataSource.ajax = function(url, options){
    options = baidu.object.extend({
        url: url
    }, options || {});
	
    var dataSource = new baidu.data.dataSource.DataSource(options);
	
	/**
	 * 获取数据
	 * @param {Object}    options                 配置
	 * @param {String}    [options.key = url + param]     用于存取缓存
	 * @param {String}    [options.method = 'GET']        请求的类型
	 * @param {Object}    [options.param]                 需要发送的数据
	 * @param {Function}  [options.onsuccess]             加载成功回调函数
	 * @param {Function}  [options.onfailure]             加载失败回调函数
	 * @param {Object}    [options.ajaxOption]            request参数
	 */
    dataSource.get = function(options){
        var me = this;
        options = options || {};
        options.key = options.key || (me.url + (options.param ? "?" + baidu.json.stringify(options.param) : ""));
        if (!me.dispatchEvent("onbeforeget", options)) {
            baidu.ajax.request(me.url, me.ajaxOption ||
            {
                method: options.method || 'get',
                data: options.param,
                onsuccess: function(xhr, responseText){
                    me.source = responseText;
                    me._get(options);
                },
                onfailure: function(xhr){
                    options.onfailure && options.onfailure.call(me, xhr);
                }
            });
        }
    };
    return dataSource;
};

/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:data/dataSource/local.js
 * @author:Walter
 * @version:1.0.0
 * @date:2010-11-30
 */



/**
 * 本地数据源类
 * @param {Object}     source                        数据源
 * @param {Object}     [options]                     配置
 * @param {Number}     [options.maxCache = 10]       缓存数据的最大个数
 * @param {Boolean}    [options.cache = true]        是否使用缓存
 * @param {Function}   [optons.transition]           转换数据算法
 * @param {Function}   [options.onbeforeget]         beforeget事件
 */
baidu.data.dataSource.local = function(source, options){
    options = baidu.object.extend({
        source: source
    }, options || {});
    
    var dataSource = new baidu.data.dataSource.DataSource(options);
    
    /**
     * 获取数据
     * @param {Object}    options                 配置
     * @param {String}    [options.key = 'local']     用于存取缓存
     * @param {Function}  [options.onsuccess]             加载成功回调函数
     */
    dataSource.get = function(options){
        var me = this, 
			data;
        options = baidu.object.extend({
            'key': 'local'
        }, options || {});
        
        if (!me.dispatchEvent("onbeforeget", options)) {
            data = me._get(options);
        }
        return data;
    };
    return dataSource;
};

/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * @path:data/dataSource/sio.js
 * @author:Walter
 * @version:1.0.0
 * @date:2010-11-30
 */

/* BASE: baidu/sio/callByBrowser.js */
/* BASE: baidu/sio/callByServer.js */


/**
 * 跨域数据源类
 * @param {String}     url                           数据源地址
 * @param {Object}     [options]                     配置
 * @param {Number}     [options.maxCache = 10]       缓存数据的最大个数
 * @param {Boolean}    [options.cache = true]        是否使用缓存
 * @param {Function}   [optons.transition]           转换数据算法  
 * @param {Function}   [options.onbeforeget]         beforeget事件
 */
baidu.data.dataSource.sio = function(url, options){
    options = baidu.object.extend({
        url: url
    }, options || {});
	
    var dataSource = new baidu.data.dataSource.DataSource(options);
	
	/**
	 * 获取数据
	 * @param {Object}    options                 配置
	 * @param {String}    [options.key = url + param]            用于存取缓存
	 * @param {String}    [options.callByType = 'server']        请求的类型
	 * @param {Object}    [options.param]                        需要发送的数据
	 * @param {Function}  [options.onsuccess]                    加载成功回调函数
	 */
    dataSource.get = function(options){
        var me = this;
        options = options || {};
        options.key = options.key || (me.url + (options.param ? "?" + baidu.json.stringify(options.param) : ""));
        if (options.callByType && options.callByType.toLowerCase() == "browser") {
            options.callByType = "callByBrowser";
        }
        else {
            options.callByType = "callByServer";
        }
        if (!me.dispatchEvent("onbeforeget", options)) {
            baidu.sio[options.callByType](options.key, function(){
                me._get(options);
            });
        }
    };
    return dataSource;
};

/* BASE: baidu/lang/createSingle.js */
/* BASE: baidu/dom/insertHTML.js */
/* BASE: baidu/string/format.js */

/* BASE: baidu/lang/isDate.js */
/* BASE: baidu/cookie/set.js */
/* BASE: baidu/cookie/get.js */
/* BASE: baidu/cookie/remove.js */

/**
 * 一个本地存储对象，使用key-value的方式来存值，不具备夸浏览器通信功能，根据浏览器的不同自动选择userData或是localStorage或是cookie来存值.
 */
baidu.data.storage = baidu.data.storage || (function(){
    var _guid = baidu.lang.guid(),
        _status = {//状态说明
            SUCCESS: 0,
            FAILURE: 1,
            OVERFLOW: 2
        };
    function _getKey(key){
        //escape spaces in name，单下划线替换为双下划线，空格替换为_s
        return key.replace(/[_\s]/g, function(matcher) {
            return matcher == '_' ? '__' : '_s';
        });
    }
    
    function _getElement(){
        return baidu.dom.g(_guid + '-storage');
    }
    
    function _getInstance(){
        var _storage;
        if (window.ActiveXObject) {
            _storage = _createUserData();
        }else if (window.localStorage) {
            _storage = _createLocalStorage();
        }else {
            _storage = _createCookie();
        }
        return _storage;
    }
    
    /**
     * 将userData进行包装并返回一个只包含三个方法的对象
     * @return {Object} 一个对象，包括set, get, del接口.
     * @private
     */
    function _createUserData(){
        baidu.dom.insertHTML(document.body,
            'beforeEnd',
            baidu.string.format('<div id="#{id}" style="display:none;"></div>',
                {id: _guid + '-storage'})
        );
        _getElement().addBehavior('#default#userData');
        return {
//            size: 64 * 1024,
            set: function(key, value, callback, options) {
                var status = _status.SUCCESS,
                    ele = _getElement(),
                    newKey = _getKey(key),
                    time = options && options.expires ? options.expires
                        : new Date().getTime() + 365 * 24 * 60 * 60 * 1000;//默认保存一年时间
                baidu.lang.isDate(time) && (time = time.getTime());
                ele.expires = new Date(time).toUTCString();
                try {
                    ele.setAttribute(newKey, value);
                    ele.save(newKey);
                }catch (e) {
                    status = _status.OVERFLOW;//存储时抛出异常认为是溢出
                }
                ele = null;
                callback && callback.call(this, status, value);
            },
            get: function(key, callback) {
                var status = _status.SUCCESS,
                    ele = _getElement(),
                    newKey = _getKey(key),
                    val = null;
                try {
                    ele.load(newKey);
                    val = ele.getAttribute(newKey);//若过期则返回null
                }catch (e) {
                    status = _status.FAILURE;
                    throw 'baidu.data.storage.get error!';
                }
                callback && callback.call(this, status, val);
            },
            del: function(key, callback) {
                var status = _status.SUCCESS,
                    ele = _getElement(),
                    newKey = _getKey(key),
                    val;
                try {
                    ele.load(newKey);
                    val = ele.getAttribute(newKey);
                    if (val) {
                        //315532799000 是格林威治时间1979年12月31日23时59分59秒。这是删除UserData的最靠前的一个有效expires时间了，再往前一毫秒，expires = new Date(315532798999).toUTCString(); 就删不掉userdata了，可以认为是IE的一个bug
                        ele.removeAttribute(newKey);
                        ele.expires = new Date(315532799000).toUTCString();
                        ele.save(newKey);
                    }else {
                        status = _status.FAILURE;
                    }
                }catch (e) {
                    status = _status.FAILURE;
                }
                callback && callback.call(this, status, val);
            }
        };
    }
    
    /**
     * 将localstorage进行包装并返回一个只包含三个方法的对象
     * @return {Object} 一个对象，包括set, get, del接口.
     * @private
     */
    function _createLocalStorage(){
        return {
//            size: 10 * 1024 * 1024,
            set: function(key, value, callback, options) {
                var status = _status.SUCCESS,
                    storage = window.localStorage,
                    newKey = _getKey(key),
                    time = options && options.expires ? options.expires : 0;
                baidu.lang.isDate(time) && (time = time.getTime());
                try {
                    storage.setItem(newKey, time + '|' + value);
                }catch (e) {
                    status = _status.OVERFLOW;
                }
                callback && callback.call(this, status, value);
            },
            get: function(key, callback) {
                var status = _status.SUCCESS,
                    storage = window.localStorage,
                    newKey = _getKey(key),
                    val = null,
                    index,
                    time;
                try {
                    val = storage.getItem(newKey);
                }catch (e) {
                    status = _status.FAILURE;
                }
                if (val) {
                    index = val.indexOf('|');
                    time = parseInt(val.substring(0, index), 10);
                    if (new Date(time).getTime() > new Date().getTime()
                        || time == 0) {
                        val = val.substring(index + 1, val.length);
                    }else{
                        val = null;
                        status = _status.FAILURE;
                        this.del(key);
                    }
                }else {
                    status = _status.FAILURE;
                }
                callback && callback.call(this, status, val);
            },
            del: function(key, callback) {
                var status = _status.SUCCESS,
                    storage = window.localStorage,
                    newKey = _getKey(key),
                    val = null;
                try {
                    val = storage.getItem(newKey);
                }catch (e) {
                    status = _status.FAILURE;
                }
                if (val) {
                    val = val.substring(val.indexOf('|') + 1, val.length);
                    status = _status[val ? 'SUCCESS' : 'FAILURE'];
                    val && storage.removeItem(newKey);
                }else {
                    status = _status.FAILURE;
                }
                callback && callback.call(this, status, val);
            }
        };
    }
    
    /**
     * 将baidu.cookie进行包装并返回一个只包含三个方法的对象
     * @return {Object} 一个对象，包括set, get, del接口.
     * @private
     */
    function _createCookie(){
        return {
//            size: 4 * 1024,
            set: function(key, value, callback, options) {
                baidu.cookie.set(_getKey(key), value, options);
                callback && callback.call(me, _status.SUCCESS, value);
            },

            get: function(key, callback) {
                var val = baidu.cookie.get(_getKey(key));
                callback && callback.call(me, _status[val ? 'SUCCESS' : 'FAILURE'], val);
            },
            del: function(key, callback) {
                var newKey = _getKey(key),
                    val = baidu.cookie.get(newKey);
                baidu.cookie.remove(newKey);
                callback && callback.call(me, _status[val ? 'SUCCESS' : 'FAILURE'], val);
            }
        };
    }
    
    
    return {
        /**
         * 将一个键值对存入到本地存储中
         * @param {String} key 一个键名.
         * @param {String} value 一个值.
         * @param {Function} callback 一个回调函数，函数的第一参数返回该次存储的状态码，各状码表示{0: 成功, 1: 失败, 2: 溢出}，第二参数返回当次的value.
         * @param {Object} options config参数.
         * @config {Date|Number} expires 设置一个过期时间，值的类型必须是一个Date对象或是一个毫秒数
         */
        set: function(key, value, callback, options){
            var me = this;
            !me._storage && (me._storage = _getInstance());
            me._storage.set.apply(me._storage, arguments);
        },
        
        /**
         * 依据一个键名称来取得本地存储中的值
         * @param {String} key 一个键名称.
         * @param {Function} callback 一个回调函数，函数的第一参数返回该次存储的状态码，各状码表示{0: 成功, 1: 失败, 2: 溢出}，第二参数返回当次的value.
         */
        get: function(key, callback){
            var me = this;
            !me._storage && (me._storage = _getInstance());
            me._storage.get.apply(me._storage, arguments);
        },
        
        /**
         * 根据一个键名称来删除在本地存储中的值
         * @param {String} key 一个键名称.
         * @param {Function} callback 一个回调函数，函数的第一参数返回该次存储的状态码，各状码表示{0: 成功, 1: 失败, 2: 溢出}，第二参数返回当次的value.
         */
        remove: function(key, callback){
            var me = this;
            !me._storage && (me._storage = _getInstance());
            me._storage.del.apply(me._storage, arguments);
        }
    };
})();
baidu.fx = baidu.fx || {} ;

/**
 * 提供一个按时间进程的时间线类
 *
 * 本类提供两个方法：
 *  cancel()    取消操作
 *  end()       直接结束
 *
 * 使用本类时需要实现五个接口：
 *  initialize()            用于类初始化时的操作
 *  transition(percent)    重新计算时间线进度曲线
 *  finish()                用于类结束时时的操作
 *  render(schedule)        每个脉冲在DOM上的效果展现
 *  restore()               效果被取消时作的恢复操作
 *
 * @config {Number} interval 脉冲间隔时间（毫秒）
 * @config {Number} duration 时间线总时长（毫秒）
 * @config {Number} percent  时间线进度的百分比
 */
baidu.fx.Timeline = baidu.lang.createClass(function(options) {
    baidu.object.extend(this, baidu.fx.Timeline.options);
    baidu.object.extend(this, options);
},
{
    className: "baidu.fx.Timeline"
    ,options:{interval:16, duration:500, dynamic:true}
}).extend({  // 类的方法的扩展

    /**
     * 启动时间线
     * @return {instance} 类实例
     */
    launch : function(){
        var me = this;
        me.dispatchEvent("onbeforestart");

        /**
        * initialize()接口，当时间线初始化同步进行的操作
        */
        typeof me.initialize =="function" && me.initialize();

        me["\x06btime"] = new Date().getTime();
        me["\x06etime"] = me["\x06btime"] + (me.dynamic ? me.duration : 0);
        me["\x06pulsed"]();

        return me;
    }

    /** @ignore
     * [privite] 每个时间脉冲所执行的程序
     */
    ,"\x06pulsed" : function(){
        var me = this;
        var now = new Date().getTime();
        // 当前时间线的进度百分比
        me.percent = (now - me["\x06btime"]) / me.duration;
        me.dispatchEvent("onbeforeupdate");

        // 时间线已经走到终点
        if (now >= me["\x06etime"]){
            typeof me.render == "function" && me.render(me.transition(me.percent = 1));

            // [interface run] finish()接口，时间线结束时对应的操作
            typeof me.finish == "function" && me.finish();

            me.dispatchEvent("onafterfinish");
            me.dispose();
            return;
        }

        /**
        * [interface run] render() 用来实现每个脉冲所要实现的效果
        * @param {Number} schedule 时间线的进度
        */
        typeof me.render == "function" && me.render(me.transition(me.percent));
        me.dispatchEvent("onafterupdate");

        me["\x06timer"] = setTimeout(function(){me["\x06pulsed"]()}, me.interval);
    }

    /**
     * 重新计算 schedule，以产生各种适合需求的进度曲线
     */
    ,transition : function(percent) {
        return percent;
    }

    /**
     * 撤销当前时间线的操作，并引发 restore() 接口函数的操作
     */
    ,cancel : function() {
        this["\x06timer"] && clearTimeout(this["\x06timer"]);
        this["\x06etime"] = this["\x06btime"];

        // [interface run] restore() 当时间线被撤销时的恢复操作
        typeof this.restore == "function" && this.restore();
        this.dispatchEvent("oncancel");

        this.dispose();
    }

    /**
     * 直接将时间线运行到结束点
     */
    ,end : function() {
        this["\x06timer"] && clearTimeout(this["\x06timer"]);
        this["\x06etime"] = this["\x06btime"];
        this["\x06pulsed"]();
    }
});
/* BASE: baidu/dom/g.js */
/* BASE: baidu/dom/hide.js */

/**
 * 效果基类。
 * @class
 * @param     {HTMLElement}           element            添加效果的DOM元素
 * @param     {JSON}                  options            时间线的配置参数对象
 * @config    {Function}              transition         function(schedule){return schedule;},时间线函数
 * @config    {Function}              onbeforestart      function(){},//效果开始前执行的回调函数
 * @config    {Function}              onbeforeupdate     function(){},//每次刷新画面之前会调用的回调函数
 * @config    {Function}              onafterupdate      function(){},//每次刷新画面之后会调用的回调函数
 * @config    {Function}              onafterfinish      function(){},//效果结束后会执行的回调函数
 * @config    {Function}              oncancel           function(){},//效果被撤销时的回调函数
 * @param     {String}                fxName             效果名（可选）
 * @return {baidu.fx.Timeline}  时间线类的一个实例
 */
baidu.fx.create = function(element, options, fxName) {
    var timeline = new baidu.fx.Timeline(options);

    timeline.element = element;
    timeline._className = fxName || timeline._className;
    timeline["\x06original"] = {};   // 20100708
    var catt = "baidu_current_effect";

    /**
     * 将实例的guid记录到DOM元素上，以便多个效果叠加时的处理
     */
    timeline.addEventListener("onbeforestart", function(){
        var me = this, guid;
        me.attribName = "att_"+ me._className.replace(/\W/g, "_");
        guid = me.element.getAttribute(catt);
        me.element.setAttribute(catt, (guid||"") +"|"+ me.guid +"|", 0);

        if (!me.overlapping) {
            (guid = me.element.getAttribute(me.attribName)) 
                && window[baidu.guid]._instances[guid].cancel();

            //在DOM元素上记录当前效果的guid
            me.element.setAttribute(me.attribName, me.guid, 0);
        }
    });

    /**
     * 打扫dom元素上的痕迹，删除元素自定义属性
     */
    timeline["\x06clean"] = function(e) {
    	var me = this, guid;
        if (e = me.element) {
            e.removeAttribute(me.attribName);
            guid = e.getAttribute(catt);
            guid = guid.replace("|"+ me.guid +"|", "");
            if (!guid) e.removeAttribute(catt);
            else e.setAttribute(catt, guid, 0);
        }
    };

    /**
     * 在时间线结束时净化对DOM元素的污染
     */
    timeline.addEventListener("oncancel", function() {
        this["\x06clean"]();
        this["\x06restore"]();
    });

    /**
     * 在时间线结束时净化对DOM元素的污染
     */
    timeline.addEventListener("onafterfinish", function() {
        this["\x06clean"]();
        this.restoreAfterFinish && this["\x06restore"]();
    });

    /**
     * 保存原始的CSS属性值 20100708
     */
    timeline.protect = function(key) {
        this["\x06original"][key] = this.element.style[key];
    };

    /**
     * 时间线结束，恢复那些被改过的CSS属性值
     */
    timeline["\x06restore"] = function() {
        var o = this["\x06original"],
            s = this.element.style,
            v;
        for (var i in o) {
            v = o[i];
            if (typeof v == "undefined") continue;

            s[i] = v;    // 还原初始值

            // [TODO] 假如以下语句将来达不到要求时可以使用 cssText 操作
            if (!v && s.removeAttribute) s.removeAttribute(i);    // IE
            else if (!v && s.removeProperty) s.removeProperty(i); // !IE
        }
    };

    return timeline;
};


/**
 * fx 的所有 【属性、方法、接口、事件】 列表
 *
 * property【七个属性】                 默认值 
 *  element             {HTMLElement}           效果作用的DOM元素
 *  interval            {Number}        16      脉冲间隔时间（毫秒）
 *  duration            {Number}        500     时间线总时长（毫秒）
 *  percent             {Number}                时间线进度的百分比
 *  dynamic             {Boolean}       true    是否渐进式动画还是直接显示结果
 *  overlapping         {Boolean}       false   效果是否允许互相叠加
 *  restoreAfterFinish  {Boolean}       false   效果结束后是否打扫战场
 *
 * method【三个方法】
 *  end()       直接结束
 *  cancel()    取消操作
 *  protect()   保存元素原始的CSS属性值，以便自动 restore 操作
 *
 * event【四个事件】
 *  onbeforestart()
 *  onbeforeupdate()
 *  onafterupdate()
 *  onafterfinish()
 *
 * interface【五个接口】
 *  initialize()            用于类初始化时的操作
 *  transition(percent)     重新计算时间线进度曲线
 *  finish()                用于类结束时时的操作
 *  restore()               效果结束后的恢复操作
 *  render(schedule)        每个脉冲在DOM上的效果展现
 */


/**
 * 从下向上收拢DOM元素的效果。
 * @function
 * @param     {string|HTMLElement}    element            元素或者元素的ID
 * @param     {Object}                options            选项。参数的详细说明如下表所示
 * @config    {Number}                duration           500,//效果持续时间，默认值为500ms
 * @config    {Number}                interval           16, //动画帧间隔时间，默认值为16ms
 * @config    {String}                orientation        动画收拢方向，取值：vertical（默认），horizontal
 * @config    {Function}              transition         function(schedule){return schedule;},时间线函数
 * @config    {Function}              onbeforestart      function(){},//效果开始前执行的回调函数
 * @config    {Function}              onbeforeupdate     function(){},//每次刷新画面之前会调用的回调函数
 * @config    {Function}              onafterupdate      function(){},//每次刷新画面之后会调用的回调函数
 * @config    {Function}              onafterfinish      function(){},//效果结束后会执行的回调函数
 * @config    {Function}              oncancel           function(){},//在onafterfinish与oncancel时默认调用
 * @see baidu.fx.expand
 */

baidu.fx.collapse = function(element, options) {
    if (!(element = baidu.dom.g(element))) return null;

    var e = element, 
        value, 
        attr,
        attrHV = {
            "vertical": {
                value: 'height',
                offset: 'offsetHeight',
                stylesValue: ["paddingBottom","paddingTop","borderTopWidth","borderBottomWidth"]
            },
            "horizontal": {
                value: 'width',
                offset: 'offsetWidth',
                stylesValue: ["paddingLeft","paddingRight","borderLeftWidth","borderRightWidth"]
            }
        };

    var fx = baidu.fx.create(e, baidu.object.extend({
        orientation: 'vertical'
        
        //[Implement Interface] initialize
        ,initialize : function() {
            attr = attrHV[this.orientation];
            this.protect(attr.value);
            this.protect("overflow");
            this.restoreAfterFinish = true;
            value = e[attr.offset];
            e.style.overflow = "hidden";
        }

        //[Implement Interface] transition
        ,transition : function(percent) {return Math.pow(1 - percent, 2);}

        //[Implement Interface] render
        ,render : function(schedule) {
            e.style[attr.value] = Math.floor(schedule * value) +"px";
        }

        //[Implement Interface] finish
        ,finish : function(){baidu.dom.hide(e);}
    }, options || {}), "baidu.fx.expand_collapse");

    return fx.launch();
};

// [TODO] 20100509 在元素绝对定位时，收缩到最后时会有一次闪烁

/**
 * 获取DOM元素正在运行的效果实例列表
 * @function
 * @param     {string|HTMLElement}     element     被查询的DOM元素或元素id
 * @see baidu.fx.current
 * @returns {Array} 效果对象
 */
baidu.fx.current = function(element) {
    if (!(element = baidu.dom.g(element))) return null;
    var a, guids, reg = /\|([^\|]+)\|/g;

    // 可以向<html>追溯
    do {if (guids = element.getAttribute("baidu_current_effect")) break;}
    while ((element = element.parentNode) && element.nodeType == 1);

    if (!guids) return null;

    if ((a = guids.match(reg))) {
        //fix
        //在firefox中使用g模式，会出现ture与false交替出现的问题
        reg = /\|([^\|]+)\|/;
        
        for (var i=0; i<a.length; i++) {
            reg.test(a[i]);
            a[i] = window[baidu.guid]._instances[RegExp["\x241"]];
        }
    }
    return a;
};

/* BASE: baidu/dom/show.js */

/* BASE: baidu/array/each.js */
/* BASE: baidu/dom/getStyle.js */
/* BASE: baidu/lang/isNumber.js */

 
/**
 * 自上而下展开DOM元素的效果。
 * @function
 * @param     {string|HTMLElement}    element            元素或者元素的ID
 * @param     {Object}                options            选项。参数的详细说明如下表所示
 * @config    {Number}                duration           500,//效果持续时间，默认值为500ms
 * @config    {Number}                interval           16, //动画帧间隔时间，默认值为16ms
 * @config    {String}                orientation        动画展开方向，取值：vertical（默认），horizontal
 * @config    {Function}              transition         function(schedule){return schedule;},时间线函数
 * @config    {Function}              onbeforestart      function(){},//效果开始前执行的回调函数
 * @config    {Function}              onbeforeupdate     function(){},//每次刷新画面之前会调用的回调函数
 * @config    {Function}              onafterupdate      function(){},//每次刷新画面之后会调用的回调函数
 * @config    {Function}              onafterfinish      function(){},//效果结束后会执行的回调函数
 * @config    {Function}              oncancel           function(){},//效果被撤销时的回调函数
 * @see baidu.fx.collapse
 */

baidu.fx.expand = function(element, options) {
    if (!(element = baidu.dom.g(element))) return null;

    var e = element, 
        value, 
        attr,
        attrHV = {
            "vertical": {
                value: 'height',
                offset: 'offsetHeight',
                stylesValue: ["paddingBottom","paddingTop","borderTopWidth","borderBottomWidth"]
            },
            "horizontal": {
                value: 'width',
                offset: 'offsetWidth',
                stylesValue: ["paddingLeft","paddingRight","borderLeftWidth","borderRightWidth"]
            }
        };

    var fx = baidu.fx.create(e, baidu.object.extend({
        orientation: 'vertical'
        
        //[Implement Interface] initialize
        ,initialize : function() {
            attr = attrHV[this.orientation];
            baidu.dom.show(e);
            this.protect(attr.value);
            this.protect("overflow");
            this.restoreAfterFinish = true;
            value = e[attr.offset];
            
            function getStyleNum(d,style){
                var result = parseInt(baidu.getStyle(d,style));
                result = isNaN(result) ? 0 : result;
                result = baidu.lang.isNumber(result) ? result : 0;
                return result;
            }
            
            baidu.each(attr.stylesValue, function(item){
                value -= getStyleNum(e,item);
            });
            e.style.overflow = "hidden";
            e.style[attr.value] = "1px";
        }

        //[Implement Interface] transition
        ,transition : function(percent) {return Math.sqrt(percent);}

        //[Implement Interface] render
        ,render : function(schedule) {
            e.style[attr.value] = Math.floor(schedule * value) +"px";
        }
    }, options || {}), "baidu.fx.expand_collapse");

    return fx.launch();
};



/*
 * JavaScript framework: mz
 * Copyright (c) 2010 meizz, http://www.meizz.com/
 *
 * http://www.meizz.com/mz/license/ MIT-style license
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software
 */



/* BASE: baidu/browser/ie.js */




 
/**
 * 控制元素的透明度 渐变
 * @function
 * @param       {String|Object}           element               元素或者元素的ID
 * @param       {Object}                  options               选项。参数的详细说明如下表所示
 * @config      {Number}                  from                  0,//效果起始值。介于0到1之间的一个数字，默认为0。
 * @config      {Number}                  to                    1,//效果结束值。介于0到1之间的一个数字，默认为1。
 * @config      {Number}                  duration              500,//效果持续时间，默认值为500ms。
 * @config      {Number}                  interval              16, //动画帧间隔时间，默认值为16ms。
 * @config      {Function}                transition            function(schedule){return schedule;},时间线函数
 * @config      {Function}                onbeforestart         function(){},//效果开始前执行的回调函数
 * @config      {Function}                onbeforeupdate        function(){},//每次刷新画面之前会调用的回调函数
 * @config      {Function}                onafterupdate         function(){},//每次刷新画面之后会调用的回调函数
 * @config      {Function}                onafterfinish         function(){},//效果结束后会执行的回调函数
 * @config      {Function}                oncancel              function(){},//效果被撤销时的回调函数
 */

baidu.fx.opacity = function(element, options) {
    if (!(element = baidu.dom.g(element))) return null;

    options = baidu.object.extend({from: 0,to: 1}, options||{});

    var e = element;

    var fx = baidu.fx.create(e, baidu.object.extend({
        //[Implement Interface] initialize
        initialize : function() {
            baidu.dom.show(element);

            if (baidu.browser.ie) {
                this.protect("filter");
            } else {
                this.protect("opacity");
                this.protect("KHTMLOpacity");
            }

            this.distance = this.to - this.from;
        }

        //[Implement Interface] render
        ,render : function(schedule) {
            var n = this.distance * schedule + this.from;

            if(!baidu.browser.ie) {
                e.style.opacity = n;
                e.style.KHTMLOpacity = n;
            } else {
                e.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity:"+
                    Math.floor(n * 100) +")";
            }
        }
    }, options), "baidu.fx.opacity");

    return fx.launch();
};


 
/**
 * 渐现渐变效果。注意，如果元素的visibility属性如果为hidden，效果将表现不出来。
 * @function
 * @param      {string|HTMLElement}     element            元素或者元素的ID
 * @param      {Object}                 options            选项。参数的详细说明如下表所示
 * @config     {Number}                 duration           500,//效果持续时间，默认值为500ms
 * @config     {Number}                 interval           16, //动画帧间隔时间，默认值为16ms
 * @config     {Function}               transition         function(schedule){return schedule;},时间线函数
 * @config     {Function}               onbeforestart      function(){},//效果开始前执行的回调函数
 * @config     {Function}               onbeforeupdate     function(){},//每次刷新画面之前会调用的回调函数
 * @config     {Function}               onafterupdate      function(){},//每次刷新画面之后会调用的回调函数
 * @config     {Function}               onafterfinish      function(){},//效果结束后会执行的回调函数
 * @config     {Function}               oncancel           function(){},//效果被撤销时的回调函数
 * @see baidu.fx.fadeOut
 */

baidu.fx.fadeIn = function(element, options) {
    if (!(element = baidu.dom.g(element))) return null;

    var fx = baidu.fx.opacity(element,
        baidu.object.extend({from:0, to:1, restoreAfterFinish:true}, options||{})
    );
    fx._className = "baidu.fx.fadeIn";

    return fx;
};







 
/**
 * 渐隐渐变效果，效果执行结束后会将元素完全隐藏起来。
 * @function
 * @param {string|HTMLElement} element 元素或者元素的ID
 * @param {Object} options 选项。参数的详细说明如下表所示
 * @config     {Number}                 duration           500,//效果持续时间，默认值为500ms
 * @config     {Number}                 interval           16, //动画帧间隔时间，默认值为16ms
 * @config     {Function}               transition         function(schedule){return schedule;},时间线函数
 * @config     {Function}               onbeforestart      function(){},//效果开始前执行的回调函数
 * @config     {Function}               onbeforeupdate     function(){},//每次刷新画面之前会调用的回调函数
 * @config     {Function}               onafterupdate      function(){},//每次刷新画面之后会调用的回调函数
 * @config     {Function}               onafterfinish      function(){},//效果结束后会执行的回调函数
 * @config     {Function}               oncancel           function(){},//效果被撤销时的回调函数
 * @see baidu.fx.fadeIn
 * @remark
 * 1.0.0开始支持
 */
baidu.fx.fadeOut = function(element, options) {
    if (!(element = baidu.dom.g(element))) return null;

    var fx = baidu.fx.opacity(element,
        baidu.object.extend({from:1, to:0, restoreAfterFinish:true}, options||{})
    );
    fx.addEventListener("onafterfinish", function(){baidu.dom.hide(this.element);});
    fx._className = "baidu.fx.fadeOut";

    return fx;
};

/**
 * 获取线型函数
 * 
 * @param   {String}    name    transition的名称
 * @return  {function}          线型函数
 */
baidu.fx.getTransition = function(name) {
    var a = baidu.fx.transitions;
    if (!name || typeof a[name] != "string") name = "linear";
    return new Function("percent", a[name]);
};

baidu.fx.transitions = {
    none : "return 0"
    ,full : "return 1"
    ,linear : "return percent"  // 斜线
    ,reverse : "return 1 - percent" // 反斜线
    ,parabola : "return Math.pow(percent, 2)"   // 抛物线
    ,antiparabola : "return 1 - Math.pow(1 - percent, 2)"   // 反抛物线
    ,sinoidal : "return (-Math.cos(percent * Math.PI)/2) + 0.5" // 正弦波
    ,wobble : "return (-Math.cos(percent * Math.PI * (9 * percent))/2) + 0.5"   // 摇晃
    ,spring : "return 1 - (Math.cos(percent * 4.5 * Math.PI) * Math.exp(-percent * 6))" // 弹性阴尼
};

/*
//from: http://github.com/madrobby/scriptaculous/blob/master/src/effects.js

Transitions: {
    linear: Prototype.K,
    sinoidal: function(pos) {
      return (-Math.cos(pos*Math.PI)/2) + .5;
    },
    reverse: function(pos) {
      return 1-pos;
    },
    flicker: function(pos) {
      var pos = ((-Math.cos(pos*Math.PI)/4) + .75) + Math.random()/4;
      return pos > 1 ? 1 : pos;
    },
    wobble: function(pos) {
      return (-Math.cos(pos*Math.PI*(9*pos))/2) + .5;
    },
    pulse: function(pos, pulses) {
      return (-Math.cos((pos*((pulses||5)-.5)*2)*Math.PI)/2) + .5;
    },
    spring: function(pos) {
      return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
    },
    none: function(pos) {
      return 0;
    },
    full: function(pos) {
      return 1;
    }
}

Fx.Transitions.extend({

	Pow: function(p, x){
		return Math.pow(p, x[0] || 6);
	},

	Expo: function(p){
		return Math.pow(2, 8 * (p - 1));
	},

	Circ: function(p){
		return 1 - Math.sin(Math.acos(p));
	},

	Sine: function(p){
		return 1 - Math.sin((1 - p) * Math.PI / 2);
	},

	Back: function(p, x){
		x = x[0] || 1.618;
		return Math.pow(p, 2) * ((x + 1) * p - x);
	},

	Bounce: function(p){
		var value;
		for (var a = 0, b = 1; 1; a += b, b /= 2){
			if (p >= (7 - 4 * a) / 11){
				value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
				break;
			}
		}
		return value;
	},

	Elastic: function(p, x){
		return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * (x[0] || 1) / 3);
	}

});

['Quad', 'Cubic', 'Quart', 'Quint'].each(function(transition, i){
	Fx.Transitions[transition] = new Fx.Transition(function(p){
		return Math.pow(p, [i + 2]);
	});
});


//*/

/* BASE: baidu/string/formatColor.js */

 
/**
 * 这个方法改变DOM元素的背景色，实现高亮的效果。
 * @function
 * @param      {string|HTMLElement}     element            元素或者元素的ID
 * @param      {Object}                 options            选项。参数的详细说明如下表所示
 * @config     {String}                 beginColor         渐变开始时的背景色，如果设置了背景色则以设置的颜色为默认开始颜色，否则默认为'#FFFF00'
 * @config     {String}                 endColor           渐变结束时的背景色，如果设置了背景色则以设置的颜色为默认结束颜色，否则默认为'#FFFFFF'
 * @config     {String}                 finalColor         渐变结束时的背景色，如果设置了背景色则以设置的颜色为结束时背景色，否则默认为endColor值
 * @config     {String}                 textColor          渐变结束时的背景色，如果设置了背景色则以设置的颜色为结束时文本的颜色，否则默认为原文本色值
 * @config     {Number}                 duration           500,//效果持续时间，默认值为500ms
 * @config     {Number}                 interval           16, //动画帧间隔时间，默认值为16ms
 * @config     {Function}               transition         function(schedule){return schedule;},时间线函数
 * @config     {Function}               onbeforestart      function(){},//效果开始前执行的回调函数
 * @config     {Function}               onbeforeupdate     function(){},//每次刷新画面之前会调用的回调函数
 * @config     {Function}               onafterupdate      function(){},//每次刷新画面之后会调用的回调函数
 * @config     {Function}               onafterfinish      function(){},//效果结束后会执行的回调函数
 * @config     {Function}               oncancel           function(){},//效果被撤销时的回调函数
 */
baidu.fx.highlight = function(element, options) {
    if (!(element = baidu.dom.g(element))) return null;

    var e = element;

    var fx = baidu.fx.create(e, baidu.object.extend({
        //[Implement Interface] initialize
        initialize : function() {
            var me = this,
                CS = baidu.dom.getStyle,
                FC = baidu.string.formatColor,
                color = FC(CS(e, "color")) || "#000000",
                bgc   = FC(CS(e, "backgroundColor"));

            // 给用户指定的四个配置参数做一个保护值
            me.beginColor = me.beginColor || bgc || "#FFFF00";
            me.endColor   = me.endColor   || bgc || "#FFFFFF";
            me.finalColor = me.finalColor || me.endColor || me.element.style.backgroundColor;
            me.textColor == color && (me.textColor = "");

            this.protect("color");
            this.protect("backgroundColor");

            me.c_b = []; me.c_d = []; me.t_b = []; me.t_d = [];
            for (var n, i=0; i<3; i++) {
                n = 2 * i + 1;
                me.c_b[i]=parseInt(me.beginColor.substr(n, 2), 16);
                me.c_d[i]=parseInt(me.endColor.substr(n, 2), 16) - me.c_b[i];

                // 如果指定了文字的颜色，则文字颜色也渐变
                if (me.textColor) {
                    me.t_b[i]=parseInt(color.substr(n, 2), 16);
                    me.t_d[i]=parseInt(me.textColor.substr(n,2),16)-me.t_b[i];
                }
            }
        }

        //[Implement Interface] render
        ,render : function(schedule) {
            for (var me=this, a="#", b="#", n, i=0; i<3; i++) {
                n = Math.round(me.c_b[i] + me.c_d[i] * schedule).toString(16);
                a += ("00"+ n).substr(n.length);

                // 如果指定了文字的颜色，则文字颜色也渐变
                if (me.textColor) {
                    n = Math.round(me.t_b[i]+me.t_d[i]*schedule).toString(16);
                    b += ("00"+ n).substr(n.length);
                }
            }
            e.style.backgroundColor = a;
            me.textColor && (e.style.color = b);
        }

        //[Implement Interface] finish
        ,finish : function(){
            this.textColor && (e.style.color = this.textColor);
            e.style.backgroundColor = this.finalColor;
        }
    }, options || {}), "baidu.fx.highlight");

    return fx.launch();
};

/**
 * 面具遮罩效果。注意：只适用于绝对定位的DOM元素.
 * @function
 * @param       {string|HTMLElement}      element           元素或者元素的ID
 * @param       {Object}                  options           选项。参数的详细说明如下表所示
 * @config      {String}                  startOrigin       "0px 0px",//起始坐标描述。"x y"：x方向和y方向坐标。取值包括像素(含px字符)，百分比，top、left、center、bottom、right，默认"0px 0px"。
 * @config      {Number}                  from              0,//效果起始值。介于0到1之间的一个数字，默认为0。
 * @config      {Number}                  to                1,//效果结束值。介于0到1之间的一个数字，默认为1。
 * @config      {Number}                  duration          500,//效果持续时间，默认值为500ms。
 * @config      {Number}                  interval          16, //动画帧间隔时间，默认值为16ms。
 * @config      {Function}                transition        function(schedule){return schedule;},时间线函数
 * @config      {Function}                onbeforestart     function(){},//效果开始前执行的回调函数
 * @config      {Function}                onbeforeupdate    function(){},//每次刷新画面之前会调用的回调函数
 * @config      {Function}                onafterupdate     function(){},//每次刷新画面之后会调用的回调函数
 * @config      {Function}                onafterfinish     function(){},//效果结束后会执行的回调函数
 * @config      {Function}                oncancel          function(){},//效果被撤销时的回调函数
 */
baidu.fx.mask = function(element, options) {
    // mask 效果只适用于绝对定位的DOM元素
    if (!(element = baidu.dom.g(element)) ||
        baidu.dom.getStyle(element, "position") != "absolute")
        return null;

    var e = element, original = {};
    options = options || {};

    // [startOrigin] "0px 0px" "50% 50%" "top left"
    var r = /^(\d+px|\d?\d(\.\d+)?%|100%|left|center|right)(\s+(\d+px|\d?\d(\.\d+)?%|100%|top|center|bottom))?/i;
    !r.test(options.startOrigin) && (options.startOrigin = "0px 0px");

    var options = baidu.object.extend({restoreAfterFinish:true, from:0, to:1}, options || {});

    var fx = baidu.fx.create(e, baidu.object.extend({
        //[Implement Interface] initialize
        initialize : function() {
            e.style.display = "";
            this.protect("clip");
            original.width = e.offsetWidth;
            original.height = e.offsetHeight;

            // 计算效果起始点坐标
            r.test(this.startOrigin);
            var t1 = RegExp["\x241"].toLowerCase(),
                t2 = RegExp["\x244"].toLowerCase(),
                ew = this.element.offsetWidth,
                eh = this.element.offsetHeight,
                dx, dy;

            if (/\d+%/.test(t1)) dx = parseInt(t1, 10) / 100 * ew;
            else if (/\d+px/.test(t1)) dx = parseInt(t1);
            else if (t1 == "left") dx = 0;
            else if (t1 == "center") dx = ew / 2;
            else if (t1 == "right") dx = ew;

            if (!t2) dy = eh / 2;
            else {
                if (/\d+%/.test(t2)) dy = parseInt(t2, 10) / 100 * eh;
                else if (/\d+px/.test(t2)) dy = parseInt(t2);
                else if (t2 == "top") dy = 0;
                else if (t2 == "center") dy = eh / 2;
                else if (t2 == "bottom") dy = eh;
            }
            original.x = dx;
            original.y = dy;
        }

        //[Implement Interface] render
        ,render : function(schedule) {
            var n = this.to * schedule + this.from * (1 - schedule),
                top = original.y * (1 - n) +"px ",
                left = original.x * (1 - n) +"px ",
                right = original.x * (1 - n) + original.width * n +"px ",
                bottom = original.y * (1 - n) + original.height * n +"px ";
            e.style.clip = "rect("+ top + right + bottom + left +")";
        }

        //[Implement Interface] finish
        ,finish : function(){
            if (this.to < this.from) e.style.display = "none";
        }
    }, options), "baidu.fx.mask");

    return fx.launch();
};

 
/**
 * 移动元素，将参数元素移动到指定位置。注意：对static定位的DOM元素无效。
 * @function
 * @param       {string|HTMLElement}      element           元素或者元素的ID
 * @param       {Object}                  options           选项。参数的详细说明如下表所示
 * @config      {Number}                  x                 0,//横坐标移动的偏移量，默认值为0px。
 * @config      {Number}                  y                 0,//纵坐标移动的偏移量，默认值为0px。
 * @config      {Number}                  duration          500,//效果持续时间，默认值为500ms。
 * @config      {Number}                  interval          16, //动画帧间隔时间，默认值为16ms。
 * @config      {Function}                transition        function(schedule){return schedule;},时间线函数
 * @config      {Function}                onbeforestart     function(){},//效果开始前执行的回调函数
 * @config      {Function}                onbeforeupdate    function(){},//每次刷新画面之前会调用的回调函数
 * @config      {Function}                onafterupdate     function(){},//每次刷新画面之后会调用的回调函数
 * @config      {Function}                onafterfinish     function(){},//效果结束后会执行的回调函数
 * @config      {Function}                oncancel          function(){},//效果被撤销时的回调函数
 * @remark
 * 1.0.0开始支持
 */
baidu.fx.move = function(element, options) {
    if (!(element = baidu.dom.g(element))
        || baidu.dom.getStyle(element, "position") == "static") return null;
    
    options = baidu.object.extend({x:0, y:0}, options || {});
    if (options.x == 0 && options.y == 0) return null;

    var fx = baidu.fx.create(element, baidu.object.extend({
        //[Implement Interface] initialize
        initialize : function() {
            this.protect("top");
            this.protect("left");

            this.originX = parseInt(baidu.dom.getStyle(element, "left"))|| 0;
            this.originY = parseInt(baidu.dom.getStyle(element, "top")) || 0;
        }

        //[Implement Interface] transition
        ,transition : function(percent) {return 1 - Math.pow(1 - percent, 2);}

        //[Implement Interface] render
        ,render : function(schedule) {
            element.style.top  = (this.y * schedule + this.originY) +"px";
            element.style.left = (this.x * schedule + this.originX) +"px";
        }
    }, options), "baidu.fx.move");

    return fx.launch();
};

 
/**
 * 移动渐变效果。这个效果会使目标元素移动指定的距离。注意: 对static定位的DOM元素无效。
 * @function
 * @param       {string|HTMLElement}      element               元素或者元素的ID
 * @param       {Array|Object}            distance              偏移距离。若为数组，索引0为x方向，索引1为y方向；若为Object，键x为x方向，键y为y方向；单位：px，默认值为：0。
 * @param       {Object}                  options               选项。参数的详细说明如下表所示
 * @config      {Number}                  duration              500,//效果持续时间，默认值为500ms。
 * @config      {Number}                  interval              16, //动画帧间隔时间，默认值为16ms。
 * @config      {Function}                restore               restore方法,在onafterfinish与oncancel时默认调用
 * @config      {Boolean}                 restoreAfterFinish    默认为true，在onafterfinish与oncancel事件中调用restore方法。
 * @config      {Function}                transition            function(schedule){return schedule;},时间线函数
 * @config      {Function}                onbeforestart         function(){},//效果开始前执行的回调函数
 * @config      {Function}                onbeforeupdate        function(){},//每次刷新画面之前会调用的回调函数
 * @config      {Function}                onafterupdate         function(){},//每次刷新画面之后会调用的回调函数
 * @config      {Function}                onafterfinish         function(){},//效果结束后会执行的回调函数
 * @config      {Function}                oncancel              function(){},//效果被撤销时的回调函数
 * @remark
 * 1.0.0开始支持
 * @see baidu.fx.moveBy
 */
baidu.fx.moveBy = function(element, distance, options) {
    if (!(element = baidu.dom.g(element))
        || baidu.dom.getStyle(element, "position") == "static"
        || typeof distance != "object") return null;

    var d = {};
    d.x = distance[0] || distance.x || 0;
    d.y = distance[1] || distance.y || 0;

    var fx = baidu.fx.move(element, baidu.object.extend(d, options||{}));

    return fx;
};

 
/**
 * 移动渐变效果，该效果使元素移动到指定的位置。注意：对static定位的DOM元素无效。
 * @function
 * @param       {string|HTMLElement}      element               元素或者元素的ID
 * @param       {Array|Object}            point                 目标点坐标。若为数组，索引0为x方向，索引1为y方向；若为Object，键x为x方向，键y为y方向；单位：px，默认值：元素本来的坐标。
 * @param       {Object}                  options               选项。参数的详细说明如下表所示
 * @config      {Number}                  duration              500,//效果持续时间，默认值为500ms。
 * @config      {Number}                  interval              16, //动画帧间隔时间，默认值为16ms。
 * @config      {Function}                transition            function(schedule){return schedule;},时间线函数
 * @config      {Function}                onbeforestart         function(){},//效果开始前执行的回调函数
 * @config      {Function}                onbeforeupdate        function(){},//每次刷新画面之前会调用的回调函数
 * @config      {Function}                onafterupdate         function(){},//每次刷新画面之后会调用的回调函数
 * @config      {Function}                onafterfinish         function(){},//效果结束后会执行的回调函数
 * @config      {Function}                oncancel              function(){},//效果被撤销时的回调函数
 * @remark
 * 1.0.0开始支持
 * @see baidu.fx.moveTo
 */
baidu.fx.moveTo = function(element, point, options) {
    if (!(element = baidu.dom.g(element))
        || baidu.dom.getStyle(element, "position") == "static"
        || typeof point != "object") return null;

    var p = [point[0] || point.x || 0,point[1] || point.y || 0];
    var x = parseInt(baidu.dom.getStyle(element, "left")) || 0;
    var y = parseInt(baidu.dom.getStyle(element, "top"))  || 0;

    var fx = baidu.fx.move(element, baidu.object.extend({x: p[0]-x, y: p[1]-y}, options||{}));

    return fx;
};


/**
 * 将元素放大或缩小的效果。
 * @function
 * @param       {string|HTMLElement}      element               元素或者元素的ID
 * @param       {Object}                  options               选项。参数的详细说明如下表所示
 * @config      {String}                  transformOrigin       "0px 0px",//起始坐标描述。"x y"：x方向和y方向坐标，取值包括像素(含px字符，百分比，top、left、center、bottom、right，默认"0px 0px"。
 * @config      {Number}                  from                  效果起始值，介于0到1之间的一个数字。
 * @config      {Number}                  to                    效果结束值，介于0到1之间的一个数字。
 * @config      {Number}                  duration              500,//效果持续时间，默认值为500ms。
 * @config      {Number}                  interval              16, //动画帧间隔时间，默认值为16ms。
 * @config      {Function}                transition            function(schedule){return schedule;},时间线函数
 * @config      {Boolean}                 fade                  true，//渐变，默认为true
 * @config      {Function}                onbeforestart         function(){},//效果开始前执行的回调函数
 * @config      {Function}                onbeforeupdate        function(){},//每次刷新画面之前会调用的回调函数
 * @config      {Function}                onafterupdate         function(){},//每次刷新画面之后会调用的回调函数
 * @config      {Function}                onafterfinish         function(){},//效果结束后会执行的回调函数
 * @config      {Function}                oncancel              function(){},//效果被撤销时的回调函数
 */
baidu.fx.scale = function(element, options) {
    if (!(element = baidu.dom.g(element))) return null;
    options = baidu.object.extend({from : 0.1,to : 1}, options || {});

    // "0px 0px" "50% 50%" "top left"
    var r = /^(-?\d+px|\d?\d(\.\d+)?%|100%|left|center|right)(\s+(-?\d+px|\d?\d(\.\d+)?%|100%|top|center|bottom))?/i;
    !r.test(options.transformOrigin) && (options.transformOrigin = "0px 0px");

    var original = {},
        fx = baidu.fx.create(element, baidu.object.extend({
        fade: true,
            
        //[Implement Interface] initialize
        initialize : function() {
            baidu.dom.show(element);
            var me = this,
                o = original,
                s = element.style,
                save    = function(k){me.protect(k)};

            // IE浏览器使用 zoom 样式放大
            if (baidu.browser.ie) {
                save("top");
                save("left");
                save("position");
                save("zoom");
                save("filter");

                this.offsetX = parseInt(baidu.dom.getStyle(element, "left")) || 0;
                this.offsetY = parseInt(baidu.dom.getStyle(element, "top"))  || 0;

                if (baidu.dom.getStyle(element, "position") == "static") {
                    s.position = "relative";
                }

                // IE 的ZOOM没有起始点，以下代码就是实现起始点
                r.test(this.transformOrigin);
                var t1 = RegExp["\x241"].toLowerCase(),
                    t2 = RegExp["\x244"].toLowerCase(),
                    ew = this.element.offsetWidth,
                    eh = this.element.offsetHeight,
                    dx, dy;

                if (/\d+%/.test(t1)) dx = parseInt(t1, 10) / 100 * ew;
                else if (/\d+px/.test(t1)) dx = parseInt(t1);
                else if (t1 == "left") dx = 0;
                else if (t1 == "center") dx = ew / 2;
                else if (t1 == "right") dx = ew;

                if (!t2) dy = eh / 2;
                else {
                    if (/\d+%/.test(t2)) dy = parseInt(t2, 10) / 100 * eh;
                    else if (/\d+px/.test(t2)) dy = parseInt(t2);
                    else if (t2 == "top") dy = 0;
                    else if (t2 == "center") dy = eh / 2;
                    else if (t2 == "bottom") dy = eh;
                }

                // 设置初始的比例
                s.zoom = this.from;
                o.cx = dx; o.cy = dy;   // 放大效果起始原点坐标
            } else {
                save("WebkitTransform");
                save("WebkitTransformOrigin");   // Chrome Safari
                save("MozTransform");
                save("MozTransformOrigin");         // Firefox Mozllia
                save("OTransform");
                save("OTransformOrigin");             // Opera 10.5 +
                save("transform");
                save("transformOrigin");               // CSS3
                save("opacity");
                save("KHTMLOpacity");

                // 设置初始的比例和效果起始点
                s.WebkitTransform =
                    s.MozTransform =
                    s.OTransform =
                    s.transform = "scale("+ this.from +")";

                s.WebkitTransformOrigin = 
                    s.MozTransformOrigin = 
                    s.OTransformOrigin =
                    s.transformOrigin = this.transformOrigin;
            }
        }

        //[Implement Interface] render
        ,render : function(schedule) {
            var s = element.style,
                b = this.to == 1,
                b = typeof this.opacityTrend == "boolean" ? this.opacityTrend : b,
                p = b ? this.percent : 1 - this.percent,
                n = this.to * schedule + this.from * (1 - schedule);

            if (baidu.browser.ie) {
                s.zoom = n;
                if(this.fade){
                    s.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity:"+
                        Math.floor(p * 100) +")";
                }
                
                // IE 下得计算 transform-origin 变化
                s.top = this.offsetY + original.cy * (1 - n);
                s.left= this.offsetX + original.cx * (1 - n);
            } else {
                s.WebkitTransform =
                    s.MozTransform =
                    s.OTransform =
                    s.transform = "scale("+ n +")";
                if(this.fade){
                    s.KHTMLOpacity = s.opacity = p;
                }
            }
        }
    }, options), "baidu.fx.scale");

    return fx.launch();
};


 
/**
 * 将元素缩小的消失效果。
 * @function
 * @param     {string|HTMLElement}    element            元素或者元素的ID
 * @param     {Object}                options            选项。参数的详细说明如下表所示
 * @config    {String}                transformOrigin    "0px 0px",//起始坐标描述。"x y"：x方向和y方向坐标，取值包括像素(含px字符)，百分比，top、left、center、bottom、right，默认"0px 0px"。
 * @config    {Number}                from               1,//效果起始值。介于0到1之间的一个数字，默认为1。
 * @config    {Number}                to                 0.1,//效果结束值。介于0到1之间的一个数字，默认为0.1。
 * @config    {Number}                duration           500,//效果持续时间，默认值为500ms。
 * @config    {Number}                interval           16, //动画帧间隔时间，默认值为16ms。
 * @config    {Function}              transition         function(schedule){return schedule;},时间线函数
 * @config    {Function}              onbeforestart      function(){},//效果开始前执行的回调函数
 * @config    {Function}              onbeforeupdate     function(){},//每次刷新画面之前会调用的回调函数
 * @config    {Function}              onafterupdate      function(){},//每次刷新画面之后会调用的回调函数
 * @config    {Function}              onafterfinish      function(){},//效果结束后会执行的回调函数
 * @config    {Function}              oncancel           function(){},//效果被撤销时的回调函数
 */
baidu.fx.zoomOut = function(element, options) {
    if (!(element = baidu.dom.g(element))) return null;

    options = baidu.object.extend({
        to:0.1
        ,from:1
        ,opacityTrend:false
        ,restoreAfterFinish:true
        ,transition:function(n){return 1 - Math.pow(1 - n, 2);}
    },  options||{});

    var effect = baidu.fx.scale(element, options);
    effect.addEventListener("onafterfinish", function(){baidu.dom.hide(this.element);});

    return effect;
};



/**
 * 将DOM元素放大，并逐渐透明消失
 * 
 * @param   {HTMLElement}   element     DOM元素或者ID
 * @param   {JSON}          options     类实例化时的参数配置
 *          {transformOrigin, from,     to}
 *          {"0px 0px"        number    number}
 * @return  {fx}     效果类的实例
 */
 
/**
 * 将DOM元素放大，关逐渐透明消失。
 * @function
 * @param       {string|HTMLElement}      element               元素或者元素的ID
 * @param       {Object}                  options               选项。参数的详细说明如下表所示
 * @config      {Number}                  duration              800,//效果持续时间，默认值为800ms。
 * @config      {Number}                  to                    1.8,//放大倍数，默认1.8。
 * @config      {Function}                transition            function(schedule){return schedule;},时间线函数
 * @config      {Function}                onbeforestart         function(){},//效果开始前执行的回调函数
 * @config      {Function}                onbeforeupdate        function(){},//每次刷新画面之前会调用的回调函数
 * @config      {Function}                onafterupdate         function(){},//每次刷新画面之后会调用的回调函数
 * @config      {Function}                onafterfinish         function(){},//效果结束后会执行的回调函数
 * @config      {Function}                oncancel              function(){},//效果被撤销时的回调函数
 * @remark
 * 1.0.0开始支持
 * @see baidu.fx.puff
 */
baidu.fx.puff = function(element, options) {
    return baidu.fx.zoomOut(element,
        baidu.object.extend({
            to:1.8
            ,duration:800
            ,transformOrigin:"50% 50%"
        }, options||{})
    );
};

 
/**
 * 心跳闪现效果。
 * @function
 * @param       {string|HTMLElement}      element               元素或者元素的ID
 * @param       {Number}                  loop                  心跳次数，小于0则为永远跳动，默认为0次。
 * @param       {Object}                  options               选项。参数的详细说明如下表所示
 * @config      {Number}                  duration              500,//效果持续时间，默认值为500ms。
 * @config      {Number}                  interval              16, //动画帧间隔时间，默认值为16ms。
 * @config      {Function}                transition            function(schedule){return schedule;},时间线函数
 * @config      {Function}                onbeforestart         function(){},//效果开始前执行的回调函数
 * @config      {Function}                onbeforeupdate        function(){},//每次刷新画面之前会调用的回调函数
 * @config      {Function}                onafterupdate         function(){},//每次刷新画面之后会调用的回调函数
 * @config      {Function}                onafterfinish         function(){},//效果结束后会执行的回调函数
 * @config      {Function}                oncancel              function(){},//效果被撤销时的回调函数
 */
baidu.fx.pulsate = function(element, loop, options) {
    if (!(element = baidu.dom.g(element))) return null;
    if (isNaN(loop) || loop == 0) return null;

    var e = element;

    var fx = baidu.fx.create(e, baidu.object.extend({
        //[Implement Interface] initialize
        initialize : function() {this.protect("visibility");}

        //[Implement Interface] transition
        ,transition : function(percent) {return Math.cos(2*Math.PI*percent);}

        //[Implement Interface] render
        ,render : function(schedule) {
            e.style.visibility = schedule > 0 ? "visible" : "hidden";
        }

        //[Implement Interface] finish
        ,finish : function(){
            setTimeout(function(){
                baidu.fx.pulsate(element, --loop, options);
            }, 10);
        }
    }, options), "baidu.fx.pulsate");

    return fx.launch();
};

/* BASE: baidu/dom/remove.js */


 
/**
 * 删除元素的时候使用fadeOut效果
 * @function
 * @param       {string|HTMLElement}      element               元素或者元素的ID
 * @param       {Object}                  options               选项。参数的详细说明如下表所示
 * @config      {Number}                  duration              500,//效果持续时间，默认值为500ms。
 * @config      {Number}                  interval              16, //动画帧间隔时间，默认值为16ms。
 * @config      {Function}                transition            function(schedule){return schedule;},时间线函数
 * @config      {Function}                onbeforestart         function(){},//效果开始前执行的回调函数
 * @config      {Function}                onbeforeupdate        function(){},//每次刷新画面之前会调用的回调函数
 * @config      {Function}                onafterupdate         function(){},//每次刷新画面之后会调用的回调函数
 * @config      {Function}                onafterfinish         function(){},//效果结束后会执行的回调函数
 * @config      {Function}                oncancel              function(){},//效果被撤销时的回调函数
 */

baidu.fx.remove = function(element, options) {
    var afterFinish = options.onafterfinish ? options.onafterfinish : new Function();
    
    return baidu.fx.fadeOut(element, baidu.object.extend(options||{}, {
        onafterfinish: function(){
            baidu.dom.remove(this.element);
            afterFinish.call(this);
        }
    }));
};


 
/**
 * 按指定量移动滚动条。
 * @function
 * @param       {string|HTMLElement}      element               元素或者元素的ID
 * @param       {Array|JSON}              distance              移动的距离 [,] | {x,y}，支持数组与JSON格式
 * @param       {Object}                  options               选项。参数的详细说明如下表所示
 * @config      {Number}                  duration              500,//效果持续时间，默认值为500ms。
 * @config      {Number}                  interval              16, //动画帧间隔时间，默认值为16ms。
 * @config      {Function}                transition            function(schedule){return schedule;},时间线函数
 * @config      {Function}                onbeforestart         function(){},//效果开始前执行的回调函数
 * @config      {Function}                onbeforeupdate        function(){},//每次刷新画面之前会调用的回调函数
 * @config      {Function}                onafterupdate         function(){},//每次刷新画面之后会调用的回调函数
 * @config      {Function}                onafterfinish         function(){},//效果结束后会执行的回调函数
 * @config      {Function}                oncancel              function(){},//效果被撤销时的回调函数
 */
baidu.fx.scrollBy = function(element, distance, options) {
    if (!(element = baidu.dom.g(element)) || typeof distance != "object") return null;
    
    var d = {}, mm = {};
    d.x = distance[0] || distance.x || 0;
    d.y = distance[1] || distance.y || 0;

    var fx = baidu.fx.create(element, baidu.object.extend({
        //[Implement Interface] initialize
        initialize : function() {
            var t = mm.sTop   = element.scrollTop;
            var l = mm.sLeft  = element.scrollLeft;

            mm.sx = Math.min(element.scrollWidth - element.clientWidth - l, d.x);
            mm.sy = Math.min(element.scrollHeight- element.clientHeight- t, d.y);
        }

        //[Implement Interface] transition
        ,transition : function(percent) {return 1 - Math.pow(1 - percent, 2);}

        //[Implement Interface] render
        ,render : function(schedule) {
            element.scrollTop  = (mm.sy * schedule + mm.sTop);
            element.scrollLeft = (mm.sx * schedule + mm.sLeft);
        }

        ,restore : function(){
            element.scrollTop   = mm.sTop;
            element.scrollLeft  = mm.sLeft;
        }
    }, options), "baidu.fx.scroll");

    return fx.launch();
};

 
/**
 * 滚动条滚动到指定位置。
 * @function
 * @param     {string|HTMLElement}    element            元素或者元素的ID
 * @param     {Array|JSON}            point              移动的距离 [,] | {x,y}，支持数组与JSON格式
 * @param     {Object}                options            选项。参数的详细说明如下表所示
 * @config    {Number}                duration           500,//效果持续时间，默认值为500ms。
 * @config    {Number}                interval           16, //动画帧间隔时间，默认值为16ms。
 * @config    {Function}              transition         function(schedule){return schedule;},时间线函数
 * @config    {Function}              onbeforestart      function(){},//效果开始前执行的回调函数
 * @config    {Function}              onbeforeupdate     function(){},//每次刷新画面之前会调用的回调函数
 * @config    {Function}              onafterupdate      function(){},//每次刷新画面之后会调用的回调函数
 * @config    {Function}              onafterfinish      function(){},//效果结束后会执行的回调函数
 * @config    {Function}              oncancel           function(){},//效果被撤销时的回调函数
 */
baidu.fx.scrollTo = function(element, point, options) {
    if (!(element = baidu.dom.g(element)) || typeof point != "object") return null;
    
    var d = {};
    d.x = (point[0] || point.x || 0) - element.scrollLeft;
    d.y = (point[1] || point.y || 0) - element.scrollTop;

    return baidu.fx.scrollBy(element, d, options);
};

/* BASE: baidu/dom.js */





 
/**
 * 颤动的效果。
 * 说明：在效果执行过程中会修改DOM元素的position属性，可能会对包含的DOM元素带来影响
 * @function
 * @param     {string|HTMLElement}    element            元素或者元素的ID
 * @param     {Array|Object}          offset             震动范围。若为数组，索引0为x方向，索引1为y方向；若为Object，键x为x方向，键y为y方向；单位：px，默认值：元素本来的坐标。
 * @param     {Object}                options            选项。参数的详细说明如下表所示
 * @config    {Number}                duration           500,//效果持续时间，默认值为500ms。
 * @config    {Number}                interval           16, //动画帧间隔时间，默认值为16ms。
 * @config    {Function}              transition         function(schedule){return schedule;},时间线函数
 * @config    {Function}              onbeforestart      function(){},//效果开始前执行的回调函数
 * @config    {Function}              onbeforeupdate     function(){},//每次刷新画面之前会调用的回调函数
 * @config    {Function}              onafterupdate      function(){},//每次刷新画面之后会调用的回调函数
 * @config    {Function}              onafterfinish      function(){},//效果结束后会执行的回调函数
 * @config    {Function}              oncancel           function(){},//效果被撤销时的回调函数
 */
baidu.fx.shake = function(element, offset, options) {
    if (!(element = baidu.dom.g(element))) return null;

    var e = element;
    offset = offset || [];
    function tt() {
        for (var i=0; i<arguments.length; i++) {
            if (!isNaN(arguments[i])) return arguments[i];
        }
    }

    var fx = baidu.fx.create(e, baidu.object.extend({
        //[Implement Interface] initialize
        initialize : function() {
            this.protect("top");
            this.protect("left");
            this.protect("position");
            this.restoreAfterFinish = true;

            if (baidu.dom.getStyle(e, "position") == "static") {
                e.style.position = "relative";
            }
			var original = this['\x06original'];
            this.originX = parseInt(original.left|| 0);
            this.originY = parseInt(original.top || 0);
            this.offsetX = tt(offset[0], offset.x, 16);
            this.offsetY = tt(offset[1], offset.y, 5);
        }

        //[Implement Interface] transition
        ,transition : function(percent) {
            var line = 1 - percent;
            return Math.floor(line * 16) % 2 == 1 ? line : percent - 1;
        }

        //[Implement Interface] render
        ,render : function(schedule) {
            e.style.top  = (this.offsetY * schedule + this.originY) +"px";
            e.style.left = (this.offsetX * schedule + this.originX) +"px";
        }
    }, options || {}), "baidu.fx.shake");

    return fx.launch();
};

 
/**
 * 将元素放大的展现效果。
 * @function
 * @param     {string|HTMLElement}    element            元素或者元素的ID
 * @param     {Object}                options            选项。参数的详细说明如下表所示
 * @config    {String}                transformOrigin    "0px 0px",//起始坐标描述。"x y"：x方向和y方向坐标，取值包括像素(含px字符)，百分比，top、left、center、bottom、right，默认"0px 0px"。
 * @config    {Number}                from               0.1,//效果默认起始值
 * @config    {Number}                to                 1,//效果结束默认值，输入的数值越大，图片显示的越大。
 * @config    {Number}                duration           500,//效果持续时间，默认值为500ms。
 * @config    {Number}                interval           16, //动画帧间隔时间，默认值为16ms。
 * @config    {Function}              transition         function(schedule){return schedule;},时间线函数
 * @config    {Function}              onbeforestart      function(){},//效果开始前执行的回调函数
 * @config    {Function}              onbeforeupdate     function(){},//每次刷新画面之前会调用的回调函数
 * @config    {Function}              onafterupdate      function(){},//每次刷新画面之后会调用的回调函数
 * @config    {Function}              onafterfinish      function(){},//效果结束后会执行的回调函数
 * @config    {Function}              oncancel           function(){},//效果被撤销时的回调函数
 */
baidu.fx.zoomIn = function(element, options) {
    if (!(element = baidu.dom.g(element))) return null;

    options = baidu.object.extend({
        to:1
        ,from:0.1
        ,restoreAfterFinish:true
        ,transition:function(n){return Math.pow(n, 2)}
    },  options||{});

    return baidu.fx.scale(element, options);
};


/* BASE: baidu/history.js */
/* BASE: baidu/history/listen.js */
baidu.i18n = baidu.i18n || {};
baidu.i18n.cultures = baidu.i18n.cultures || {};
baidu.i18n.cultures['en-US'] = baidu.object.extend(baidu.i18n.cultures['en-US'] || {}, {
    calendar: {
        dateFormat: 'yyyy-MM-dd',
        titleNames: '#{MM}&nbsp;#{yyyy}',
        monthNames: ['January','February','March','April','May','June', 'July','August','September','October','November','December'],
        dayNames: {mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun'}
    },
    
    timeZone: -5,
    whitespace: new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g"),

    number: {
        group: ",",
        groupLength: 3,
        decimal: ".",
        positive: "",
        negative: "-",

        _format: function(number, isNegative){
            return baidu.i18n.number._format(number, {
                group: this.group,
                groupLength: this.groupLength,
                decimal: this.decimal,
                symbol: isNegative ? this.negative : this.positive 
            });
        }
    },

    currency: {
        symbol: '$'           
    },

    language: {
        ok: 'ok',
        cancel: 'cancel',
        signin: 'signin',
        signup: 'signup'
    }
});

baidu.i18n.currentLocale = baidu.i18n.currentLocale || 'en-US';

baidu.i18n.cultures['zh-CN'] = baidu.object.extend(baidu.i18n.cultures['zh-CN'] || {}, {
    calendar: {
        dateFormat: 'yyyy-MM-dd',
        titleNames: '#{yyyy}年&nbsp;#{MM}月',
        monthNames: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        dayNames: {mon: '一', tue: '二', wed: '三', thu: '四', fri: '五', sat: '六', sun: '日'}
    },
    
    timeZone: 8,
    whitespace: new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g"),
    
    number: {
        group: ",",
        groupLength: 3,
        decimal: ".",
        positive: "",
        negative: "-",

        _format: function(number, isNegative){
            return baidu.i18n.number._format(number, {
                group: this.group,
                groupLength: this.groupLength,
                decimal: this.decimal,
                symbol: isNegative ? this.negative : this.positive 
            });
        }
    },

    currency: {
        symbol: '￥'  
    },

    language: {
        ok: '确定',
        cancel: '取消',
        signin: '注册',
        signup: '登录'
    }
});

baidu.i18n.currentLocale = baidu.i18n.currentLocale || 'zh-CN';

baidu.i18n.number = baidu.i18n.number || {

    /**
     * 将传入的数字或者文字某种语言的格式进行格式化
     * @public
     * @param {String|Number} number 需要进行格式化的数字或者文字
     * @param {String} [sLocale] 可选参数，若传入的number格式为字符串，则该参数必须传入
     * @param {String} [tLocale] 目标语言
     * @return {String}
     */
    format: function(number, sLocale, tLocale){
        var me = this,
            sOpt = sLocale && baidu.i18n.cultures[sLocale].number,
            tOpt = baidu.i18n.cultures[tLocale || baidu.i18n.currentLocale].number,
            isNegative = false;

        if(typeof number === 'string'){
            
            if(number.indexOf(sOpt.negative) > -1){
                isNegative = true;
                number = number.replace(sOpt.negative, "");   
            }else if(number.indexOf(sOpt.positive) > -1){
                number = number.replace(sOpt.positive, "");
            }
            number = number.replace(new RegExp(sOpt.group,'g'), "");
        }else{
            if(number < 0){
                isNegative = true;
                number *= -1;       
            }
        }
        number = parseFloat(number);
        if(isNaN(number)){
            return 'Not a number'; 
        }
        
        return tOpt._format ? tOpt._format(number, isNegative) : me._format(number, {
            group: tOpt.group || ',',
            decimal: tOpt.decimal || '.',
            groupLength: tOpt.groupLength,
            symbol: isNegative ? tOpt.negative : tOpt.positive
        });
    },

    /**
     * 格式化数字
     * @private
     * @param {Number} number 需要个数化的数字
     * @param {Object} options 格式化数字使用的参数
     * @return {String}
     */
    _format: function(number, options){
        var numberArray = String(number).split(options.decimal),
            preNum = numberArray[0].split('').reverse(),
            aftNum = numberArray[1] || '',
            len = 0,remainder = 0,
            result = '';
        
        len = parseInt(preNum.length / options.groupLength);
        remainder = preNum.length % options.groupLength;
        len = remainder == 0 ? len - 1 : len;

        for(var i = 1; i <= len; i++){
            preNum.splice(options.groupLength * i + (i - 1), 0, options.group);    
        }
        preNum = preNum.reverse();
        result = options.symbol + preNum.join('') + (aftNum.length > 0 ? options.decimal + aftNum : '');

        return result;
    }
};


baidu.i18n.currency = baidu.i18n.currency || {
    
    /**
     * 将传入的数字或者文字某种语言的货币格式进行格式化
     * @public
     * @param {String|Number} number 需要进行格式化的数字或者文字
     * @param {String} [sLocale] 可选参数，若传入的number格式为字符串，则该参数必须传入
     * @param {String} [tLocale] 目标语言
     * @return {String}
     */
    format: function(number, sLocale, tLocale) {
        var me = this,
            sOpt = sLocale && baidu.i18n.cultures[sLocale].currency,
            tOpt = baidu.i18n.cultures[tLocale || baidu.i18n.currentLocale].currency,
            result;

        if(typeof number === "string"){
            number = number.replace(sOpt.symbol);
        }
        
        return tOpt.symbol + this._format(number, sLocale, tLocale);
    },

    /**
     * 按照语言的数字格式进行格式化
     * @private 
     * @param {Number | Number} number 数字
     * @param {String} [sLocale] 可选参数，若传入的number格式为字符串，则该参数必须传入
     * @param {String} [tLocale] 目标语言
     * @return {String}
     */
    _format: function(number, sLocale, tLocale){
        return baidu.i18n.number.format(number, sLocale, tLocale || baidu.i18n.currentLocale); 
    }
};

baidu.i18n.date = baidu.i18n.date || {

    /**
     * 获取某年某个月的天数
     * @public
     * @param {Number} year 年份.
     * @param {Number} month 月份.
     * @return {Number}
     */
    getDaysInMonth: function(year, month) {
        var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (month == 1 && baidu.i18n.date.isLeapYear(year)) {
            return 29;
        }
        return days[month];
    },

    /**
     * 判断传入年份是否时润年
     * @param {Number} year 年份.
     * @return {Boolean}
     */
    isLeapYear: function(year) {
        return !(year % 400) || (!(year % 4) && !!(year % 100));
    },

    /**
     * 将传入的date对象转换成指定地区的date对象
     * @public
     * @param {Date} dateObject
     * @param {String} sLocale dateObject 的地区标识，可选参数，传则以dateObject中获取的为准
     * @param {String} tLocale 地区名称简写字符.
     * @return {Date}
     */
    toLocaleDate: function(dateObject, sLocale, tLocale) {
        return this._basicDate(dateObject, sLocale, tLocale || baidu.i18n.currentLocale);
    },

    /**
     * 本地日历和格力高利公历相互转换的基础函数
     * @private
     * @param {Date} dateObject 需要转换的日期函数.
     * @param {String} sLocale dateObject 的地区标识，可选参数，否则以dateObject中获取的为准
     * @param {string} tlocale 传入date的地区名称简写字符，不传入则从date中计算得出.
     */
    _basicDate: function(dateObject, sLocale, tLocale) {
        var tTimeZone = baidu.i18n.cultures[tLocale || baidu.i18n.currentLocale].timeZone,
            tTimeOffset = tTimeZone * 60,
            sTimeZone,sTimeOffset,
            millisecond = dateObject.getTime();

        if(sLocale){
            sTimeZone = baidu.i18n.cultures[sLocale].timeZone;
            sTimeOffset = sTimeZone * 60;
        }else{
            sTimeOffset = -1 * dateObject.getTimezoneOffset();
            sTimeZone = sTimeZone / 60;
        }

        return new Date(sTimeZone != tTimeZone ? (millisecond  + (tTimeOffset - sTimeOffset) * 60000) : millisecond);
    }
};


baidu.i18n.string = baidu.i18n.string || {
    
    /**
     * 按照某种语言的格式去掉字符串两边的空白字符
     * @public
     * @param {String} source 需要格式化的语言
     * @param {String} [locale] 目标语言
     * @return {String}
     */
    trim: function(source, locale){
        var pat = baidu.i18n.cultures[locale || baidu.i18n.currentLocale].whitespace;
        return String(source).replace(pat,"");
    },

    /**
     * 将传入的字符串翻译成目标语言
     * @public 
     * @param {String} source 需要进行翻译的字符串
     * @param {String} [locale] 目标语言
     * @return {String}
     */
    translation: function(source, locale){
        var tOpt = baidu.i18n.cultures[locale || baidu.i18n.currentLocale].language;

        return tOpt[source] || '';
    }

};

baidu.tools = baidu.tools || {};

/* BASE: baidu/fn/blank.js */

(function(){
 
        //日志队列
    var _logStack = [], 

        //存放time调用的datehandle
        _timeObject = {},   
        
        /**
         * 设置的push数据时使用的timeHandler
         * 若timeInterval为零，则立即输出数据
         **/
        _timeHandler = null,

        timeInterval = 0,
    
        _logLevel = parseInt('1111',2),

        _enableDialg = false,
        _dialog = null;
     
    /**
     * 打印log
     * @public
     * @param {Object} data 需要打印的内容
     * @return {Null}
     */
    function log(data){
        _log(data, 'log'); 
    };

    /**
     * 打印error
     * @public
     * @param {Object} data 需要打印的内容
     * @return {Null}
     */
    log.error = function(data){
        _log(data,'error');
    };

    /**
     * 打印info
     * @public
     * @param {Object} data 需要打印的内容
     * @return {Null}
     */
    log.info = function(data){
        _log(data,'info');
    };

    /**
     * 打印warn
     * @public
     * @param {Object} data 需要打印的内容
     * @return {Null}
     */
    log.warn = function(data){
        _log(data,'warn');
    };

    /**
     * 设置timer
     * 若此时一寸在相同名称的计时器，则立即输出，并重新初始化
     * 若不存在，则初始化计时器
     * @public
     * @param {String} name timer的标识名称
     * @return {Null}
     */
    log.time = function(name){
        var timeOld = _timeObject[name],
            timeNew = new Date().getTime();

        if(timeOld){
            _log(timeNew - timeOld, 'info');
        }
        _timeObject[name] = timeNew;
    };

    /**
     * 终止timer,并打印
     * @public
     * @param {String} name timer的标识名称
     * @return {Null}
     */
    log.timeEnd = function(name){
        var timeOld = _timeObject[name],
            timeNew = new Date().getTime();

        if(timeOld){
            _log(timeNew - timeOld, 'info');
            delete(_timeObject[name]);
        }else{
            _log('timer not exist', 'error');
        }
    };

    /**
     * 开启dialog进行输出
     * @public
     * @return {Null}
     */
    log.enableDialog = function(){
        
        _enableDialg = true;
        if(!_dialog && baidu.tools.log.Dialog){
            _dialog = new baidu.tools.log.Dialog();
        }else{
            _dialog.open();
        }
    };

    /**
     * 关闭dialog
     * @public
     * @return {Null}
     */
    log.disableDialog = function(){
        
        _enableDialg = false;
        _dialog && _dialog.close();
    };
   
    /**
     * 输出log
     * @public
     * @param {String} data 需要打印的内容
     * @return {Null}
     */
    function _log (data,type){
        var me = log;

        if(_logLevel & me.logLevel[type]){
            _logStack.push({type:type,data:data});
        }

        if(timeInterval == 0){
            //如果这是time为0，则立即调用_push方法
            _push();
        }else{
            //如果timeInterval > 0
            !_timeHandler && (_timeHandler = setInterval(_push,timeInterval));
        }
    };

    /**
     * 推送log,并调用回调函数
     * @private
     * @return {Null}
     */
    function _push (){
        var me = log,
            data = _logStack;

        //清空栈
        _logStack = [];
        _dialog && _dialog.push(data);

        me.callBack.call(data);
    };

    /**
     * 设置log的timeInterval值
     * 当timeInterval = 0时，则当有日志需要输出时，立即输出
     * 当timeInterval > 0时，则以该timeStep为间隔时间，输出日志
     * 默认值为0
     * @param {Number} ts timeInterval
     * @return {Null}
     */
    log.setTimeInterval = function(ti){
        
        timeInterval = ti;
        
        //停止当前的计时
        if(_timeHandler && timeInterval == 0){
            clearInterval(_timeHandler);
            _timeHandler = null;
        }
    };

    
   /**
    * 设置所要记录的log的level
    * @param {String} 'log','error','info','warn'中一个或多个
    * @return {Null}
    */ 
    log.setLogLevel = function(){
        var me = log,
            logLevel = parseInt('0000',2);
            
        baidu.each(arguments,function(ll){
            logLevel = logLevel | me.logLevel[ll];
        });

        _logLevel = logLevel;
    };
   
    //日志等级
    log.logLevel = {
        'log'   : parseInt('0001', 2),
        'info'  : parseInt('0010', 2),
        'warn'  : parseInt('0100', 2),
        'error' : parseInt('1000', 2)
    };

    //回调函数
    log.callBack = baidu.fn.blank;


    baidu.log = baidu.tools.log = log;
})();

/* BASE: baidu/object/each.js */

/* BASE: baidu/dom/children.js */
/* BASE: baidu/dom/ready.js */

/* BASE: baidu/lang/isArray.js */
/* BASE: baidu/lang/isBoolean.js */


/* BASE: baidu/lang/isObject.js */
/* BASE: baidu/lang/isString.js */

//依赖包
/** @namespace */
baidu.ui = baidu.ui || { version: '1.3.9' };

/**
 * 通过uiType找到UI类
 * 查找规则：
 * suggestion -> baidu.ui.Suggestion
 * toolbar-spacer -> baidu.ui.Toolbar.Spacer.
 *
 * @author berg
 *
 * @param {String} uiType
 * @return {object} UI类
 */
baidu.ui.getUI = function(uiType){
    var uiType = uiType.split('-'),
        result = baidu.ui,
        len = uiType.length,
        i = 0;

    for (; i < len; i++) {
        result = result[uiType[i].charAt(0).toUpperCase() + uiType[i].slice(1)];
    }
    return result;
};



/**
 * 创建一个ui控件
 * @author berg
 * @param {object|String} UI控件类或者uiType
 * @param {object} options optional 控件的初始化属性
 *
 * autoRender : 是否自动render，默认true
 * element : render到的元素
 * parent : 父控件
 *
 * @return {object} 创建好的控件实例
 */
baidu.ui.create = function(UI, options){
    if(baidu.lang.isString(UI)){
        UI = baidu.ui.getUI(UI);
    }
    return new UI(options);
};




/* BASE: baidu/lang/Class.js */





/**
 * UI基类，所有的UI都应该从这个类中派生出去
 *
 * @author berg
 *
 * property:
 * 
 * mainId
 */
baidu.ui.Base = {

    id : "",

    /**
     * 获得当前控件的id
     * @param {string} optional key 
     * @return {string} id
     */
    getId : function(key){
        var ui = this, idPrefix;
        //通过guid区别多实例
        idPrefix = "tangram-" + ui.uiType + '--' + (ui.id ? ui.id : ui.guid);
        return key ? idPrefix + "-" + key : idPrefix;
    },

    /**
     * 获得class，支持skin
     *
     * @param {string} optional key
     *
     * @return {string} className
     */
    getClass : function(key){
        var me = this,
            className = me.classPrefix,
            skinName = me.skin;
         if (key) {
             className += '-' + key;
             skinName += '-' + key;
         }
         if (me.skin) {
             className += ' ' + skinName;
         }
         return className;
    },

    getMain : function(){
        return baidu.g(this.mainId);
    },

    getBody : function(){
        return baidu.g(this.getId());
    },

    
    /**
     * 控件类型：如dialog
     */
    uiType : "",
    
    /**
     * 获取调用的字符串的引用前缀
     */
    getCallRef : function(){
        return "window['$BAIDU$']._instances['" + this.guid + "']";
    },

    /**
     * 获取调用的字符串
     */
    getCallString : function(fn){
        var i = 0,
            arg = Array.prototype.slice.call(arguments, 1),
            len = arg.length;
        for (; i < len; i++) {
            if (typeof arg[i] == 'string') {
                arg[i] = "'" + arg[i] +"'";
            }
        }
        //如果被闭包包起来了，用baidu.lang.instance会找到最外面的baidu函数，可能出错
        return this.getCallRef() 
                + '.' + fn + '('
                + arg.join(',') 
                + ');'; 
    },

    /**
     * 添加事件. 避免析构中漏掉注销事件.
     * @param {HTMLElement|string|window} element 目标元素或目标元素id
     * @param {string} type 事件类型
     * @param {Function} listener 需要添加的监听器
     */
    on : function(element, type, listener){
        baidu.on(element, type, listener);
        this.addEventListener("ondispose", function(){
            baidu.un(element, type, listener);
        });
    },

    /**
     * 渲染控件到指定的元素
     * @param {HTMLElement} main optional   要渲染到的元素，可选。
     *                                      如果不传此参数，则会在body下创建一个绝对定位的div做为main
     * @return  {HTMLElement} main 渲染到的元素
     */
    renderMain : function(main){
        var ui = this,
            i = 0,
            len;
        //如果被渲染过就不重复渲染
        if (ui.getMain()) {
            return ;
        }
        main = baidu.g(main);
        //如果没有main元素，创建一个在body下面的div当作main
        if(!main){
            main = document.createElement('div');
            document.body.appendChild(main);
            main.style.position = "absolute";
            //给这个元素创建一个class，方便用户控制
            main.className = ui.getClass("main");
        }
        if(!main.id){
            main.id = ui.getId("main");
        }
        ui.mainId = main.id;
        main.setAttribute('data-guid', ui.guid);

        return main;
    },

    /**
     * 销毁当前实例
     */
    dispose : function(){
        this.dispatchEvent("dispose");
        baidu.lang.Class.prototype.dispose.call(this);
    }
};




/**
 * 创建一个UI控件类
 *
 * @param {function} constructor ui控件构造器
 * @param {object} options 选项
 *
 * @return {object} ui控件
 */
baidu.ui.createUI = function(constructor, options) {
    options = options || {};
    var superClass = options.superClass || baidu.lang.Class,
        lastInherit = superClass == baidu.lang.Class ? 1 : 0,
        i,
        n,
        ui = function(opt, _isInherits){// 创建新类的真构造器函数
            var me = this;
            opt = opt || {};
            // 继承父类的构造器，将isInherits设置成true，在后面不执行render操作
            superClass.call(me, !lastInherit ? opt : (opt.guid || ""), true);

            //扩展静态配置到this上
            baidu.object.extend(me, ui.options);
            //扩展当前options中的项到this上
            baidu.object.extend(me, opt);
            //baidu.object.merge(me, opt, {overwrite:true, recursive:true});

            me.classPrefix = me.classPrefix || "tangram-" + me.uiType.toLowerCase();

            //初始化行为
            //行为就是在控件实例上附加一些属性和方法
            for(i in baidu.ui.behavior){
                //添加行为到控件上
                if(typeof me[i] != 'undefined' && me[i]){
                    baidu.object.extend(me, baidu.ui.behavior[i]);
                    if(baidu.lang.isFunction(me[i])){
                        me.addEventListener("onload", function(){
                            baidu.ui.behavior[i].call(me[i].apply(me));
                        });
                    }else{
                        baidu.ui.behavior[i].call(me);
                    }
                }
            }

            //执行控件自己的构造器
            constructor.apply(me, arguments);

            //执行插件的构造器
            for (i=0, n=ui._addons.length; i<n; i++) {
                ui._addons[i](me);
            }
            if(opt.parent && me.setParent){
                me.setParent(opt.parent);
            }
            if(!_isInherits && opt.autoRender){ 
                me.render(opt.element);
            }
        },
        C = function(){};

    C.prototype = superClass.prototype;

    //继承父类的原型链
    var proto = ui.prototype = new C();

    //继承Base中的方法到prototype中
    for (i in baidu.ui.Base) {
        proto[i] = baidu.ui.Base[i];
    }

    /**
     * 扩展控件的prototype
     * 
     * @param {Object} json 要扩展进prototype的对象
     *
     * @return {Object} 扩展后的对象
     */
    ui.extend = function(json){
        for (i in json) {
            ui.prototype[i] = json[i];
        }
        return ui;  // 这个静态方法也返回类对象本身
    };

    //插件支持
    ui._addons = [];
    ui.register = function(f){
        if (typeof f == "function")
            ui._addons.push(f);
    };
    
    //静态配置支持
    ui.options = {};
    
    return ui;
};

/* BASE: baidu/page/getViewWidth.js */
/* BASE: baidu/page/getViewHeight.js */
/* BASE: baidu/page/getScrollLeft.js */
/* BASE: baidu/page/getScrollTop.js */










/* BASE: baidu/dom/_styleFilter/px.js */



/* BASE: baidu/browser.js */


/* BASE: baidu/dom/setBorderBoxHeight.js */
/* BASE: baidu/dom/setBorderBoxWidth.js */

/**
 * Dialog基类，建立一个dialog实例
 * @class Dialog类
 * @param     {Object}        options               选项
 * @config    {DOMElement}    content               要放到dialog中的元素，如果传此参数时同时传contentText，则忽略contentText。
 * @config    {String}        contentText           dialog中的内容
 * @config    {String|Number} width                 内容区域的宽度，默认值为400，注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
 * @config    {String|Number} height                内容区域的高度，默认值为300
 * @config    {String|Number} top                   dialog距离页面上方的距离
 * @config    {String|Number} left                  dialog距离页面左方的距离
 * @config    {String}        titleText             dialog标题文字
 * @config    {String}        classPrefix           dialog样式的前缀
 * @config    {Number}        zIndex                dialog的zIndex值，默认值为1000
 * @config    {Function}      onopen                dialog打开时触发
 * @config    {Function}      onclose               dialog关闭时触发
 * @config    {Function}      onbeforeclose         dialog关闭前触发，如果此函数返回false，则组织dialog关闭。
 * @config    {Function}      onupdate              dialog更新内容时触发
 * @config    {Boolean}       closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭dialog。
 * @config    {String}        closeText             closeButton模块提供支持，关闭按钮上的title。
 * @config    {Boolean}       modal                 modal模块支持，是否显示遮罩
 * @config    {String}        modalColor            modal模块支持，遮罩的颜色
 * @config    {Number}        modalOpacity          modal模块支持，遮罩的透明度
 * @config    {Number}        modalZIndex           modal模块支持，遮罩的zIndex值
 * @config    {Boolean}       draggable             draggable模块支持，是否支持拖拽
 * @config    {Function}      ondragstart           draggable模块支持，当拖拽开始时触发
 * @config    {Function}      ondrag                draggable模块支持，拖拽过程中触发
 * @config    {Function}      ondragend             draggable模块支持，拖拽结束时触发
 * @plugin    modal           可以让dialog后面加一个半透明层，并且锁定窗口。
 * @plugin    draggable       可以让dialog支持被拖拽。
 * @plugin    keyboard        可以让dialog支持一些常用的键盘操作。
 * @plugin    button          可以让dialog底部添加按钮。
 * @plugin    closeButton     可以让dialog右上角添加一个关闭按钮。
 * @plugin    smartCover      可以让dialog支持遮罩下方的select和flash。
 * @plugin    resizable       可以为Dialog添加缩放功能。
 */

baidu.ui.Dialog = baidu.ui.createUI(function (options){

    var me = this;
    me._content = 'initElement';
    me.content = me.content || null;
    
    me._contentText = 'initText';
    me.contentText = me.contentText || '';
    
    me._titleText = 'initText';
    me.titleText = me.titleText || '';

}).extend(
    /**
     *  @lends baidu.ui.Dialog.prototype
     */
{
    //ui控件的类型，传入给UIBase **必须**
    uiType: 'dialog',
    //ui控件的class样式前缀 可选
    //classPrefix     : "tangram-dialog-",

    width: '',
    height: '',

    top: 'auto',
    left: 'auto',
    zIndex: 1000,//没有做层管理
    //用style来保证其初始状态，不会占据屏幕的位置
    tplDOM: "<div id='#{id}' class='#{class}' style='position:relative'>#{title}#{content}#{footer}</div>",
    tplTitle: "<div id='#{id}' class='#{class}'><span id='#{inner-id}' class='#{inner-class}'>#{content}</span></div>",
    tplContent: "<div id='#{id}' class='#{class}' style='overflow:hidden; position:relative'>#{content}</div>",
    tplFooter: "<div id='#{id}' class='#{class}'></div>",

    /**
     * 查询当前窗口是否处于显示状态
     * @public
     * @return {Boolean}  是否处于显示状态
     */
    isShown: function() {
        return baidu.ui.Dialog.instances[this.guid] == 'show';
    },
    
    /**
     * 获取dialog的HTML字符串
     * @private
     * @return {String} DialogHtml
     */
    getString: function() {
        var me = this,
            html,
            title = 'title',
            titleInner = 'title-inner',
            content = 'content',
            footer = 'footer';

        return baidu.format(me.tplDOM, {
            id: me.getId(),
            'class' : me.getClass(),
            title: baidu.format(
                me.tplTitle, {
                    id: me.getId(title),
                    'class' : me.getClass(title),
                    'inner-id' : me.getId(titleInner),
                    'inner-class' : me.getClass(titleInner),
                    content: me.titleText || ''
                }),
            content: baidu.format(
                me.tplContent, {
                    id: me.getId(content),
                    'class' : me.getClass(content),
                    content: me.contentText || ''
                }),
            footer: baidu.format(
                me.tplFooter, {
                    id: me.getId(footer),
                    'class' : me.getClass(footer)
            })
        });
    },

    /**
     * 绘制dialog到页面
	 * @public
     * @return {HTMLElement} mainDiv
     */
    render: function() {
        var me = this,
            main;

        //避免重复render
        if (me.getMain()) {
            return;
        }

        main = me.renderMain();

        //main.style.left =  '-10000em';
        main.innerHTML = me.getString();
        me._update();
        me._updatePosition();

        baidu.dom.setStyles(me.getMain(), {
            position: 'absolute',
            zIndex: me.zIndex,
            marginLeft: '-100000px'
        });
        //当居中时，窗口改变大小时候要重新计算位置
        me.windowResizeHandler = me.getWindowResizeHandler();
        baidu.on(window, 'resize', me.windowResizeHandler);

        me.dispatchEvent('onload');

        return main;
    },
    
    /**
     * 更新title，和content内容函数
     * @private
     * @param {Object} options 传入参数
     * @return null
     */
    _update:function(options){
        var me = this,
            content = me.getContent(),
            options = options || {},
            title = me.getTitleInner(),
            setText = false;
      
        if(typeof options.titleText != 'undefined'){
            //当options中存在titleText时,认为用户需要更新titleText，直接更新
            title.innerHTML = options.titleText;
            me.titleText = me._titleText = options.titleText;
        }else if (me.titleText != me._titleText){
            //当第一次创建dialog时，无论是否传入titleText，都会走入该分支
            //之后若采用dialog.titleText = '***'；dialog.update();方式更新，也会进入该分支
            title.innerHTML = me.titleText;
            me._titleText = me.titleText;
        } 

        //content优先级大于contentText
        if(typeof options.content != 'undefined'){
            //当options中存在content，认为用户需要更新content,直接更新
            content.innerHTML = '';
            me.content = options.content;
            //若content为null。则代表删除content属性
            if(options.content !== null){
                content.appendChild(options.content);
                me.content = me._content = content.firstChild;
                me.contentText = me._contentText = content.innerHTML;
                return;
            }
            setText = true;
        }else if(me.content !== me._content){
            //第一次new dialog时，进入该分支
            //若采用dialog.content = HTMLElement;dialog.update();的方式进行更新，进去该分支
            content.innerHTML = '';
            if(me.content !== null){
                content.appendChild(me.content);
                me.content = me._content = content.firstChild;
                me.contentText = me._contentText = content.innerHTML;
                return;
            }
            setText = true;
        }

        if(typeof options.contentText != 'undefined'){
            //当options中存在contentText，则认为用户要更新contentText，直接更新
            content.innerHTML = options.contentText;
            me.contentText = me._contentText = options.contentText;
            me.content = me._content = content.firstChild;
        }else if((me.contentText != me._contentText) || setText){
            //当new dialog时，无论是否传入contentText,都会进入该分支
            //若才用dialog.contentText = '***';dialog.update()进行更新，也会进入该分支
            content.innerHTML = me.contentText;
            me._contentText = me.contentText;
            me.content = me._content = content.firstChild;
        }
        
        delete(options.content);
        delete(options.contentText);
        delete(options.titleText);
        baidu.extend(me,options);
    },

    /**
     * 获得resize事件绑定的函数
     * @private
     * @return {Function}
     */
    getWindowResizeHandler: function() {
        var me = this;
        return function() {
            me._updatePosition();
        };
    },

    /**
     * 显示当前dialog
	 * @public
     */
    open: function() {
        var me = this;
        me._updatePosition();    
        me.getMain().style.marginLeft = 'auto';
        baidu.ui.Dialog.instances[me.guid] = 'show';
        me.dispatchEvent('onopen');
    },

    /**
     * 隐藏当前dialog
	 * @public
     */
    close: function() {
        var me = this;
        if (me.dispatchEvent('onbeforeclose')) {
            me.getMain().style.marginLeft = '-100000px';
            baidu.ui.Dialog.instances[me.guid] = 'hide';

            me.dispatchEvent('onclose');
        }
    },

	/**
     * 更新dialog状态 
	 * @public
     * @param     {Object}        options               选项参数
     * @config    {DOMElement}    content               要放到dialog中的元素，如果传此参数时同时传contentText，则忽略contentText。
     * @config    {String}        contentText           dialog中的内容
     * @config    {String|Number} width                 内容区域的宽度，默认值为400，注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
     * @config    {String|Number} height                内容区域的高度，默认值为300
     * @config    {String|Number} top                   dialog距离页面上方的距离
     * @config    {String|Number} left                  dialog距离页面左方的距离
     * @config    {String}        titleText             dialog标题文字
     * @config    {String}        classPrefix           dialog样式的前缀
     * @config    {Number}        zIndex                dialog的zIndex值，默认值为1000
     * @config    {Function}      onopen                dialog打开时触发
     * @config    {Function}      onclose               dialog关闭时触发
     * @config    {Function}      onbeforeclose         dialog关闭前触发，如果此函数返回false，则组织dialog关闭。
     * @config    {Function}      onupdate              dialog更新内容时触发
     * @config    {Boolean}       closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭dialog。
     * @config    {String}        closeText             closeButton模块提供支持，关闭按钮上的title。
     * @config    {Boolean}       modal                 modal模块支持，是否显示遮罩
     * @config    {String}        modalColor            modal模块支持，遮罩的颜色
     * @config    {Number}        modalOpacity          modal模块支持，遮罩的透明度
     * @config    {Number}        modalZIndex           modal模块支持，遮罩的zIndex值
     * @config    {Boolean}       draggable             draggable模块支持，是否支持拖拽
     * @config    {Function}      ondragstart           draggable模块支持，当拖拽开始时触发
     * @config    {Function}      ondrag                draggable模块支持，拖拽过程中触发
     * @config    {Function}      ondragend             draggable模块支持，拖拽结束时触发
     */
    update: function(options) {
        var me = this;
        me._update(options);
        me._updatePosition();
        me.dispatchEvent('onupdate');
    },

    /**
     * 获取body的寛高
     * @private
     * @return {Object} {width,height}，名值对
     */
    _getBodyOffset: function() {
        var me = this,
            bodyOffset,
            body = me.getBody(),
            content = me.getContent(),
            title = me.getTitle(),
            footer = me.getFooter();

        bodyOffset = {
            'width' : 0,
            'height' : 0
        };

        //确定取值为数字
        function getStyleNum(d,style) {
            var result = parseFloat(baidu.getStyle(d, style));
            result = isNaN(result) ? 0 : result;
            result = baidu.lang.isNumber(result) ? result : 0;
            return result;
        }
        //fix margin
        baidu.each(['marginLeft', 'marginRight'], function(item,index) {
            bodyOffset['width'] += getStyleNum(content, item);
        });

        bodyOffset['height'] += title.offsetHeight + getStyleNum(title, 'marginTop');
        bodyOffset['height'] += footer.offsetHeight + getStyleNum(footer, 'marginBottom');

        //fix margin
        var mt = getStyleNum(content, 'marginTop'), md = getStyleNum(title, 'marginBottom');
        bodyOffset['height'] += mt >= md ? mt : md;
        mt = getStyleNum(footer, 'marginTop'), md = getStyleNum(content, 'marginBottom');
        bodyOffset['height'] += mt >= md ? mt : md;

        return bodyOffset;
    },

    /**
     * 更新dialog位置及内部元素styles
     * @private
     * @return void
     * */
    _updatePosition: function() {
        var me = this,
        	bodyOffset,
            top = '',
            right = '',
            bottom = '',
            left = '',
            content = me.getContent(),
            body = me.getBody(),
            width,height;

        /*
         * 添加默认值支持
         * 当me.width或者me.height没有设置有效值时，不对其进行计算
         *
         * 暂不支持百分比形式的寛高计算
         * 在render或者window resize时保证content上的寛高必有值
         * TODO resizable如何适应dialog有默认值时的计算方法
         * 
         * 在webkit中，为保持dom的完整性，浏览器会自己计算一下css值
         * 例如：
         * content的属性为: 
         *  width:100px
         *  marginLeft:5px
         *  marginRight:5px
         *
         * body的属性为：
         *  width:110px
         *
         * 此时更改content的width值为90px
         * 在webkit中，取content的marginLeft和marginRight值分别是5px，15px
         * 而不是原有的5px，5px
         *
         * 针对这个问题，调成程序执行顺序，先取得所有相关的css属性值
         * 之后更改content的寛高，再根据content当前的offset值与之前取得的属性值进行计算，获取body的寛高值
         */

        width = parseFloat(me.width);
        height = parseFloat(me.height);
        
        bodyOffset = me._getBodyOffset();
        
        baidu.lang.isNumber(width) && baidu.dom.setOuterWidth(content,width);
        baidu.lang.isNumber(height) && baidu.dom.setOuterHeight(content,height);

        bodyOffset.width += content.offsetWidth;
        bodyOffset.height += content.offsetHeight;

        me.width && baidu.setStyle(body, 'width', bodyOffset.width);
        me.height && baidu.setStyle(body, 'height', bodyOffset.height);

        if ((me.left && me.left != 'auto') || (me.right && me.right != 'auto')) {
            //按照用户的值来设置
            left = me.left || '';
            right = me.right || '';
        } else {
            //自动居中
            left = Math.max((baidu.page.getViewWidth() - parseFloat(me.getMain().offsetWidth)) / 2 + baidu.page.getScrollLeft(), 0);
        }
        //下面的代码是上面代码的重复
        if ((me.top && me.top != 'auto') || (me.bottom && me.bottom != 'auto')) {
            top = me.top || '';
            bottom = me.bottom || '';
        } else {
            top = Math.max((baidu.page.getViewHeight() - parseFloat(me.getMain().offsetHeight)) / 2 + baidu.page.getScrollTop(), 0);
        }

        baidu.dom.setStyles(me.getMain(), {
            top: top,
            right: right,
            bottom: bottom,
            left: left
        });
    },

    /**
     * 获得title对应的dom元素
     * @public
     * @return {HTMLElement} title
     */
    getTitle: function() {
        return baidu.g(this.getId('title'));
    },

    /**
     * 获得title文字对应的dom元素
     * @public
     * @return {HTMLElement} titleInner
     */
    getTitleInner: function() {
        return baidu.g(this.getId('title-inner'));
    },

    /**
     * 获得content对应的dom元素
     * @public
     * @return {HTMLElement} content
     */
    getContent: function() {
        return baidu.g(this.getId('content'));
    },

    /**
     * 获得footer对应的dom元素
     * @public
     * @return {HTMLElement} footer
     */
    getFooter: function() {
        return baidu.g(this.getId('footer'));
    },

    /**
     * 销毁dialog实例
	 * @public
     */
    dispose: function() {
        var me = this;

        //删除实例引用
        delete baidu.ui.Dialog.instances[me.guid];
        me.dispatchEvent('dispose');
        baidu.un(window, 'resize', me.windowResizeHandler);
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

baidu.ui.Dialog.instances = baidu.ui.Dialog.instances || {};

/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

/**
 * 定义名字空间
 */

 /**
 * 为各个控件增加装饰器。
 * @class Behavior类
 */
baidu.ui.behavior = baidu.ui.behavior || {};

/* BASE: baidu/dom/resizable.js */

/**
 * 为ui控件提供resize的行为
 */
(function() {
    var Resizable = baidu.ui.behavior.resizable = function() {};

    Resizable.resizeableHandle = null;
    
    /**
     * 更新reiszable设置
     * 创建resize handle
     * @param {Object} options
     * @see baidu.dom.resizable
     * @return baidu.dom.resizable
     */
    Resizable.resizeCreate = function(options) {
        var me = this, target;
        options = options || {};
        if (!me.resizable) {
            return;
        }

        baidu.object.extend(me, options);
        me._resizeOption = {
            onresizestart: function() {
                me.dispatchEvent('onresizestart');
            },
            onresize: function(styles) {
                me.dispatchEvent('onresize', styles);
            },
            onresizeend: function() {
                me.dispatchEvent('onresizeend');
            }
        };
        baidu.each(['minWidth', 'minHeight', 'maxWidth', 'maxHeight'], function(item,index) {
            me[item] && (me._resizeOption[item] = me[item]);
        });

        me._resizeOption.classPrefix = options.classPrefix || me.classPrefix;
        target = options.target || me.getBody();
        me.direction && (me._resizeOption.direction = me.direction);
        me.resizeableHandle = baidu.dom.resizable(target, me._resizeOption);
    };

    /**
     * 更新resizeable handle
     * @public
     * @param {Object} options
     * @return null
     */
    Resizable.resizeUpdate = function(options){
        this.resizeableHandle.update(options); 
    };

    /**
     * 取消resizeable功能
     * @public
     * @return null
     */
    Resizable.resizeCancel = function(){
        this.resizeableHandle.cancel();
    };

    /**
     * 激活resizeable
     * @public 
     * @return null
     */
    Resizable.resizeEnable = function(){
        this.resizeableHandle.enable();
    };
})();


/**
 * 为Dialog添加缩放功能
 * 可选参数
 * @param {Number} minWidth 最小宽度.
 * @param {Number} minHeight 最小高度.
 * @param {Boolean} resizable 是否启用resizable.
 * @direction {Array} direction 可已经resize的方向，默认为["s","e","se"]3方向
 */
baidu.extend(baidu.ui.Dialog.prototype, {
    resizable: true,
    minWidth: 100,
    minHeight: 100,
    direction: ['s', 'e', 'se']
});
baidu.ui.Dialog.register(function(me) {
    if (me.resizable) {
        var body,
            content,
            main,
            contentWidth, contentHeight,
            bodyWidth,bodyHeight;

        function getValue(){
            bodyWidth = body.offsetWidth;
            bodyHeight = body.offsetHeight;

            contentWidth = content.offsetWidth;
            contentHeight = content.offsetHeight;
        }

        /**
         * 注册onload事件
         * 创建resizeable handle
         */
        me.addEventListener('onload', function() {
            body = me.getBody();
            main = me.getMain();
            content = me.getContent();
            getValue();

            me.resizeCreate({target: main, classPrefix: me.classPrefix});
        });

        /**
         * 注册onresize事件
         * 当事件触发时设置content和body的OuterSize
         */
        me.addEventListener('onresize', function(styles) {
            baidu.dom.setOuterWidth(content, contentWidth + styles.current.width - styles.original.width);
            baidu.dom.setOuterHeight(content, contentHeight + styles.current.height - styles.original.height);
            
            baidu.dom.setOuterWidth(body, bodyWidth + styles.current.width - styles.original.width);
            baidu.dom.setOuterHeight(body, bodyHeight + styles.current.height - styles.original.height);
            
            me.coverable && me.Coverable_update();
        });

        /**
         * 注册onresizeend事件
         * 当事件触发时设置变量值
         */
        me.addEventListener('onresizeend', function() {
            getValue();
            me.width = contentWidth;
            me.height = contentHeight;

            baidu.setStyles(main,{height:"",width:""});
        });

        /**
         * 注册onupdate事件
         * 当事件触发时更新resizeHandle
         */
        me.addEventListener('onupdate',function() {
            getValue();
            me.resizeUpdate();
        });

        /**
         * 注册onopen事件
         * 当事件触发时更新resizeHandle
         */
        me.addEventListener('onopen',function() {
            getValue();
            me.resizeUpdate();
        });
    }
});


/* BASE: baidu/dom/draggable.js */
/* BASE: baidu/page/getWidth.js */
/* BASE: baidu/page/getHeight.js */



/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/behavior/draggable.js
 * author: berg
 * version: 1.0.0
 * date: 2010/09/16
 */




/* BASE: baidu/dom/drag.js */



/**
 * 为ui控件添加拖拽行为
 */
(function(){
    var Draggable = baidu.ui.behavior.draggable = function(){
        this.addEventListener("onload", function(){
            var me = this;
            me.dragUpdate();
        });
        this.addEventListener("ondispose", function(){
            var me  = this;
            baidu.un(me._dragOption.handler, "mousedown", me._dragFn);
            me._dragOption.handler = me.dragHandler = me._lastDragHandler = null;
        });
    };
    /**
     * 更新拖拽行为
     * @param {object} options 拖拽行为的选项，支持:
     * dragRange : 拖拽的范围
     * dragHandler : 拖拽手柄
     */
    Draggable.dragUpdate = function(options){
        var me = this;
        options = options || {};
        if(!me.draggable){
            return ;
        }
        //me.dragHandler != me._lastDragHandler,这个判断会造成当调用两次dragUpdate更新range时上次的事件没有被注销
        if(me._lastDragHandler && me._dragFn){
            baidu.event.un(me._lastDragHandler, "onmousedown", me._dragFn); //把上次的拖拽事件取消掉
        }
        baidu.object.extend(me, options);
        me._dragOption = {
            ondragstart : function(){
                me.dispatchEvent("ondragstart");
            },  
            ondrag : function(){
                me.dispatchEvent("ondrag");
            },
            ondragend : function(){
                me.dispatchEvent("ondragend");
            },
            autoStop : true
        };

        me._dragOption.range = me.dragRange || [];
        me._dragOption.handler = me._lastDragHandler = me.dragHandler || me.getMain();

        if (me._dragOption.handler) {
            baidu.event.on(me._dragOption.handler, "onmousedown", me._dragFn = function() {
                baidu.dom.drag(me.dragTarget || me.getMain(), me._dragOption);
            });
        }
    };
})();


/**
 * 为Dialog添加拖拽功能
 * @param {Boolean} draggable 是否启用draggable
 * */
baidu.ui.Dialog.prototype.draggable = true;

baidu.ui.Dialog.register(function(me){
    if(me.draggable){
        /**
         * 更新拖拽的范围，通过调用draggable行为中提供的dragUpdate实现
         * @private
         * @return void
         */
        function updateDragRange(){
            me.dragRange = [0,baidu.page.getWidth(),baidu.page.getHeight(),0];
            me.dragUpdate();
        };

        me.addEventListener("onload", function(){
            me.dragHandler = me.dragHandler || me.getTitle();

            //默认的拖拽范围是在窗口内
            if(!me.dragRange){
                updateDragRange();

                //如果用户窗口改变，拖拽的范围也要跟着变
                baidu.on(window, "resize", updateDragRange);
            }else{
                me.dragUpdate();
            }
        });

        me.addEventListener("ondragend", function(){
            me.left = baidu.dom.getStyle(me.getMain(), "left");
            me.top = baidu.dom.getStyle(me.getMain(), "top");
        });

        me.addEventListener("ondispose", function(){
            baidu.un(window, "resize", updateDragRange);
        });
    }
});

/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */




/* BASE: baidu/dom/insertBefore.js */
/* BASE: baidu/dom/setStyle.js */


/* BASE: baidu/dom/setBorderBoxSize.js */

(function(){
    var Coverable = baidu.ui.behavior.coverable = function() {};
    
    Coverable.Coverable_isShowing = false;
    Coverable.Coverable_iframe;
    Coverable.Coverable_container;
    Coverable.Coverable_iframeContainer;

    /**
     * 显示遮罩，当遮罩不存在时创建遮罩
     * @public
     * @return {NULL}
     */
    Coverable.Coverable_show = function(){
        var me = this;
        if(me.Coverable_iframe){
            me.Coverable_update();
            baidu.setStyle(me.Coverable_iframe, 'display', 'block'); 
            return;
        }
        
        var opt = me.coverableOptions || {},
            container = me.Coverable_container = opt.container || me.getMain(),
            opacity = opt.opacity || '0',
            color = opt.color || '',
            iframe = me.Coverable_iframe = document.createElement('iframe'),
            iframeContainer = me.Coverable_iframeContainer = document.createElement('div');

        //append iframe container
        baidu.dom.children(container).length > 0 ?
            baidu.dom.insertBefore(iframeContainer, container.firstChild):
            container.appendChild(iframeContainer);
       
        //setup iframeContainer styles
        baidu.setStyles(iframeContainer, {
            position: 'absolute',
            top: '0px',
            left: '0px'
        });
        baidu.dom.setBorderBoxSize(iframeContainer,{
            width: container.offsetWidth,
            height: container.offsetHeight
        });

        baidu.dom.setBorderBoxSize(iframe,{
            width: iframeContainer.offsetWidth
        });

        baidu.dom.setStyles(iframe,{
            zIndex  : -1,
            display  : "block",
            border: 0,
            backgroundColor: color,
            filter : 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=' + opacity + ')'
        });
        iframeContainer.appendChild(iframe);
        
        iframe.src = "javascript:void(0)";
        iframe.frameBorder = '0';
        iframe.scrolling = 'no';
        iframe.height = '97%';
        me.Coverable_isShowing = true;
    };

    /**
     * 隐藏遮罩
     * @public
     * @return {NULL}
     */
    Coverable.Coverable_hide = function(){
        var me = this,
            iframe = me.Coverable_iframe;
        
        if(!me.Coverable_isShowing){
            return;
        }
        
        baidu.setStyle(iframe, 'display', 'none');
        me.Coverable_isShowing = false;
    };

    /**
     * 更新遮罩
     * @public
     * @param {Object} options
     * @config {Number|String} opacity 透明度
     * @config {String} backgroundColor 背景色
     */
    Coverable.Coverable_update = function(options){
        var me = this,
            options = options || {},
            container = me.Coverable_container,
            iframeContainer = me.Coverable_iframeContainer,
            iframe = me.Coverable_iframe;
  
        baidu.dom.setBorderBoxSize(iframeContainer,{
            width: container.offsetWidth,
            height: container.offsetHeight
        });

        baidu.dom.setBorderBoxSize(iframe,baidu.extend({
            width: baidu.getStyle(iframeContainer, 'width')
        },options));
    };
})();

/* BASE: baidu/lang/Class/addEventListeners.js */

baidu.extend(baidu.ui.Dialog.prototype,{
    coverable: true,
    coverableOptions: {}
});

baidu.ui.Dialog.register(function(me){

    if(me.coverable){

        me.addEventListeners("onopen,onload", function(){
            me.Coverable_show();
        });

        me.addEventListener("onclose", function(){
            me.Coverable_hide();
        });

        me.addEventListener("onupdate",function(){
            me.Coverable_update();
        });
    }
});

//依赖包

/**
 * 设置UI控件的父控件
 *
 * @param {UI} 父控件
 */
baidu.ui.Base.setParent = function(parent){
    var me = this,
        oldParent = me._parent;
    oldParent && oldParent.dispatchEvent("removechild");
    if(parent.dispatchEvent("appendchild", { child : me })){
        me._parent = parent;

        /* 
         * childName名字没有确定，暂时先不加这段代码
         * //如果有childName，skin和classPrefix以父元素为准
         *if(me.childName){
         *    if(parent.skin){
         *        me.skin = parent.skin + '-' + me.childName;
         *    }
         *    if(parent.classPrefix){
         *        me.classPrefix = parent.classPrefix + '-' + me.childName;
         *    }
         *}
         */
    }
};

/**
 * 获取UI控件的父控件
 *
 * @return {UI} 父控件
 */
baidu.ui.Base.getParent = function(){
    return this._parent || null;
};




/* BASE: baidu/dom/removeClass.js */
/* BASE: baidu/dom/addClass.js */


//声明包
/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/behavior/statable.js
 * author: berg, lingyu
 * version: 1.0.0
 * date: 2010/09/04
 */



/* BASE: baidu/dom/hasClass.js */
/* BASE: baidu/event/getTarget.js */







/**
 * 为ui控件添加状态管理行为
 */
(function() {
    var Statable = baidu.ui.behavior.statable = function() {
        var me = this;

        me.addEventListeners('ondisable,onenable', function(event,options) {
            var element, group;
            options = options || {};
            elementId = (options.element || me.getMain()).id;
            group = options.group;

            if (event.type == 'ondisable' && !me.getState(elementId, group)['disabled']) {
        	    me.removeState('press', elementId, group);
        	    me.removeState('hover', elementId, group);
        	    me.setState('disabled', elementId, group);
            }else if (event.type == 'onenable' && me.getState(elementId, group)['disabled']) {
                me.removeState('disabled', elementId, group);
        	}
        });
    };

    //保存实例中所有的状态，格式：group+elementId : {stateA : 1, stateB : 1}
    Statable._states = {};
    //所有可用的状态，调用者通过addState添加
    Statable._allStates = ['hover', 'press', 'disabled'];
    Statable._allEventsName = ['mouseover', 'mouseout', 'mousedown', 'mouseup'];
    Statable._eventsHandler = {
        'mouseover' : function(id, group) {
            var me = this;
            if (!me.getState(id, group)['disabled']) {
                me.setState('hover', id, group);
                return true;
            }
        },
        'mouseout' : function(id, group) {
            var me = this;
            if (!me.getState(id, group)['disabled']) {
                me.removeState('hover', id, group);
                me.removeState('press', id, group);
                return true;
            }
        },
        'mousedown' : function(id, group) {
            var me = this;
            if (!me.getState(id, group)['disabled']) {
                me.setState('press', id, group);
                return true;
            }
        },
        'mouseup' : function(id, group) {
            var me = this;
            if (!me.getState(id, group)['disabled']) {
                me.removeState('press', id, group);
                return true;
            }
        }
    };

    /**
     * 获得状态管理方法的字符串，用于插入元素的HTML字符串的属性部分
     *
     * @param {string} group optional    状态分组，同一组的相同状态会被加上相同的css.
     * @param {string} key optional 索引，在同一类中的索引.
     *
     * @return {string} 元素属性字符串.
     */
    Statable._getStateHandlerString = function(group, key) {
        var me = this,
            i = 0,
            len = me._allEventsName.length,
            ret = [],
            eventType;
        if (typeof group == 'undefined') {
            group = key = '';
        }
        for (; i < len; i++) {
            eventType = me._allEventsName[i];
            ret[i] = 'on' + eventType + '=\"' + me.getCallRef() + "._fireEvent('" + eventType + "', '" + group + "', '" + key + "', event)\"";
        }

        return ret.join(' ');
    };

    /**
     * 触发指定类型的事件
     * @param {string} eventType  事件类型.
     * @param {string} group optional    状态分组，同一组的相同状态会被加上相同的css.
     * @param {string} key 索引，在同一类中的索引.
     * @param {DOMEvent} e DOM原始事件.
     */
    Statable._fireEvent = function(eventType, group, key, e) {
        var me = this,
        	id = me.getId(group + key);
        if (me._eventsHandler[eventType].call(me, id, group)) {
            me.dispatchEvent(eventType, {
                element: id,
                group: group,
                key: key,
                DOMEvent: e
            });
        }
    };

    /**
     * 添加一个可用的状态
     * @param {string} state 要添加的状态.
     * @param {string} eventNam optional DOM事件名称.
     * @param {string} eventHandler optional DOM事件处理函数.
     */
    Statable.addState = function(state, eventName, eventHandler) {
        var me = this;
        me._allStates.push(state);
        if (eventName) {
            me._allEventsName.push(eventName);
            if (!eventHandler) {
                eventHandler = function() {return true;};
            }
            me._eventsHandler[eventName] = eventHandler;
        }
    };

    /**
     * 获得指定索引的元素的状态
     * @param {string} elementId 元素id，默认是main元素id.
     * @param {string} group optional    状态分组，同一组的相同状态会被加上相同的css.
     */
    Statable.getState = function(elementId, group) {
        var me = this,
            _states;
        group = group ? group + '-' : '';
        elementId = elementId ? elementId : me.getId();
        _states = me._states[group + elementId];
        return _states ? _states : {};
    };

    /**
     * 设置指定索的元素的状态
     * @param {string} state 枚举量 in ui._allStates.
     * @param {string} elementId optional 元素id，默认是main元素id.
     * @param {string} group optional    状态分组，同一组的相同状态会被加上相同的css.
     */
    Statable.setState = function(state, elementId, group) {
        var me = this,
            stateId,
            currentState;

        group = group ? group + '-' : '';
        elementId = elementId ? elementId : me.getId();
        stateId = group + elementId;

        me._states[stateId] = me._states[stateId] || {};
        currentState = me._states[stateId][state];
        if (!currentState) {
            me._states[stateId][state] = 1;
            baidu.addClass(elementId, me.getClass(group + state));
        }
    };

    /**
     * 移除指定索引的元素的状态
     * @param {string} state 枚举量 in ui._allStates.
     * @param {string} element optional 元素id，默认是main元素id.
     * @param {string} group optional    状态分组，同一组的相同状态会被加上相同的css.
     */
    Statable.removeState = function(state, elementId, group) {
        var me = this,
            stateId;

        group = group ? group + '-' : '';
        elementId = elementId ? elementId : me.getId();
        stateId = group + elementId;

        if (me._states[stateId]) {
            me._states[stateId][state] = 0;
            baidu.removeClass(elementId, me.getClass(group + state));
        }
    };
})();


/**
 * button基类，创建一个button实例
 * @class button类
 * @param {Object} [options] 选项
 * @config {String}             content     按钮文本信息
 * @config {Boolean}            disabled    按钮是否有效，默认为false（有效）。
 * @config {Function}           onmouseover 鼠标悬停在按钮上时触发
 * @config {Function}           onmousedown 鼠标按下按钮时触发
 * @config {Function}           onmouseup   按钮弹起时触发
 * @config {Function}           onmouseout  鼠标移出按钮时触发
 * @config {Function}           onclick		鼠标点击按钮时触发
 * @config {Function}           onupdate	更新按钮时触发
 * @config {Function}           onload		页面加载时触发
 * @config {Function}           ondisable   当调用button的实例方法disable，使得按钮失效时触发。
 * @config {Function}           onenable    当调用button的实例方法enable，使得按钮有效时触发。
 * @returns {Button}                        Button类
 * @plugin statable             状态行为，为button组件添加事件和样式。
 * @remark  创建按钮控件时，会自动为控件加上四种状态的style class，分别为正常情况(tangram-button)、鼠标悬停在按钮上(tangram-button-hover)、鼠标按下按钮时(tangram-button-press)、按钮失效时(tangram-button-disable)，用户可自定义样式。
 */
baidu.ui.Button = baidu.ui.createUI(new Function).extend(
    /**
     *  @lends baidu.ui.Button.prototype
     */
    {
       
    //ui控件的类型，传入给UIBase **必须**
    uiType: 'button',
    //ui控件的class样式前缀 可选
    //classPrefix     : "tangram-button-",
    tplBody: '<div id="#{id}" #{statable} class="#{class}">#{content}</div>',
    disabled: false,
    statable: true,

    /**
     *  获得button的HTML字符串
     *  @private
     *  @return {String} 拼接的字符串
     */
    _getString: function() {
        var me = this;
        return baidu.format(me.tplBody, {
            id: me.getId(),
            statable: me._getStateHandlerString(),
            'class' : me.getClass(),
            content: me.content
        });
    },

    /**
     *  将button绘制到DOM树中。
     *  @public
     *  @param {HTMLElement|String} target  需要渲染到的元素
     */	
    render: function(target) {
        var me = this,
            body;
        me.addState('click', 'click');
        baidu.dom.insertHTML(me.renderMain(target), 'beforeEnd', me._getString());

        body = baidu.g(target).lastChild;
        if (me.title) {
            body.title = me.title;
        }

        me.disabled && me.setState('disabled');
        me.dispatchEvent('onload');
    },

    /**
     *  判断按钮是否处于失效状态。
     *  @public
     *  @return {Boolean} 是否失效的状态
     */
    isDisabled: function() {
        var me = this,
        	id = me.getId();
        return me.getState()['disabled'];
    },

    /**
     *  销毁实例。
     *  @public
     */
	dispose : function(){
		var me = this,
            body = me.getBody();
        me.dispatchEvent('dispose');
       //删除当前实例上的方法
        baidu.each(me._allEventsName, function(item,index) {
            body['on' + item] = null;
        });
        baidu.dom.remove(body);
		
        me.dispatchEvent('ondispose');
        baidu.lang.Class.prototype.dispose.call(me);
	},

    /**
     * 设置disabled属性
     * @pubic
     * 
	 */
    disable: function() {
        var me = this,
        body = me.getBody();
        me.dispatchEvent('ondisable', {element: body});
    },

    /**
     * 删除disabled属性
     * @pubic
     * 
	 */
    enable: function() {
        var me = this;
        body = me.getBody();
        me.dispatchEvent('onenable', {element: body});
    },

    /**
     * 触发button事件
     * @public
     * @param {String} eventName   要触发的事件名称
     * @param {Object} e           事件event
     */
    fire: function(eventType,e) {
        var me = this, eventType = eventType.toLowerCase();
        if (me.getState()['disabled']) {
            return;
        }
        me._fireEvent(eventType, null, null, e);
    },

    /**
     * 更新button的属性
	 * @public
     * @param {Object}              options     更新button的属性
	 * @config {String}             content     按钮文本信息
	 * @config {Boolean}            disabled    按钮是否有效，默认为false（有效）。
	 * @config {Function}           onmouseover 鼠标悬停在按钮上时触发
	 * @config {Function}           onmousedown 鼠标按下按钮时触发
	 * @config {Function}           onmouseup   按钮弹起时触发
	 * @config {Function}           onmouseout  鼠标移出按钮时触发
	 * @config {Function}           onclick		鼠标点击按钮时触发
	 * @config {Function}           onupdate	更新按钮时触发
	 * @config {Function}           onload		页面加载时触发
	 * @config {Function}           ondisable   当调用button的实例方法disable，使得按钮失效时触发。
	 * @config {Function}           onenable    当调用button的实例方法enable，使得按钮有效时触发。
     * 
     */
    update: function(options) {
        var me = this;
        baidu.extend(me, options);
        options.content && (me.getBody().innerHTML = options.content);

        me.dispatchEvent('onupdate');
    }
});

/* BASE: baidu/event/stopPropagation.js */

/**
 * addon
 * 关闭按钮
 */

baidu.extend(baidu.ui.Dialog.prototype,{
    closeText  : "",
    closeButton : true
});
baidu.ui.Dialog.register(function(me){
    
    me.closeButton && me.addEventListener("onload", function(){
        var buttonInstance = new baidu.ui.Button({
            parent : me,
            classPrefix : me.classPrefix + "-close",
            skin : me.skin ? me.skin + "-close" : "",
            onclick : function(){
                me.close();
            },
            onmousedown : function(e){
               baidu.event.stopPropagation(e.DOMEvent);
            },
            element:me.getTitle(),
            autoRender:true
        });
        me.closeButtonInstance = buttonInstance;

        me.addEventListener("ondispose",function(){
            buttonInstance.dispose();
        });
    });
});


/* BASE: baidu/dom/getAttr.js */

/* BASE: baidu/lang/guid.js */



/* BASE: baidu/array/indexOf.js */
/* BASE: baidu/array/removeAt.js */






/**
 * ItemSet是accordion, tab等多item操作的抽象
 * @param {Object} options config参数.
 * @config {String} switchType 事件激发类型，item由什么类型的事件来打开，取值如：click, mouseover等等
 * @config {Number} defaultIndex 初始化后的默认找开项索引，默认值是0
 * @author fx
 */
baidu.ui.ItemSet = baidu.ui.createUI(function(options){
    var me = this;
    me._headIds = [];
    me._bodyIds = [];
}).extend({
    currentClass: 'current',//展开项的css名称
    tplHead: '',
    tplBody: '',
    switchType: 'click',//事件名称，标记为当点击时激活事件
    defaultIndex: 0,//开始的默认打开项索引
    
    /**
     * 做为子类getString()使用,通过用户传来的item对象获得item head部分的html字符串
     * @private
     * @param {Object} item 格式为{head: '', body:''}
     * @param {Number} index 插件到数组中的索引，默认插入到数组最后
     * @return {String}
     */
    _getHeadString: function(item, index){
        var me = this,
            ids = me._headIds,
            headId = me.getId('head' + baidu.lang.guid()),
            index = ids[index] ? index : ids.length;
        ids.splice(index, 0, headId);
        return baidu.string.format(me.tplHead, {
            id: headId,
            'class': me.getClass('head'),
            head: item['head']
        });
    },
    
    /**
     * 做为子类getString()使用,通过用户传来的item对象获得item body部分的html字符串
     * @private
     * @param {Object} item 格式为{head: '', body:''}
     * @param {Number} index 插件到数组中的索引，默认插入到数组最后
     * @return {String}
     */
    _getBodyString: function(item, index){
        var me = this,
            ids = me._bodyIds,
            bodyId = me.getId('body' + baidu.lang.guid()),
            index = ids[index] ? index : ids.length;
        ids.splice(index, 0, bodyId);
        
        return baidu.string.format(me.tplBody, {
            id: bodyId,
            'class': me.getClass('body'),
            body: item['body'],
            display: 'none'
        });
    },
    
    /**
     * 外部事件绑定,做为中转方法，避免dom元素与事件循环引用。
     * @private
     * @param {HTMLElement} head 
     */
    _getSwitchHandler: function(head){
        var me = this;
        //分发一个beforeswitch, 在切换之前执行.
        if(me.dispatchEvent("onbeforeswitch",{element: head}) ){
            me.switchByHead(head);
            //分发一个onswitch, 在切换之后执行
            me.dispatchEvent("onswitch");
        }
    },
    
    /**
     * 内部方法注册head的onclick或者onmouseover事件，做为内部方法给render与addItem方法重用。
     * @private
     * @param {Object} head 一个head的dom
     */
    _addSwitchEvent: function(head){
        var me = this;
        head["on"  +  me.switchType] = baidu.fn.bind("_getSwitchHandler", me, head);
    },
    
    /**
     * 渲染item到target元素中
     * @param {HTMLElement|String} target 被渲染的容器对象
     */
    render: function(target){
        var me = this;
        baidu.dom.insertHTML(me.renderMain(target),  "beforeEnd",  me.getString());
        baidu.array.each(me._headIds, function(item, index){
            var head = baidu.dom.g(item);
            me._addSwitchEvent(head);
            if(index == me.defaultIndex){
                me.setCurrentHead(head);
                baidu.dom.addClass(head, me.getClass(me.currentClass));
                me.getBodyByHead(head).style.display = '';
            }
            head = null;
        });
        me.dispatchEvent("onload");
    },
    
    /**
     * 获得所有item head元素
     * @return {Array}
     */
    getHeads: function(){
        var me = this,
            list = [];
        baidu.array.each(me._headIds, function(item){
            list.push(baidu.dom.g(item));
        });
        return list;
    },
    
    /**
     * 获得所有item body元素
     * @return {Array}
     */
    getBodies: function(){
        var me = this,
            list = [];
        baidu.array.each(me._bodyIds, function(item){
            list.push(baidu.dom.g(item));
        });
        return list;
    },
    
    /**
     * 取得当前展开的head
     * @return {HTMLElement}
     */
    getCurrentHead: function(){
        return this.currentHead;
    },
    
    /**
     * 设置当前的head
     * @param {HTMLElement} head 一个head的dom
     */
    setCurrentHead: function(head){
        this.currentHead = head;
    },
    
    /**
     * 获得指定body对应的head
     * @param {HTMLElement} head 一个head的dom
     * @return {HTMLElement}
     */
    getBodyByHead: function(head){
        var me = this,
            index = baidu.array.indexOf(me._headIds, head.id);
        return baidu.dom.g(me._bodyIds[index]);
    },
    
    /**
     * 根据索引取得对应的body
     * @param {Number} index
     * @return {HTMLElement}
     */
    getBodyByIndex: function(index){
        return baidu.dom.g(this._bodyIds[index]);
    },
    
    /**
     * 在末尾添加一项
     * @param {Object} item 格式{head: '', body: ''}
     */
    addItem: function(item){
        var me = this,
            index = me._headIds.length;
        me.insertItemHTML(item);
    },
    
    /**
     * 根据索引删除一项
     * @param {Number} index 指定一个索引来删除对应的项
     */
    removeItem: function(index){
        var me = this,
            head = baidu.dom.g(me._headIds[index]),
            body = baidu.dom.g(me._bodyIds[index]),
            curr = me.getCurrentHead();
        curr && curr.id == head.id && me.setCurrentHead(null);
        baidu.dom.remove(head);
        baidu.dom.remove(body);
        baidu.array.removeAt(me._headIds, index);
        baidu.array.removeAt(me._bodyIds, index);
    },
    
    /**
     * 除去动画效果的直接切换项
     * @private
     * @param {HTMLElement} head 一个head的dom
     */
    _switch: function(head){
        var me = this,
            oldHead = me.getCurrentHead();
        if(oldHead){
            me.getBodyByHead(oldHead).style.display = "none";
            baidu.dom.removeClass(oldHead,  me.getClass(me.currentClass));
        }
        if(head){
            me.setCurrentHead(head);
            me.getBodyByHead(head).style.display = "block";
            baidu.dom.addClass(head,  me.getClass(me.currentClass));
        }
    },
    
    /**
     * 切换到由参数指定的项
     * @param {HTMLElement} head 一个head的dom
     */
    switchByHead: function(head){
        var me = this;
        if(me.dispatchEvent("beforeswitchbyhead", {element: head}) ){
            me._switch(head);
        }
    },
    
    /**
     * 根据索引切换到指定的项
     * @param {HTMLElement} head 一个head的dom
     */
    switchByIndex: function(index){
        this.switchByHead(this.getHeads()[index]);
    },
    
    /**
     * 销毁实例的析构
     */
    dispose: function(){
        this.dispatchEvent("ondispose");
    }
});


 /**
 * Tab标签组
 * @class
 * @param      {Object}                 [options]          选项
 * @config     {Function}               items              tab中的内容<pre> [{head : "label1",body : "<p>content1</p>"},{head : "label2",body : "<p>content2</p>"},{head : "label3",body : "<p>content3</p>"}]</pre>
 * @plugin      dom                让Tab类支持从已有dom渲染出tab。
 */
 
baidu.ui.Tab = baidu.ui.createUI( function (options) {
    var me = this;
    me.items = me.items || [];//初始化防止空
}, {superClass : baidu.ui.ItemSet}).extend( 
    /**
     *  @lends baidu.ui.Tab.prototype
     */
{
	//ui控件的类型 **必须**
    uiType             :  "tab", 
    tplDOM           :  "<div id='#{id}' class='#{class}'>#{heads}#{bodies}</div>", 
    tplHeads        :  "<ul id='#{id}' class='#{class}'>#{heads}</ul>", 
    tplBodies      :  "<div id='#{id}' class='#{class}'>#{bodies}</div>", 
    tplHead     :  "<li id='#{id}' bodyId='#{bodyId}' class='#{class}' ><a href='#' onclick='return false'>#{head}</a></li>", 
    tplBody   :  "<div id='#{id}' class='#{class}' style='display : #{display};'>#{body}</div>", 
	/**
	 * 获得tab的html string
	 * @private
	 * @return {HTMLString} string
	 */
	getString  :  function() {
        var me = this, 
            items = this.items, 
            bodies = [], 
            heads = [];
        baidu.each(items,  function(_item,  key) {
            bodies.push(me._getBodyString(_item, key));
            heads.push(me._getHeadString(_item, key));
        });
		return baidu.format(me.tplDOM,  {
            id       :  me.getId(), 
            "class"  :  me.getClass(), 
            heads   :  baidu.format(me.tplHeads,  {
                    id :  me.getId("head-container"), 
                    "class" :  me.getClass("head-container"), 
                    heads :  heads.join("")
                }), 
            bodies :  baidu.format(me.tplBodies,  {
                    id           :  me.getId("body-container"), 
                    "class"      :  me.getClass("body-container"), 
                    bodies       :  bodies.join("")
                }
            )
        });
	}, 
	/**
	 * 插入item html
	 * @param {Object} item     选项内容
	 * @param {int} index       选项的索引
	 */
	insertItemHTML : function(item, index) {
		var me = this,
            headIds = me._headIds,
            bodyIds = me._bodyIds,
            index = headIds[index] ? index : headIds.length,
            headContainer = baidu.dom.g(headIds[index] || me.getId('head-container')),
            bodyContainer = baidu.dom.g(bodyIds[index] || me.getId('body-container')),
            pos = headIds[index] ? 'beforeBegin' : 'beforeEnd';
        baidu.dom.insertHTML(headContainer, pos, me._getHeadString(item, index));
        baidu.dom.insertHTML(bodyContainer, pos, me._getBodyString(item, index));
        me._addSwitchEvent(baidu.dom.g(headIds[index]));
	},
    /**
	 * @private
	 * 
	 */
    insertContentHTML: function(item, index){
        var me = this;
        baidu.dom.insertHTML(me.getBodies()[index], 'beforeEnd', item);
    },
    
    /**
     * 销毁实例的析构
     */
    dispose: function(){
        var me = this;
        me.dispatchEvent('ondispose');
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});





baidu.tools.log.Dialog = function(options){
    var me = this,
        options = options || {};

    me.dialog = new baidu.ui.Dialog({
        width: '522',
        height: '250',
        titleText: 'tangram debug window',
        left:'380px',
        top:'130px'
    },options.dialogOptions || {});
    me.dialog.render();
    me.dialog.open();

    me.tab = new baidu.ui.Tab({
        items: [
            {head: 'all'},
            {head: 'log'},
            {head: 'info'},
            {head: 'warn'},
            {head: 'error'}
        ]
    });
    me.tab.render(me.dialog.getContent());
    me.tabIndex = {
        'all': 0,
        'log': 1,
        'info': 2,
        'warn': 3,
        'error': 4
    };
    
    //log tpl
    me.logTpl = {
        data: '<div>#{content}</div>',
        content: '<span>#{content}</span>',
        split: '<div style="height:1px; background-color:white;"></div>'
    };

    me.color = {
        log: 'black',
        info: 'yellow',
        warn: 'blue',
        error: 'red'
    };
};
baidu.tools.log.Dialog.prototype = {
   
    _verifyFunction:[
        [baidu.lang.isString,'String'],
        [baidu.lang.isNumber,'Number'],
        [baidu.lang.isDate,'Date'],
        [baidu.lang.isArray,'Array'],
        [baidu.lang.isObject,'Object']
    ],

    /**
     * 打开dialog
     * @public
     * @return {Null}
     */
    open: function(){
        this.dialog.open();        
    },
    
    /**
     * 关闭dialog
     * @public
     * @return {Null}
     */
    close: function(){
        this.dialog.close();
    },

    /**
     * 向dialog中pushlog日志
     * @public
     * @return {Null}
     */
    push:function(data){
        var me =  this,
            data = data || [],
            dataString = []
            tmpChild = [],

        baidu.each(data,function(d,i){
            dataString.push(me._getString(d));
            dataString.push(me.logTpl.split);
        });
        
        dataString = dataString.join('');
        me.tab.insertContentHTML(dataString,me.tabIndex['all']);
    },

    /**
     * 清空数据
     * @public
     * @return {Null}
     */
    clear: function(type){
        var me = this,
            type = type || "all";

        if(type == 'all'){
            baidu.object.each(me.tab.bodies,function(item,i){
                item.innerHTML = '';
            });
        }else{
            me.tab.insertContentHTML('',me.index[type]);
        }
    },

    _getString:function(data){
        var me = this,
            type= data.type,
            contentData = data.data,
            contentString = '';

        contentString = baidu.format(me.logTpl['data'],{
            content: baidu.format(me.logTpl['content'],{
                content: me._getContentString(contentData)
            })
        });

        me.tab.insertContentHTML(contentString,me.tabIndex[type]);
        me.tab.insertContentHTML(me.logTpl.split,me.tabIndex[type]);
        return contentString;
    },

    /**
     * 根据不同的数据列型生成不同的content字符串，并返回
     * @private
     * @param {Object} data content数据
     * @return {String} str
     * */
    _getContentString: function(data){
        var me = this,
            str = '';
        
        //判断数据类型
        //目前支持数据类型：
        //Array,Object,Boolean,Date,String,Number
        baidu.each(me._verifyFunction,function(fun,index){
            
            if(fun[0](data)){
                str = me['_echo' + fun[1]](data);
                return false;
            }
        }); 
        
        return str;
    },

    _echoArray: function(data){
        var me = this,
            resultStr = [];
                    
        baidu.each(data,function(item,index){
            resultStr.push(me._getContentString(item));
        });

        return '[' + resultStr.join(', ') + ']';
    },

    _echoObject: function(data){
        var me = this,
            resultStr = [];

        baidu.object.each(data,function(item,index){
            resultStr.push( index + '=' + me._getContentString(item));
        });

        return 'Object { ' + resultStr.join(', ') + ' }';          
    },

    _echoDate: function(data){
        return data.toString();       
    },

    _echoString: function(data){
        return '"' + data.toString() + '"';
    },

    _echoNumber: function(data){
        return data.toString(); 
    }
};


/**
 * @class 手风琴组件
 * @param {Object}     [options] 选项
 * @param {HTMLElment} [options.target] 渲染的容器元素
 */
baidu.ui.Accordion = baidu.ui.createUI(function (options){
    var me = this;
    me.items = me.items || [];//初始化防止空
},{superClass:baidu.ui.ItemSet}).extend(
    /**
     *  @lends baidu.ui.Accordion.prototype
     */
    {
    //ui控件的类型 **必须**
    uiType      : "accordion",
    //ui控件的class样式前缀 可选
    //classPrefix     : "tangram-accordion-",
    target      : document.body,
    tplDOM      : "<div id='#{id}' class='#{class}'>#{items}</div>",
    tplHead     : '<div id="#{id}" bodyId="#{bodyId}" class="#{class}" >#{head}</div>',
    tplBody     : "<div id='#{id}' class='#{class}' style='display:#{display};'>#{body}</div>",
    /**
     * 获得accordion的html string
     * @return {HTMLString}string
     */
    getString : function(){
        var me = this,
            items = this.items,
            itemsStrAry = [];
        baidu.each(items, function(item, key){  
            itemsStrAry.push(me._getHeadString(item) + me._getBodyString(item));
        });
        return baidu.format(this.tplDOM, {
            id      : me.getId(),
            "class" : me.getClass(),
            items   : itemsStrAry.join("")
        });
    },
    /**
     * 插入item html
     * @param {Object} item     插入项
     * @param {number} index    索引，默认插入在最后一项
     */
    insertItemHTML:function(item, index){
        var me = this;
            ids = me._headIds,
            index = ids[index] ? index : ids.length,
            container = baidu.dom.g(ids[index]) || me.getBody(),
            pos = ids[index] ? 'beforeBegin' : 'beforeEnd';
        baidu.dom.insertHTML(container, pos, me._getHeadString(item, index));
        baidu.dom.insertHTML(container, pos, me._getBodyString(item, index));
        me._addSwitchEvent(baidu.dom.g(ids[index]));
    },
    
    /**
     * 关闭当前打开的项
     */
    collapse: function(){
        var me = this;
        if(me.dispatchEvent('beforecollapse')){
            if(me.getCurrentHead()){
                me._switch(null);
                me.setCurrentHead(null);
            }
        }
    },
    
    /**
     * 销毁实例的析构
     */
    dispose: function(){
        var me = this;
        me.dispatchEvent('ondispose');
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
/**
 * 手风琴的动画效果
 */
baidu.ui.Accordion.register(function(me) {
//  me._fxElement = null;//用于存放当前正在进行动画的对象
    me.addEventListeners({
        beforeswitchbyhead: function(evt){
            var currHead = me.getCurrentHead(),
                currBody = currHead && me.getBodyByHead(currHead),
                switchBody = me.getBodyByHead(evt.element),
                rsid = currHead && currHead.id,
                opts,
                height;
            if(!baidu.fx.current(me._fxElement) && rsid != evt.element.id){
                me._fxElement = switchBody;
                baidu.fx.expand(switchBody, baidu.object.extend({
                    onafterfinish: function() {
                        me._switch(evt.element);
                        if(currBody){
                            currBody.style.height = switchBody.style.height;
                            currBody.style.overflow = 'auto';
                        }
                    }
                }, currBody ? {
                        onbeforestart: function() {
                            baidu.dom.removeClass(currHead, me.getClass(me.currentClass));
                            baidu.dom.addClass(evt.element, me.getClass(me.currentClass));
                            currBody.style.overflow = 'hidden';
                            currBody.style.height = parseInt(baidu.dom.getStyle(currBody, 'height')) - 1 + 'px';
                        },
                        onbeforeupdate: function() {
                            height = parseInt(baidu.dom.getStyle(switchBody, 'height'));//取得switchBody未改变的高度
                        },
                        onafterupdate: function() {
                            currBody.style.height = parseInt(baidu.dom.getStyle(currBody, 'height'))
                                - parseInt(baidu.dom.getStyle(switchBody, 'height'))
                                + height + 'px';
                        }
                } : {}));
            }
            evt.returnValue = false;
        },
        
        beforecollapse: function(evt){
            evt.returnValue = false;
            var currHead = me.getCurrentHead(),
                body = currHead && me.getBodyByHead(currHead);
            if(baidu.fx.current(me._fxElement) || !body){return}
            baidu.fx.collapse(body, {
                onafterfinish: function(){
                    me.setCurrentHead(null);
                }
            });
            
        }
    });
});




/* BASE: baidu/dom/contains.js */




/**
 * 使按钮支持capture，实现在按钮上点击并保持鼠标按着状态拖离鼠标，请在构造函数的options中定义capture参数为true来激活该状态
 * @name baidu.ui.button.Button$capture
 * @function
 * @grammar baidu.ui.button.create(options)
 * @param {Object} options 创建scrollBar的自定义参数.
 * @param {Boolean} options.capture 当为true时表示需要使按钮是一个capture的按钮.
 * @author linlingyu
 */
baidu.ui.Button.register(function(me) {
    if (!me.capture) {return;}
    me.addEventListener('load', function() {
        var body = me.getBody(),
            //onMouseOut = body.onmouseout,
            mouseUpHandler = baidu.fn.bind(function(evt) {
                var target = baidu.event.getTarget(evt);
                if (target != body
                        && !baidu.dom.contains(body, target)
                        && me.getState()['press']) {
                    me.fire('mouseout', evt);
                }
            }),
            mouseOutHandler = function(evt) {
                if (!me.getState()['press']) {
                    me.fire('mouseout', evt);
                }
            };
        body.onmouseout = null;
        baidu.event.on(body, 'mouseout', mouseOutHandler);
        baidu.event.on(document, 'mouseup', mouseUpHandler);
        me.addEventListener('dispose', function() {
            baidu.event.un(body, 'mouseout', mouseOutHandler);
            baidu.event.un(document, 'mouseup', mouseUpHandler);
        });
    });
});

/**
 * 使按钮支持poll轮询，实现在按钮上点击并保持鼠标按着状态时连续激活事件侦听器
 * @param   {Object}    options config参数.
 * @config  {Object}    poll 当为true时表示需要使按钮是一个poll的按钮，如果是一个json的描述，可以有两个可选参数：
 *                      {interval: 100, time: 4}，interval表示轮询的时间间隔，time表示第一次执行和第二执行之间的时间间隔是time*interval毫秒 
 * @author linlingyu
 */
baidu.ui.Button.register(function(me) {
    if (!me.poll) {return;}
    baidu.lang.isBoolean(me.poll) && (me.poll = {});
    me.addEventListener('mousedown', function(evt) {
        var pollIdent = 0,
            interval = me.poll.interval || 100,
            timer = me.poll.time || 0;
        (function() {
            if (me.getState()['press']) {
                pollIdent++ > timer && me.onmousedown && me.onmousedown();
                me.poll.timeOut = setTimeout(arguments.callee, interval);
            }
        })();
    });
    me.addEventListener('dispose', function(){
        if(me.poll.timeOut){
            me.disable();
            window.clearTimeout(me.poll.timeOut);
        }
    });
});

/* BASE: baidu/date/format.js */



/* BASE: baidu/array/some.js */











/**
 * 创建一个简单的日历对象
 * @name baidu.ui.Calendar
 * @class
 * @param {Object} options config参数
 * @config {String} weekStart 定义周的第一天，取值:'Mon'|'Tue'|'Web'|'Thu'|'Fri'|'Sat'|'Sun'，默认值'Sun'
 * @config {Date} initDate 以某个本地日期打开日历，默认值是当前日期
 * @config {Array} highlightDates 设定需要高亮显示的某几个日期或日期区间，格式:[date, {start:date, end:date}, date, date...]
 * @config {Array} disableDates 设定不可使用的某几个日期或日期区间，格式:[date, {start:date, end:date}, date, date...]
 * @config {Object} flipContent 设置翻转月份按钮的内容，格式{prev: '', next: ''}
 * @config {string} language 日历显示的语言，默认为中文 
 * @config {function} onclickdate 当点击某个日期的某天时触发该事件
 * @author linlingyu
 */
baidu.ui.Calendar = baidu.ui.createUI(function(options){
    var me = this;
    me.flipContent = baidu.object.extend({prev: '&lt;', next: '&gt;'},
        me.flipContent);
    me.addEventListener('mouseup', function(evt){
        var ele = evt.element,
            date = me._dates[ele],
            beforeElement = baidu.dom.g(me._currElementId);
        //移除之前的样子
        beforeElement && baidu.dom.removeClass(beforeElement, me.getClass('date-current'));
        me._currElementId = ele;
        me._initDate = date;
        //添加现在的样式
        baidu.dom.addClass(baidu.dom.g(ele), me.getClass('date-current'));
        me.dispatchEvent('clickdate', {date: date});
    });
}).extend(
/**
 *  @lends baidu.ui.Calendar.prototype
 */
{
    uiType: 'calendar',
    weekStart: 'Sun',//定义周的第一天
    statable: true,
    language: 'zh-CN',
    
    tplDOM: '<div id="#{id}" class="#{class}">#{content}</div>',
    tplTable: '<table border="0" cellpadding="0" cellspacing="1" class="#{class}"><thead class="#{headClass}">#{head}</thead><tbody class="#{bodyClass}">#{body}</tbody></table>',
    tplDateCell: '<td id="#{id}" class="#{class}" #{handler}>#{content}</td>',
    tplTitle: '<div id="#{id}" class="#{class}"><div id="#{labelId}" class="#{labelClass}">#{text}</div><div id="#{prevId}" class="#{prevClass}"></div><div id="#{nextId}" class="#{nextClass}"></div></div>',
    
    /**
     * 对initDate, highlight, disableDates, weekStart等参数进行初始化为本地时间
     * @private
     */
    _initialize: function(){
        var me = this;
        function initDate(array){
            var arr = [];
            //格式:[date, {start:date, end:date}, date, date...]
            baidu.array.each(array, function(item){
                arr.push(baidu.lang.isDate(item) ? me._toLocalDate(item)
                    : {start: me._toLocalDate(item.start), end: me._toLocalDate(item.end)});
            });
            return arr;
        }
        me._highlightDates = initDate(me.highlightDates || []);
        me._disableDates = initDate(me.disableDates || []);
        me._initDate = me._toLocalDate(me.initDate || new Date());//这个就是css中的current
        me._currDate = new Date(me._initDate.getTime());//这个是用于随时跳转的决定页面显示什么日历的重要date
        me.weekStart = me.weekStart.toLowerCase();
    },
    
    /**
     * 根据参数取得单个日子的json
     * @param {Date} date 一个日期对象
     * @return 返回格式{id:'', 'class': '', handler:'', date: '', disable:''}
     * @private
     */
    _getDateJson: function(date){
        var me = this,
            guid = baidu.lang.guid(),
            curr = me._currDate,
            css = [],
            disabled;
        function compare(srcDate, compDate){//比较是否同一天
            //不能用毫秒数除以一天毫秒数来比较(2011/1/1 0:0:0 2011/1/1 23:59:59)
            //不能用compDate - srcDate和一天的毫秒数来比较(2011/1/1 12:0:0 2011/1/2/ 0:0:0)
            return srcDate.getDate() == compDate.getDate()
                && Math.abs(srcDate.getTime() - compDate.getTime()) < 24 * 60 * 60 * 1000;
        }
        function contains(array, date){
            var time = date.getTime();
            return baidu.array.some(array, function(item){
                if(baidu.lang.isDate(item)){
                    return compare(item, date);
                }else{
                    return compare(item.start, date)
                        || time > item.start.getTime()
                        && time <= item.end.getTime();
                }
            });
        }
        //设置非本月的日期的css
        date.getMonth() != curr.getMonth() && css.push(me.getClass('date-other'));
        //设置highlight的css
        contains(me._highlightDates, date) && css.push(me.getClass('date-highlight'));
        //设置初始化日期的css
        if(compare(me._initDate, date)){
            css.push(me.getClass('date-current'));
            me._currElementId = me.getId(guid);
        }
        //设置当天的css
        compare(me._toLocalDate(new Date()), date) && css.push(me.getClass('date-today'));
        //设置disabled disabled优先级最高，出现disable将清除上面所有的css运算
        disabled = contains(me._disableDates, date) && (css = []);
        return {
            id: me.getId(guid),
            'class': css.join('\x20'),//\x20－space
            handler: me._getStateHandlerString('', guid),
            date: date,
            disabled: disabled
        };
    },
    
    /**
     * 取得参数日期对象所对月份的天数
     * @param {Number} year 年份
     * @param {Number} month 月份
     * @private
     */
    _getMonthCount: function(year, month){
        var invoke = baidu.i18n.date.getDaysInMonth,
            monthArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            count;
        invoke && (count = invoke(year, month));
        if(!baidu.lang.isNumber(count)){
            count = 1 == month && (year % 4)
                && (year % 100 != 0 || year % 400 == 0) ? 29 : monthArr[month];
        }
        return count;
    },
    
    /**
     * 生成日期表格的字符串用于渲染日期表
     * @private
     */
    _getDateTableString: function(){
        var me = this,
            calendar = baidu.i18n.cultures[me.language].calendar,
            dayArr = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],//day index
//            curr = me._currLocalDate,//_currentLocalDate
            curr = me._currDate,
            year = curr.getFullYear(),
            month = curr.getMonth(),
            day = new Date(year, month, 1).getDay(),//取得当前第一天用来计算第一天是星期几，这里不需要转化为本地时间
            weekIndex = 0,//记录wekStart在day数组中的索引
            headArr = [],
            bodyArr = [],
            weekArray = [],
            disabledIds = me._disabledIds = [],
            i = 0,
            j = 0,
            len = dayArr.length,
            count,
            date;
        
        //运算星期标题
        for(; i < len; i++){
            dayArr[i] == me.weekStart && (weekIndex = i);
            (weekIndex > 0 ? headArr : weekArray).push('<td>', calendar.dayNames[dayArr[i]], '</td>');
        }
        headArr = headArr.concat(weekArray);
        headArr.unshift('<tr>');
        headArr.push('</tr>');
        //运算日期
        day = (day < weekIndex ? day + 7 : day) - weekIndex;//当月月初的填补天数
        count = Math.ceil((me._getMonthCount(year, month) + day) / len);
        me._dates = {};//用来存入td对象和date的对应关系在click时通过id取出date对象
        for(i = 0; i < count; i++){
            bodyArr.push('<tr>');
            for(j = 0; j < len; j++){
                date = me._getDateJson(new Date(year, month, i * len + j + 1 - day));//这里也不需要转化为本地时间
                //把被列为disable的日期先存到me._disabledIds中是为了在渲染后调用setState来管理
                me._dates[date.id] = date.date;
                date.disabled && disabledIds.push(date['id']);
                bodyArr.push(baidu.string.format(me.tplDateCell, {
                    id: date['id'],
                    'class': date['class'],
                    handler: date['handler'],
                    content: date['date'].getDate()
                }));
            }
            bodyArr.push('</tr>');
        }
        return baidu.string.format(me.tplTable, {
            'class': me.getClass('table'),
            headClass: me.getClass('week'),
            bodyClass: me.getClass('date'),
            head: headArr.join(''),
            body: bodyArr.join('')
        });
    },
    
    /**
     * 生成日期容器的字符串
     * @private
     */
    getString: function(){
        var me = this;
        return baidu.string.format(me.tplDOM, {
            id: me.getId(),
            'class': me.getClass(),
            content: baidu.string.format(me.tplDOM, {
                id: me.getId('content'),
                'class': me.getClass('content')
            })
        });
    },
    
    /**
     * 将一个非本地化的日期转化为本地化的日期对象
     * @param {Date} date 一个非本地化的日期对象
     * @private
     */
    _toLocalDate: function(date){//很多地方都需要使用到转化，为避免总是需要写一长串i18n特地做成方法吧
        return date ? baidu.i18n.date.toLocaleDate(date, null, this.language)
            : date;
    },
    
    /**
     * 渲染日期表到容器中
     * @private
     */
    _renderDate: function(){
        var me = this;
        baidu.dom.g(me.getId('content')).innerHTML = me._getDateTableString();
        //渲染后对disabled的日期进行setState管理
        baidu.array.each(me._disabledIds, function(item){
            me.setState('disabled', item);
        });
    },
    
    /**
     * 左右翻页跳转月份的基础函数
     * @param {String} pos 方向 prev || next
     * @private
     */
    _basicFlipMonth: function(pos){
        var me = this,
            curr = me._currDate,
            month = curr.getMonth() + (pos == 'prev' ? -1 : 1),
            year = curr.getFullYear() + (month < 0 ? -1 : (month > 11 ? 1 : 0));
        month = month < 0 ? 12 : (month > 11 ? 0 : month);
        curr.setYear(year);
        me.gotoMonth(month);
        me.dispatchEvent(pos + 'month', {date: new Date(curr.getTime())});
    },
    
    /**
     * 渲染日历表的标题说明，如果对标题说明有特列要求，可以覆盖方法来实现
     */
    renderTitle: function(){
        var me = this, prev, next,
            curr = me._currDate,
            calendar = baidu.i18n.cultures[me.language].calendar,
            ele = baidu.dom.g(me.getId('label')),
            txt = baidu.string.format(calendar.titleNames, {
                yyyy: curr.getFullYear(),
                MM: calendar.monthNames[curr.getMonth()],
                dd: curr.getDate()
            });
        if(ele){
            ele.innerHTML = txt;
            return;
        }
        baidu.dom.insertHTML(me.getBody(),
            'afterBegin',
            baidu.string.format(me.tplTitle, {
                id: me.getId('title'),
                'class': me.getClass('title'),
                labelId: me.getId('label'),
                labelClass: me.getClass('label'),
                text: txt,
                prevId: me.getId('prev'),
                prevClass: me.getClass('prev'),
                nextId: me.getId('next'),
                nextClass: me.getClass('next')
            })
        );
        function getOptions(pos){
            return {
                classPrefix: me.classPrefix + '-' + pos + 'btn',
                skin: me.skin ? me.skin + '-' + pos : '',
                content: me.flipContent[pos],
                poll: {time: 4},
                element: me.getId(pos),
                autoRender: true,
                onmousedown: function(){
                    me._basicFlipMonth(pos);
                }
            };
        }
        prev = new baidu.ui.Button(getOptions('prev'));
        next = new baidu.ui.Button(getOptions('next'));
        me.addEventListener('ondispose', function(){
            prev.dispose();
            next.dispose();
        });
    },
    
    /**
     * 渲染日期组件到参数指定的容器中
     * @param {HTMLElement} target 一个用来存放组件的容器对象
     */
    render: function(target){
        var me = this,
            skin = me.skin;
        if(!target || me.getMain()){return;}
        baidu.dom.insertHTML(me.renderMain(target), 'beforeEnd', me.getString());
        me._initialize();
        me.renderTitle();
        me._renderDate();
        baidu.dom.g(me.getId('content')).style.height = 
            (me.getBody().clientHeight || me.getBody().offsetHeight)
            - baidu.dom.g(me.getId('title')).offsetHeight + 'px';
        me.dispatchEvent('onload');
    },
    
    /**
     * 更新日期的参数
     * @param {Object} options 参数，具体请参照构造中的options
     */
    update: function(options){
        var me = this;
        baidu.object.extend(me, options || {});
        me._initialize();
        me.renderTitle();
        me._renderDate();
        me.dispatchEvent('onupdate');
    },
    
    /**
     * 跳转到某一天
     * @param {Date} date 一个非本地化的日期对象
     */
    gotoDate: function(date){
        var me = this;
        me._currDate = me._toLocalDate(date);
        me._initDate = me._toLocalDate(date);
        me.renderTitle();
        me._renderDate();
        me.dispatchEvent('ongotodate');
    },
    
    /**
     * 跳转到某一年
     * @param {Number} year 年份
     */
    gotoYear: function(year){
        var me = this,
            curr = me._currDate,
            month = curr.getMonth(),
            date = curr.getDate(),
            count;
        if(1 == month){//如果是二月份
            count = me._getMonthCount(year, month);
            date > count && curr.setDate(count);
        }
        curr.setFullYear(year);
        me.renderTitle();
        me._renderDate();
        me.dispatchEvent('ongotoyear');
    },
    
    /**
     * 跳转到当前年份的某个月份
     * @param {Number} month 月份，取值(0, 11)
     */
    gotoMonth: function(month){
        var me = this,
            curr = me._currDate,
            month = Math.min(Math.max(month, 0), 11),
            date = curr.getDate(),
            count = me._getMonthCount(curr.getFullYear(), month);
        date > count && curr.setDate(count);
        curr.setMonth(month);
        me.renderTitle();
        me._renderDate();
        me.dispatchEvent('ongotomonth');
    },
    
    /**
     * 取得一个本地化的当天的日期
     * @return {Date} 返回一个本地当天的时间
     */
    getToday: function(){
        return me._toLocalDate(new Date());
    },
    
    /**
     * 返回一个当前选中的当地日期对象
     * @return {Date} 返回一个本地日期对象
     */
    getDate: function(){
        return new Date(this._initDate.getTime());
    },
    
    /**
     * 用一个本地化的日期设置当前的显示日期
     * @param {Date} date 一个当地的日期对象
     */
    setDate: function(date){
        if(baidu.lang.isDate(date)){
            var me = this;
            me._initDate = date;
            me._currDate = date;
        }
    },
    
    /**
     * 翻页到上一个月份，当在年初时会翻到上一年的最后一个月份
     */
    prevMonth: function(){
        this._basicFlipMonth('prev');
    },
    
    /**
     * 翻页到下一个月份，当在年末时会翻到下一年的第一个月份
     */
    nextMonth: function(){
        this._basicFlipMonth('next');
    },
        
    /**
     * 析构函数
     */
    dispose: function(){
        var me = this;
        me.dispatchEvent('dispose');
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

/* BASE: baidu/array/find.js */




/* BASE: baidu/dom/create.js */









/**
 * 创建一个简单的滚动组件
 * @name baidu.ui.Carousel
 * @class
 * @param {Object} options config参数.
 * @config {String} orientation 描述该组件是创建一个横向滚动组件或是竖向滚动组件，取值：horizontal:横向, vertical:竖向
 * @config {Object} contentText 定义carousel组件每一项的字符数据，格式：[{content: 'text-0'}, {content: 'text-1'}, {content: 'text-2'}...]
 * @config {String} flip 定义组件的翻页方式，取值：item:一次滚动一个项, page:一次滚动一页
 * @config {Number} pageSize 描述一页显示多少个滚动项，默认值是3
 * @config {function} onload 当渲染完组件时触发该事件
 * @config {function} onbeforescroll 当开始滚动时触发该事件，该事件的event参数中可以得到四个属性：index:当前需要滚动的索引, scrollOffset:滚动到可视区域的位置, direction:滚动方向, scrollUnit:需要滚动过多少个项
 * @config {function} onafterscroll 当结束一次滚动时触发该事件，该事件的event参数中可以得到四个属性：index:当前需要滚动的索引, scrollOffset:滚动到可视区域的位置, direction:滚动方向, scrollUnit:需要滚动过多少个项
 * @config {function} onprev 当翻到前一项或前一页时触发该事件
 * @config {function} onnext 当翻到下一项或下一页时触发该事件
 * @config {function} onitemclick 当点击某个项时触发该事件
 * @author linlingyu
 */



baidu.ui.Carousel = baidu.ui.createUI(function(options) {
    var me = this,
        data = me.contentText || [];
    me._dataList = data.slice(0, data.length);
    me._itemIds = [];
    me._items = {};//用来存入被删除的节点，当再次被使用时可以直接拿回来,格式:{element: dom, handler: []}
    me.flip = me.flip.toLowerCase();
    me.orientation = me.orientation.toLowerCase();
}).extend(
    /**
     *  @lends baidu.ui.Carousel.prototype
     */
{
    uiType: 'carousel',
    orientation: 'horizontal',//horizontal|vertical
    //direction: 'down',//up|right|down|left
    flip: 'item',//item|page
    pageSize: 3,
    scrollIndex: 0,
    _axis: {
        horizontal: {vector: '_boundX', pos: 'left', size: 'width', offset: 'offsetWidth', client: 'clientWidth', scrollPos: 'scrollLeft'},
        vertical: {vector: '_boundY', pos: 'top', size: 'height', offset: 'offsetHeight', client: 'clientHeight', scrollPos: 'scrollTop'}
    },
    /**
     * 生成一个容器的字符串
     * @return {String}
     * @private
     */
    getString: function() {
        var me = this,
            tpl = '<div id="#{id}" class="#{class}">#{content}</div>',
            str = baidu.string.format(tpl, {
                id: me.getId('scroll'),
                'class': me.getClass('scroll')
            });
        return baidu.string.format(tpl, {
            id: me.getId(),
            'class': me.getClass(),
            content: str
        });
    },
    /**
     * 渲染滚动组件到参数指定的容器中
     * @param {HTMLElement} target 一个用来存放组件的容器对象.
     */
    render: function(target) {
        var me = this;
        if (!target || me.getMain()) {return;}
        //先把已经存在的dataList生成出来guid
        baidu.array.each(me._dataList, function(item) {
	        me._itemIds.push(baidu.lang.guid());
	    });
        baidu.dom.insertHTML(me.renderMain(target), 'beforeEnd', me.getString());
        me._renderItems();
        me._resizeView();
        me._moveToMiddle();
        me.focus(me.scrollIndex);
        me.addEventListener('onbeforeendscroll', function(evt) {
            var orie = me.orientation == 'horizontal',
                axis = me._axis[me.orientation],
                sContainer = me.getScrollContainer();
            me._renderItems(evt.index, evt.scrollOffset);
            sContainer.style[axis.size] = parseInt(sContainer.style[axis.size])
                - me['_bound' + (orie ? 'X' : 'Y')].offset
                * evt.scrollUnit + 'px';
            me._moveToMiddle();
            me._scrolling = false;
        });
        me.dispatchEvent('onload');
    },
    /**
     * 从缓存中取出滚动项按照参数的格式在页面上排列出滚动项
     * @param {Number} index 索引值.
     * @param {Number} offset 指定索引项放在页面的位置.
     * @private
     */
    _renderItems: function(index, offset) {
        var me = this,
            sContainer = me.getScrollContainer(),
            index = Math.min(Math.max(index | 0, 0), me._dataList.length - 1),
            offset = Math.min(Math.max(offset | 0, 0), me.pageSize - 1),
            count = me.pageSize,
            i = 0,
            entry;
        while (sContainer.firstChild) {//这里改用innerHTML赋空值会使js存的dom也被清空
            baidu.dom.remove(sContainer.firstChild);
        }
        for (; i < count; i++) {
            entry = me._getItemElement(index - offset + i)
            sContainer.appendChild(entry.element);
            entry.setContent();
        }
    },
    /**
     * 将滚动容器排列到中间位置
     * @private
     */
    _moveToMiddle: function() {
        if (!this._boundX) {return;}
        var me = this,
            axis = me._axis[me.orientation];
        me.getBody()[axis.scrollPos] = me.orientation == 'horizontal'
            && baidu.browser.ie == 6 ? me._boundX.marginX : 0;
    },
    /**
     * 运算可视区域的宽高(包括对margin的运算)，并运算出一个滚动单位的offsetWidth和offsetHeight
     * @private
     */
    _resizeView: function() {
        if (this._dataList.length <= 0) {return;}//没有数据
        var me = this,
            axis = me._axis[me.orientation],
            orie = me.orientation == 'horizontal',
            sContainer = me.getScrollContainer(),
            child = baidu.dom.children(sContainer),
            boundX,
            boundY;
        function getItemBound(item, type) {
            var type = type == 'x',
                bound = item[type ? 'offsetWidth' : 'offsetHeight'],
                marginX = parseInt(baidu.dom.getStyle(item, type ? 'marginLeft' : 'marginTop')),
                marginY = parseInt(baidu.dom.getStyle(item, type ? 'marginRight' : 'marginBottom'));
            isNaN(marginX) && (marginX = 0);
            isNaN(marginY) && (marginY = 0);
            return {
//                size: bound,
                offset: bound + (orie ? marginX + marginY : Math.max(marginX, marginY)),
                marginX: marginX,
                marginY: marginY
            };
        }
        me._boundX = boundX = getItemBound(child[0], 'x');//设置滚动单位
        me._boundY = boundY = getItemBound(child[0], 'y');//设置滚动单位
        sContainer.style.width = boundX.offset
            * (orie ? child.length : 1)
            + (baidu.browser.ie == 6 ? boundX.marginX : 0)
            + 'px';
        sContainer.style.height = boundY.offset
            * (orie ? 1 : child.length)
            + (orie ? 0 : boundY.marginX)
            + 'px';
        me.getBody().style[axis.size] = me[axis.vector].offset * me.pageSize
            + (orie ? 0 : Math.min(me[axis.vector].marginX, me[axis.vector].marginY)) + 'px';
    },
    
    /**
     * 根据索引的从缓存中取出对应的滚动项，如果缓存不存在该项则创建并存入缓存，空滚动项不被存入缓存
     * @param {Number} index 索引值.
     * @return {HTMLElement}
     * @private
     */
    _baseItemElement: function(index) {
        var me = this,
            itemId = me._itemIds[index],
            entry = me._items[itemId] || {},
            txt = me._dataList[index],
            element;
        if (!entry.element) {
            entry.element = element = baidu.dom.create('div', {
                id: itemId || '',
                'class': me.getClass('item')
            });
            !itemId && baidu.dom.addClass(element, me.getClass('item-empty'));
            entry.content = txt ? txt.content : '';
            if (itemId) {
                entry.handler = [
                    {evtName: 'click', handler: baidu.fn.bind('_onItemClickHandler', me, element)},
                    {evtName: 'mouseover', handler: baidu.fn.bind('_onMouseHandler', me, 'mouseover')},
                    {evtName: 'mouseout', handler: baidu.fn.bind('_onMouseHandler', me, 'mouseout')}
                ];
                baidu.array.each(entry.handler, function(item) {
                    baidu.event.on(element, item.evtName, item.handler);
                });
                me._items[itemId] = entry;
            }
            entry.setContent = function(){
                this.content && (this.element.innerHTML = this.content);
                this.content && (delete this.content);
            }
        }
        return entry;
    },
    
    /**
     * 对_baseItemElement的再包装，在循环滚动中可以被重写
     * @param {Number} index 索引值.
     * @return {HTMLElement}
     */
    _getItemElement: function(index) {
        return this._baseItemElement(index);
    },
    /**
     * 处理点击滚动项的事件触发
     * @param {HTMLElement} ele 该滚动项的容器对象.
     * @param {Event} evt 触发事件的对象.
     * @private
     */
    _onItemClickHandler: function(ele, evt) {
        var me = this;
        me.focus(baidu.array.indexOf(me._itemIds, ele.id));
        me.dispatchEvent('onitemclick');
    },
    /**
     * 处理鼠标在滚动项上划过的事件触发
     * @param {String} type mouseover或是omouseout.
     * @param {Event} evt 触发事件的对象.
     * @private
     */
    _onMouseHandler: function(type, evt) {
        this.dispatchEvent('on' + type);
    },
    /**
     * 取得当前得到焦点项在所有数据项中的索引值
     * @return {Number} 索引值.
     */
    getCurrentIndex: function() {
        return this.scrollIndex;
    },
    /**
     * 取得数据项的总数目
     * @return {Number} 总数.
     */
    getTotalCount: function() {
        return this._dataList.length;
    },
    /**
     * 根据数据的索引值取得对应在页面的DOM节点，当节点不存时返回null
     * @param {Number} index 在数据中的索引值.
     * @return {HTMLElement} 返回一个DOM节点.
     */
    getItem: function(index) {
        return baidu.dom.g(this._itemIds[index]);
    },
    /**
     * 从当前项滚动到index指定的项，并将该项放在scrollOffset的位置
     * @param {Number} index 在滚动数据中的索引.
     * @param {Number} scrollOffset 在页面的显示位置，该参数如果不填默认值取0.
     * @param {String} direction 滚动方向，取值: prev:强制滚动到上一步, next:强制滚动到下一步，当不给出该值时，会自动运算一个方向来滚动.
     */
    scrollTo: function(index, scrollOffset, direction) {
        var me = this,
            axis = me._axis[me.orientation],
            scrollOffset = Math.min(Math.max(scrollOffset | 0, 0), me.pageSize - 1),
            sContainer = me.getScrollContainer(),
            child = baidu.dom.children(sContainer),
            item = me.getItem(index),
            smartDirection = direction,
            distance = baidu.array.indexOf(child, item) - scrollOffset,
            count = Math.abs(distance),
            len = me._dataList.length,
            i = 0,
            fragment,
            vergeIndex,
            vector,
            entry;
        //当移动距离是0，没有数据，index不合法，或是正处理滚动中。以上条件都退出
        if((item && distance == 0)
            || me._dataList.length <= 0 || index < 0
            || index > me._dataList.length - 1
            || me._scrolling) {return;}
        if (!smartDirection) {//如果方法参数没有给出合理的方向，需要自动运算合理的方向
            //如果index所对项已经存在于页，则以需要移动的距离来判断方法
            //如果不存在于页面，表示是远端运动，以可视区左边第一个有id的项来和index比较大小得出方向
            smartDirection = item ? (distance < 0 ? 'prev' : (distance > 0 ? 'next' : 'keep'))
                : baidu.array.indexOf(me._itemIds,
                    baidu.array.find(child, function(ele) {return !!ele.id}).id)
                    > index ? 'prev' : 'next';
        }
        vector = smartDirection == 'prev';
        if (!item) {//如果是一个远端移动
            //算出可视区中最接近index的一个项的索引，即边界索引
            vergeIndex = baidu.array.indexOf(me._itemIds,
                child[vector ? 0 : child.length - 1].id);
            //(x + len - y) % len
            //Math(offset - (is ? 0 : pz - 1)) + count
            //以上两个公式结合以后可以运算出当前边界项之后需要动态添加多少项而可以不管他的方向性
            count = Math.abs(scrollOffset - (vector ? 0 : me.pageSize - 1))
                + ((vector ? vergeIndex : index) + len - (vector ? index : vergeIndex)) % len;
            count > me.pageSize && (count = me.pageSize);
        }
        fragment = count > 0 && document.createDocumentFragment();
        //利用循环先把要移动的项生成并插入到相应的位置
        for (; i < count; i++) {
            entry = me._getItemElement(vector ? index - scrollOffset + i
                : me.pageSize + index + i - (item && !direction ? baidu.array.indexOf(child, item)
                    : scrollOffset + count));
            fragment.appendChild(entry.element);
            entry.setContent();//为了防止内存泄露在这里渲染内容，该方法只会渲染一次
        }
        vector ? sContainer.insertBefore(fragment, child[0])
            : sContainer.appendChild(fragment);
        distance = me[axis.vector].offset * count;//me[axis.vector].offset是单个项的移动单位
        //扩大scrollContainer宽度，让上面插入的可以申展开
        sContainer.style[axis.size] = parseInt(sContainer.style[axis.size]) + distance + 'px';
        //scrollContainer改变宽度后需要对位置重新调整，让可视区保持不保
        vector && (me.getBody()[axis.scrollPos] += distance);
        me._scrolling = true;//开始滚动
        if (me.dispatchEvent('onbeforescroll', {index: index, scrollOffset: scrollOffset,
            direction: smartDirection, scrollUnit: count})) {
            me.getBody()[axis.scrollPos] += count * me[axis.vector].offset * (vector ? -1 : 1);
            me.dispatchEvent('onbeforeendscroll', {index: index, scrollOffset: scrollOffset,
                direction: smartDirection, scrollUnit: count});
            me.dispatchEvent('onafterscroll', {index: index, scrollOffset: scrollOffset,
                direction: smartDirection, scrollUnit: count});
        }
    },
    /**
     * 取得翻页的索引和索引在页面中的位置
     * @param {String} type 翻页方向，取值：prev:翻到上一步,next:翻到下一步.
     * @return {Object} {index:需要到达的索引项, scrollOffset:在页面中的位置}.
     * @private
     */
    _getFlipIndex: function(type) {
        var me = this,
            vector = me.flip == 'item',
            type = type == 'prev',
            currIndex = me.scrollIndex,
            index = currIndex + (vector ? 1 : me.pageSize) * (type ? -1 : 1),
            offset = vector ? (type ? 0 : me.pageSize - 1)
                : baidu.array.indexOf(baidu.dom.children(me.getScrollContainer()), me.getItem(currIndex));
        //fix flip page
        if (!vector && (index < 0 || index > me._dataList.length - 1)) {
            index = currIndex - offset + (type ? -1 : me.pageSize);
            offset = type ? me.pageSize - 1 : 0;
        }
        return {index: index, scrollOffset: offset};
    },
    /**
     * 翻页的基础处理方法
     * @param {String} type 翻页方向，取值：prev:翻到上一步,next:翻到下一步.
     * @private
     */
    _baseSlide: function(type) {
        if (!this.getItem(this.scrollIndex)) {return;}
        var me = this,
            sContainer = me.getScrollContainer(),
            flip = me._getFlipIndex(type);
        if(flip.index < 0 || flip.index > me._dataList.length - 1){return;}
        function moveByIndex(index, offset, type){
            me.addEventListener('onbeforeendscroll', function(evt){
                var target = evt.target;
                target.focus(evt.index);
                target.removeEventListener('onbeforeendscroll', arguments.callee);
            });
            me.scrollTo(index, offset, type);
        }
        if (me.flip == 'item') {
            me.getItem(flip.index) ? me.focus(flip.index)
                : moveByIndex(flip.index, flip.scrollOffset, type);
        }else {
            me._itemIds[flip.index]
                && moveByIndex(flip.index, flip.scrollOffset, type);
        }
    },
    /**
     * 翻到上一项或是翻到上一页
     */
    prev: function() {
        var me = this;
        me._baseSlide('prev');
        me.dispatchEvent('onprev');
    },
    /**
     * 翻到下一项或是翻到下一页
     */
    next: function() {
        var me = this;
        me._baseSlide('next');
        me.dispatchEvent('onnext');
    },
    /**
     * 是否已经处在第一项或第一页
     * @return {Boolean} true:当前已是到第一项或第一页.
     */
    isFirst: function() {
        var flip = this._getFlipIndex('prev');
        return flip.index < 0;
    },
    /**
     * 是否已经处在末项或是末页
     * @return {Boolean} true:当前已是到末项或末页.
     */
    isLast: function() {
        var flip = this._getFlipIndex('next');
        return flip.index >= this._dataList.length;
    },
    /**
     * 使当前选中的项失去焦点
     * @private
     */
    _blur: function() {
        var me = this,
            itemId = me._itemIds[me.scrollIndex];
        if (itemId) {
            baidu.dom.removeClass(me._baseItemElement(me.scrollIndex).element,
                me.getClass('item-focus'));
            me.scrollIndex = -1;
        }
    },
    /**
     * 使某一项得到焦点
     * @param {Number} index 需要得到焦点项的索引.
     */
    focus: function(index) {
        var me = this,
            itemId = me._itemIds[index],
            item = itemId && me._baseItemElement(index);//防止浪费资源创出空的element
        if (itemId) {
            me._blur();
            baidu.dom.addClass(item.element, me.getClass('item-focus'));
            me.scrollIndex = index;
        }
    },
    /**
     * 取得存放所有项的上层容器
     * @return {HTMLElement} 一个HTML元素.
     */
    getScrollContainer: function() {
        return baidu.dom.g(this.getId('scroll'));
    },
    /**
     * 析构函数
     */
    dispose: function() {
        var me = this;
        me.dispatchEvent('ondispose');
        baidu.object.each(me._items, function(item) {
            item.handler && baidu.array.each(item.handler, function(listener) {
                baidu.event.un(item.element, listener.evtName, listener.handler);
            });
        });
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

/**
 * 为滚动组件增加无限循环滚动功能
 * @param {Object} options config参数.
 * @config {Boolean} isCycle 是否支持循环滚动，默认支持
 * @author linlingyu
 */
baidu.ui.Carousel.register(function(me) {
    if (!me.isCycle) {return;}
    me._itemsPool = {};//重复项的缓存
    /**
     * 对core方法重写
     * @private
     */
    me._getItemElement = function(index) {//不覆盖prototype链上的方法
        var me = this,
            count = me._dataList.length,
            index = (index + count) % count,
            itemId = me._itemIds[index],
            entry = baidu.dom.g(itemId) ? me._itemsPool[itemId + '-buff']
                : me._baseItemElement(index);
        if (!entry) {//如果entry还未存在于buff中
            entry = me._itemsPool[itemId + '-buff'] = {
                element: baidu.dom.create('div', {
                    id: itemId + '-buff',
                    'class': me.getClass('item')
                }),
                content : me._dataList[index].content,
                setContent: function(){
                    this.content && (this.element.innerHTML = this.content);
                    this.content && (delete this.content);
                }
            };
        }
        return entry;
    }
    /**
     * 对core方法重写
     * @private
     */
    me._getFlipIndex = function(type) {
        var me = this,
            is = me.flip == 'item',
            type = type == 'prev',
            currIndex = me.scrollIndex,
            index = currIndex + (is ? 1 : me.pageSize) * (type ? -1 : 1),
            offset = is ? (type ? 0 : me.pageSize - 1)
                : baidu.array.indexOf(baidu.dom.children(me.getScrollContainer()), me.getItem(currIndex)),
            count = me._dataList.length;
        return {index: (index + count) % count, scrollOffset: offset};
    }

    me.addEventListener('onremoveitem', function(evt) {
        delete this._itemsPool[evt.id + '-buff'];
    });
});
/**
 *  @lends baidu.ui.Carousel.prototype
 */
baidu.ui.Carousel.prototype.isCycle = true;



/**
 * 为滚动组件增加自动滚动功能
 * @param {Object} options config参数.
 * @config {Boolean} isAutoScroll 是否支持自动滚动，默认支持
 * @config {Number} scrollInterval 以毫秒描述每次滚动的时间间隔
 * @config {String} direction 取值，up|right|down|left 描述组件的滚动方向
 * @config {Function} onautuscroll 一个事件，当触发一次autoscroll时触发该事件
 */
baidu.ui.Carousel.register(function(me){
    if(!me.isAutoScroll){return;}
    var key = me._getAutoScrollDirection();
    me.addEventListeners('onprev,onnext', function(){
        clearTimeout(me._autoScrollTimeout);//先清除上一次，防止多次运行
        me._autoScrollTimeout = setTimeout(function(){
            if(me._autoScrolling){
                me[key]();
                me.dispatchEvent('onautoscroll', {direction: key});
            }
        }, me.scrollInterval);
    });
    me.addEventListener('onload', function(evt){
        var me = evt.target;
        setTimeout(function(){
            me.startAutoScroll();
        }, me.scrollInterval);
    });
    me.addEventListener('ondispose', function(evt){
        clearTimeout(evt.target._autoScrollTimeout);
    });
});

baidu.ui.Carousel.extend(
/**
 *  @lends baidu.ui.Carousel.prototype
 */
{
    isAutoScroll: true,
    scrollInterval: 1000,
    direction: 'right',//up|right|down|left 描述组件的滚动方向
    _autoScrolling: true,
    /**
     * 取得当次设定的滚动方向字符串
     * @return {String} prev|next
     * @private
     */
    _getAutoScrollDirection: function(){
        var me = this,
            methods = {up: 'prev', right: 'next', down: 'next', left: 'prev'};
        return methods[me.direction.toLowerCase()]
            || methods[me.orientation == 'horizontal' ? 'right' : 'down'];
    },
    /**
     * 从停止状态开始自动滚动
     */
    startAutoScroll: function(){
        var me = this,
            direction = me._getAutoScrollDirection();
        me._autoScrolling = true;
        me[direction]();
        me.dispatchEvent('onautoscroll', {direction: direction});
    },
    /**
     * 停止当前自动滚动状态
     */
    stopAutoScroll: function(){
        var me = this;
        clearTimeout(me._autoScrollTimeout);
        me._autoScrolling = false;
    }
});

/**
 * 为滚动组件添加控制按钮插件
 * @param {Object} options config参数.
 * @config {Boolean} showButton 是否显示按钮，默认显示
 * @config {Object} btnLabel 设置按钮的文字描述，参考值：{prev: 'left', next: 'right'}
 * @author linlingyu
 */
baidu.ui.Carousel.register(function(me) {
    if (!me.showButton) {return;}
    me.btnLabel = baidu.object.extend({prev: '&lt;', next: '&gt;'},
        me.btnLabel);
    me.addEventListener('onload', function() {
        baidu.dom.insertHTML(me.getMain(), 'afterBegin', baidu.string.format(me.tplBtn, {
            'class' : me.getClass('btn-base') + ' ' + me.getClass('btn-prev'),
            handler: me.getCallString('prev'),
            content: me.btnLabel.prev
        }));
        baidu.dom.insertHTML(me.getMain(), 'beforeEnd', baidu.string.format(me.tplBtn, {
            'class' : me.getClass('btn-base') + ' ' + me.getClass('btn-next'),
            handler: me.getCallString('next'),
            content: me.btnLabel.next
        }));
    });
});
//
baidu.object.extend(baidu.ui.Carousel.prototype, 
/**
 *  @lends baidu.ui.Carousel.prototype
 */
{
    showButton: true,//是否需要显示翻转按钮
    tplBtn: '<a class="#{class}" onclick="#{handler}" href="javascript:void(0);">#{content}</a>'
});


/* BASE: baidu/lang/isFunction.js */



/**
 * 为滚动组件增加动画滚动功能
 * @param {Object} options config参数.
 * @config {Boolean} enableFx 是否支持动画插件
 * @config {Function} scrollFx 描述组件的动画执行过程，默认是baidu.fx.scrollTo
 * @config {Object} scrollFxOptions 执行动画过程所需要的参数
 * @config {Function} onbeforestartscroll 当开始执行动画时触发该事件，该事件的event参数中可以得到四个属性：index:当前需要滚动的索引, scrollOffset:滚动到可视区域的位置, direction:滚动方向, scrollUnit:需要滚动过多少个项
 * @author linlingyu
 */
baidu.ui.Carousel.register(function(me) {
    if (!me.enableFx) {return;}
    me.addEventListener('onbeforescroll', function(evt) {
        if (baidu.fx.current(me.getBody())) {return;}
        var is = evt.direction == 'prev',
            axis = me._axis[me.orientation],
            orie = me.orientation == 'horizontal',
            val = me.getBody()[axis.scrollPos] + evt.scrollUnit * me[axis.vector].offset * (is ? -1 : 1);
        me.scrollFxOptions = baidu.object.extend(me.scrollFxOptions, {
            carousel: me,
            index: evt.index,
            scrollOffset: evt.scrollOffset,
            direction: evt.direction,
            scrollUnit: evt.scrollUnit
        });
        baidu.lang.isFunction(me.scrollFx) && me.scrollFx(me.getBody(),
            {x: orie ? val : 0, y: orie ? 0 : val}, me.scrollFxOptions);
        evt.returnValue = false;
    });
});
//
baidu.ui.Carousel.extend(
/**
 *  @lends baidu.ui.Carousel.prototype
 */
{
    enableFx: true,
    scrollFx: baidu.fx.scrollTo,
    scrollFxOptions: {
        duration: 500,
        onbeforestart: function(evt) {
            var timeLine = evt.target;
            evt.target.carousel.dispatchEvent('onbeforestartscroll', {
                index: timeLine.index,
                scrollOffset: timeLine.scrollOffset,
                direction: timeLine.direction,
                scrollUnit: timeLine.scrollUnit
            });
        },
        
        onafterfinish: function(evt) {
            var timeLine = evt.target;
            timeLine.carousel.dispatchEvent('onbeforeendscroll', {
                index: timeLine.index,
                scrollOffset: timeLine.scrollOffset,
                direction: timeLine.direction,
                scrollUnit: timeLine.scrollUnit
            });
            timeLine.carousel.dispatchEvent('onafterscroll', {
                index: timeLine.index,
                scrollOffset: timeLine.scrollOffset,
                direction: timeLine.direction,
                scrollUnit: timeLine.scrollUnit
            });
        }
    }
});

/**
 * 为滚动组件提供动态增加或是删减滚动项功能
 */
baidu.ui.Carousel.extend(
/**
 *  @lends baidu.ui.Carousel.prototype
 */
{
    /**
     * 增加一个滚动项
     * @param {String} content 需要插入项的字符内容
     * @param {Number} index 插入位置
     * @private
     */
    _addText: function(content, index){
        var me = this,
            child = baidu.dom.children(me.getScrollContainer()),
            index = Math.min(Math.max(baidu.lang.isNumber(index) ? index : me._dataList.length, 0), me._dataList.length),
            item = me.getItem(me.scrollIndex),
            firstIndex = baidu.array.indexOf(me._itemIds, child[0].id),
            newIndex;
        
        me._dataList.splice(index, 0, {content: content});
        me._itemIds.splice(index, 0, baidu.lang.guid());
        index <= me.scrollIndex && me.scrollIndex++;
        //
        newIndex = item ? me.scrollIndex : baidu.array.indexOf(me._itemIds, child[0].id);
        index >= firstIndex && index <= firstIndex + me.pageSize - 1
            && me._renderItems(newIndex, baidu.array.indexOf(child, me.getItem(newIndex)));
    },
        /**
     * 移除索引指定的某一项
     * @param {Number} index 要移除项的索引
     * @return {HTMLElement} 当移除项存在于页面时返回该节点
     * @private
     */
    _removeItem: function(index){
        if(!baidu.lang.isNumber(index) || index < 0
            || index > this._dataList.length - 1){return;}
        var me = this,
            removeItem = me.getItem(index),
            currItem = me.getItem(me.scrollIndex),
            itemId = me._itemIds[index],
            item = me._items[itemId],
            child = baidu.dom.children(me.getScrollContainer()),
            currIndex = me.scrollIndex,
            newIndex,
            scrollOffset;
        item && baidu.array.each(item.handler, function(listener){
            baidu.event.un(item.element, listener.evtName, listener.handler);
        });
        delete me._items[itemId];
        me._dataList.splice(index, 1);
        me._itemIds.splice(index, 1);
        (me.scrollIndex > me._dataList.length - 1
            || me.scrollIndex > index) && me.scrollIndex--;
        if(removeItem){
            index == currIndex && me.focus(me.scrollIndex);
            newIndex = currItem ? me.scrollIndex : baidu.array.indexOf(me._itemIds,
                baidu.array.find(child, function(item){return item.id != itemId;}).id);
            scrollOffset = baidu.array.indexOf(child, me.getItem(newIndex));
            index <= newIndex && newIndex < me.pageSize && scrollOffset--;
            me._renderItems(newIndex, scrollOffset);
        }
        return removeItem;
    },
    /**
     * 将一个字符串的内容插入到索引指定的位置
     * @param {String} content 需要插入项的字符内容
     * @param {Number} index 插入位置
     */
    addText: function(content, index){
        var me = this;
        me._addText(content, index);
        me.dispatchEvent('onaddtext', {index: index});
    },
    /**
     * 
     * @param {HTMLElement} element 将一个element项的内容插入到索引指定的位置
     * @param {Number} index 插入位置
     */
    addItem: function(element, index){
        var me = this;
        me._addText(element.innerHTML, index);
        me.dispatchEvent('onadditem', {index: index});
    },
    /**
     * 移除索引指定的某一项
     * @param {Number} index 要移除项的索引
     * @return {HTMLElement} 当移除项存在于页面时返回该节点
     */
    removeItem: function(index){
        var me = this,
            item = me._removeItem(index);
        me.dispatchEvent('onremoveitem', {index: index});
        return item;
    }
});

/* BASE: baidu/array/hash.js */

/**
 * Tangram UI
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path: ui/behavior/statable/setStateHandler.js
 * author: berg
 * version: 1.0.0
 * date: 2010/12/14
 */




/**
 * 为statable行为添加DOM节点添加事件支持
 */

baidu.extend(baidu.ui.behavior.statable, {

    /**
     * dom的事件触发侦听器
     * @param {String} eventType 事件类型
     * @param {Object} group 状态类型，同一类型的相同状态会被加上相同的css
     * @param {Object} key 索引，在同一类中的索引
     * @param {Event} evnt 事件触发时的Event对象
     */
    _statableMouseHandler : function(eventType, group, key, evnt){
        this._fireEvent(eventType, group, key, evnt);
    },
    
    /**
     * 使用dom的形式为该节点增加事件
     * @param {html-element} element 事件源
     * @param {Object} group 状态类型，同一类型的相同状态会被加上相同的css
     * @param {Object} key 索引，在同一类中的索引
     * @memberOf {TypeName}
     * @return {Object} 格式：{evntName0 : handler0, evntName1 : handler1}
     */
    setStateHandler : function(element, group, key){
        var me = this, handler = {};
        if(typeof key == 'undefined'){group = key = "";}
        baidu.array.each(me._allEventsName, function(item){
            handler[item] = baidu.fn.bind("_statableMouseHandler", me, item, group, key);
            baidu.event.on(element, item, handler[item]);
        });
        me.addEventListener("dispose", function(){
            baidu.object.each(handler, function(item, key){
                baidu.event.un(element, key, item);
            });
        });
    }
});

/* BASE: baidu/dom/setAttr.js */
/* BASE: baidu/dom/setAttrs.js */




 /**
 * Table表格组件。
 * @class Table基类
 * @param       {Object} options config参数
 * @config      {Object} data 生成表格的数据，格式[{id: "rsid0", content : ["column0", "column1"]}, {id : "rsid0", content : ["column0", "column1"]}], id不是必要，当有选择列时用来定义用户的checkbox的value
 * @config      {Object} columns 各个列的高级定义，格式[{index : 1, width : 100, type : "select"}, {index : 2, width : "100%", enableEdit : true}, {index : 3, width : "200px"}]
 */
baidu.ui.Table = baidu.ui.createUI(function(options){
    var me = this;
        me.data = me.data || [];        //数据
        me._rows = [];                  //所有的Row组件
//      me.columns = me.columns || [];  //列的设置信息
});
baidu.ui.Table.extend({
    uiType          : "table",
    tplBody         : '<div><table cellpadding="0" cellspacing="0" border="0" id="#{id}" class="#{class}" #{stateHandler}>#{rows}</table></div>',
    /**
     * 获得控件字符串
     * @private
     * @return {string} HTML string
     */
    getString : function(){
        var me = this;
        return baidu.format(me.tplBody, {
            id          : me.getId(),
            "class"     : me.getClass(),
            rows        : me._getRowsString()
        });
    },
    
    /**
     * 获得所有行的字符串
     * @private
     * @return {string} HTML string
     */
    _getRowsString : function(){
        var me = this,
            i = 0,
            len = me.data.length,
            rowsArr = [],
            row;
        
        for(; i < len; i++){
            row = me.getRow(i);
            if(!row){
                row = me._rows[i] = me._createRow(me.data[i]);
            }else {
                row.update(me.data[i]);
            }
            rowsArr.push(row.getString());
        }
        while(me._rows.length > me.data.length){//更新_rows中多余的数据,当update时user有可能会更新data
            me._rows.pop();
        }
        return rowsArr.join("");
    },
    
    /**
     * 渲染表格
     * @public 
     * @param {HTMLElement} target       目标父级元素
     */
    render : function(target){
        var me = this;
        if(!target){return;}
        baidu.dom.insertHTML(me.renderMain(target), "beforeEnd", me.getString());
        me.resizeColumn();
        me.dispatchEvent("onload");
    },
    
    /**
     * 更新表格
     * @public
     * @param     {object}                 options       选项
     * @config    {Object}                 data          生成表格的数据，格式[{id : "rsid0", content : ["column0", "column1"]}, {id : "rsid0", content : ["column0", "column1"]}], id不是必要，当有选择列时用来定义用户的checkbox的value
     * @config    {Object}                 columns       各个列的高级定义，格式[{index : 1, width : 100, type : "select"}, {index : 2, width : "100%", enableEdit : true}, {index : 3, width : "200px"}]
     * @config    {Object}                 title         定义表格列的title说明，格式：["colName0", "删除", "colName2", "colName3"]
     * @config    {Number}                 pageSize      一页显示多少行数据，默认全部显示
     */
    update : function(options){
        var me = this;
        options = options || {};
        baidu.object.extend(me, options);
        me.dispatchEvent("beforeupdate");
        me.getMain().innerHTML = me.getString();//getString会更新data
        me.resizeColumn();
        me.dispatchEvent("update");
    },
    
    /**
     * 按照columns的参数设置单元格的宽度
     * @private
     * @return {string} HTML string
     */
    resizeColumn : function(){
        var me = this,
            widthArray = [],
            row = me.getBody().rows[0];
        if(row && me.columns){
            baidu.array.each(me.columns, function(item){
                if(item.hasOwnProperty("width")){
                    baidu.dom.setStyles(row.cells[item.index], {width : item.width});
                }
            });
        }
    },
    /**
     * 创建一个行控件
     * @private
     * @param {object} options 
     * @return {baidu.ui.table.Row} 行控件
     */
    _createRow : function(options){
        options.parent = this;
        return new baidu.ui.Table.Row(options);
    },
    
    /**
     * 获得指定行控件
     * @public
     * @param {number}  index  索引
     * @return {baidu.ui.table.Row|null} 指定行控件
     */
    getRow : function(index){
        var row = this._rows[index];
        if(row && !row.disposed){
            return row;
        }
        //return this._rows[index] || null;
        return null;
    },

    /**
     * 获得表格中的行数
     * @public
     * @return {number} count 
     */
    getRowCount : function(){
        return this._rows.length;
    },
    
    /**
     * 添加行
     * @private
     * @param {Object} optoins  创建Row所需要的options
     * @param {number} index 可选参数，表示在指定的索引的row之前插入，不指定该参数将会在最后插入
     */
    _addRow : function(options, index){
        var me = this,
            index = baidu.lang.isNumber(index) ? index : me.getBody().rows.length,
            row = me._createRow(options);
        me.data.splice(index, 0, options);
        me._rows.splice(index, 0, row);
        row.insertTo(index);
        return row.getId();
    },
    
    /**
     * 添加行控件
     * @private
     * @param {Object} optoins  创建Row所需要的options
     * @param {Number} index
     * @memberOf {TypeName} 
     */
    addRow : function(options, index){
        var me = this;
        me.dispatchEvent("addrow", {rowId : me._addRow(options, index)});
    },
    
    /**
     * 删除行
     * @private
     * @param {number} index 要删除的数据索引
     */
    _removeRow : function(index){
        var me = this,
            row = me._rows[index],
            rowId;
        if(row){
            rowId = row.getId();
            me.data.splice(index, 1);
            row.remove();
            me._rows.splice(index, 1);
            0 == index && me.resizeColumn();
        }
        return rowId;
    },
    
    /**
     * 删除行
     * @public
     * @param {number} index 要删除的数据索引
     */
    removeRow : function(index){
        var me = this,
            rowId = me._removeRow(index);
        if(rowId){me.dispatchEvent("removerow", {rowId : rowId});}
    },
    
    /**
     * 获取target元素
     * @private
     * @return {HTMLElement} target
     */
    getTarget : function(){
        var me = this;
        return baidu.g(me.targetId) || me.getMain();
    },
    
    /**
     * 销毁当前实例
     * @public
     */
    dispose : function(){
        var me = this;
        baidu.dom.remove(me.getId());
    }
});

/**
 * Row表格的行组件。
 * @private
 * @class Row组件，table的组合组件
 * @param       {Object}    options config参数
 * @config      {String}    id 标识该行的id，当该行存在checkbox复选框时，该id会被赋予checkbox的value
 * @config      {Array}     content 该行的单远格字符内容，如['column-1', 'column-2', 'column-3'...]
 */
baidu.ui.Table.Row = baidu.ui.createUI(function(options){
    this._cells = {};//所有生成的cell集合
    this.addState("selected");
}).extend({
    uiType : "table-row",
    statable : true,
    //tplBody : '<table cellpadding="0" cellspacing="0" border="0" width="#{width}" id="#{id}" class="#{class}" #{stateHandler}>#{rows}</table>',
    /**
     * 重写默认的getMain方法
     * 在Row控件中，main元素就是getId获得的元素
     * @return {HTMLElement} main main元素
     */
    getMain : function(){
        return baidu.g(this.getId());
    },

    /**
     * 获得控件字符串
     * @param {array} data 行中每一列中的数据
     */
    getString : function(){
        var me = this,
            colsArr = [],
            clazz = me.getClass("col"),
            columns = {};
        //提速
        colsArr.push("<tr id='", me.getId(), "' class='", me.getClass(), "' data-guid='", me.guid, "' ", me._getStateHandlerString(), ">");
        baidu.array.each(me.content, function(item, i){
            colsArr.push('<td>', item, '</td>');
        });
        colsArr.push("</tr>");
        return colsArr.join("");
    },
    
    /**
     * 更新当前控件
     * @param {object} options optional
     */
    update : function(options){
        var me = this,
            cols = baidu.dom.children(me.getMain());
        options = options || {};
        baidu.object.extend(me, options);
        baidu.array.each(cols, function(item, i){
            item.innerHTML = me.content[i];
        });
        me.dispatchEvent("update");
    },

    /**
     * 使用dom的方式在指定的索引位置插入一行
     * @param {Number} index 插入位置的索引
     * @memberOf {TypeName} 
     */
    insertTo : function(index){
        var me = this, row, cell;
        if(!me.getMain()){//防止多次调用
            row = me.getParent().getBody().insertRow(index);
            baidu.dom.setAttrs(row, {id : me.getId(), "class" : me.getClass(), "data-guid" : me.guid});
            me.setStateHandler(row);
            baidu.array.each(me.content, function(item, i){
                cell = row.insertCell(i);
                cell.innerHTML = item;
            });
        }
    },

    /**
     * 获得所有列元素
     * @return {array} cols
     */
    _getCols : function(){
        return baidu.dom.children(this.getId());
    },
    
    /**
     * 获得一行中所有列的字符串
     * @param {object} data  数据
     * @param {number} index  当前行的索引
     * @return {string} HTML string
     */
    _getColsString : function(data, index){
        return colsArr.join('');
    },

    /**
     * 选中当前行
     */
    select : function(){
        var me = this, id = me.getMain().id;
        if(!me.getState(id)['disabled']){
            me.setState("selected", id);
        }
    },

    /**
     * 去掉当前行的选中状态
     */
    unselect : function(){
        var me = this;
        me.removeState("selected", me.getMain().id);
    },

    /**
     * 移除当前行
     */
    remove : function(){
        var me = this;
        me.getParent().getBody().deleteRow(me.getBody().rowIndex);
        me.dispose();
    },

    /**
     * 如果指定行处于选中状态，让其取消选中状态，否则反之
     */
    toggle : function(){
        var me = this;
        if(me.getState(me.getMain().id)["selected"]){
            me.unselect();
        }else{
            me.select();
        }
    },

    /**
     * 根据索引取得单元格对象
     * @param {Number} index
     * @memberOf {TypeName} 
     * @return {baidu.ui.table.Cell} 
     */
    getCell : function(index){
        var me = this, td = me._getCols()[index], cell;
        if(td){
            if(td.id){
                cell = me._cells[td.id];
            }else{
                cell = new baidu.ui.Table.Cell({target : td});
                cell._initialize(me);
                me._cells[cell.getId()] = cell;
            }
        }
        td = null;
        return cell;
    },

    /**
     * 销毁实例
     * @memberOf {TypeName} 
     */
    dispose : function(){
        var me = this;
        me.dispatchEvent("dispose");
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

/**
 * Cell单元格组件，当调用Row组件的getCell方法时该组件才会被生成
 * @private
 * @class Cell组件类
 */
baidu.ui.Table.Cell = baidu.ui.createUI(function(options){}).extend({
    uiType : 'table-cell',

    /**
     * 初始化cell并提供父级对象参数row
     * @param {Object} _parent
     * @memberOf {TypeName} 
     */
    _initialize : function(_parent){
        var me = this;
        me.setParent(_parent);
        baidu.dom.setAttrs(me.target, {id : me.getId(), "data-guid" : me.guid});
    },

    /**
     * 重写Main方法
     * @memberOf {TypeName} 
     * @return {html-td} 
     */
    getMain : function(){
        return baidu.dom.g(this.getId());
    },

    /**
     * 取得baidu.ui.table.Row对象
     * @memberOf {TypeName} 
     * @return {baidu.ui.table.Row} 
     */
    getParent : function(){
        return this._parent;
    },

    /**
     * 设置父对象
     * @param {Object} _parent
     * @memberOf {TypeName} 
     */
    setParent : function(_parent){
        this._parent = _parent;
    },

    /**
     * 取得单元格的字符串内容
     * @memberOf {TypeName} 
     * @return {string} 
     */
    getHTML : function(){
        return this.getMain().innerHTML;
    },

    /**
     * 设置单元格的字符串内容
     * @param {Object} content
     * @memberOf {TypeName} 
     */
    setHTML : function(content){
        var me = this, parent = me.getParent();
        parent.getParent().data[parent.getMain().rowIndex].content[me.getMain().cellIndex] = content;
        me.getMain().innerHTML = content;
    }
});




/**
 * 
 * @param {Object} options config参数.
 * @config {Boolean} supportTable 是否支持表格项，默认支持
 * @config {Object} gridLayout 描述一个滚动项的内容是以多行多列的数据形式，例如：{row:3, col:2}
 */
baidu.ui.Carousel.register(function(me) {
    if(!me.supportTable){return;}
    me.gridLayout = baidu.object.extend({row: 3, col: 3},
        baidu.lang.isArray(me.gridLayout) ? baidu.array.hash(['row', 'col'], me.gridLayout)
            : me.gridLayout);
    me._dataList = me._formatTableData(me._dataList);
    me._tables = [];
    baidu.array.each(me._dataList, function(item, i){
        me._tables.push(new baidu.ui.Table({data: item}));
        me._dataList[i] = {content: me._tables[i].getString()};
    });
});

baidu.ui.Carousel.extend(
/**
 *  @lends baidu.ui.Carousel.prototype
 */
{
    supportTable: true,
    /**
	 * 将一维的数组通过layout格式化成二维的数据
	 * @param {Array} data 需要插入到table的数据(一维)
	 * @return {Array} 根据layout格式化后的数据(二维)
	 * @private
	 */
    _formatTableData: function(data){
        var me = this,
            layout = me.gridLayout,
            count = data.length,
            array = [],
            i = 0,
            table;
        for(; i < count; i++){
            i % (layout.row * layout.col) == 0 && array.push([]);
            table = array[array.length - 1];
            i % layout.col == 0 && table.push({content: []});
            table[table.length - 1].content.push(data[i].content);
        }
        return array;
    },
    /**
     * 在指定索引处插入一个新的多行多列表格
     * @param {Object} data 需要插入的数据（一维数组），格式：[{content: 'col-0'}, {content: 'col-1'}, {content: 'col-2'}....]
     * @param {Number} index 在指定的索引处插入，默认在末端插入
     */
    addTableItem: function(data, index){
        var me = this,
            data = me._formatTableData(data),
            index = Math.min(Math.max(baidu.lang.isNumber(index) ? index : me._dataList.length, 0), me._dataList.length);
        me._tables.splice(index, 0, new baidu.ui.Table({data: data[0]}));
        me._addText(me._tables[index].getString(), index);
    },
    /**
     * 移除由索引指定的项
     * @param {Number} index 需要移除的索引项
     * @return {HTMLElement} 被移除的表格对象，不存在该对象或不存在于当前页面的返回null
     */
    removeTableItem: function(index){
        if(!baidu.lang.isNumber(index) || index < 0
            || index > this._dataList.length - 1){return;}
        var me = this;
        me._tables.splice(index, 1);
        return me._removeItem(index);
    },
    /**
     * 根据索引取得表格
     * @param {Number} index 索引
     * @return {baidu.ui.Table} 该索引对应的表格对象，不存在该表格对象的返回null
     */
    getTable: function(index){
        return this._tables[index];
    }
});
/* BASE: baidu/page/getMousePosition.js */
/* BASE: baidu/dom/getPosition.js */








 /**
 * 拖动条控件，可用作音乐播放进度。
 * @class
 * @param      {String|HTMLElement}     target       存放滑块控件的元素，按钮会渲染到该元素内。
 * @param      {Object}                 [options]    选项layout
 * @config     {Number}                 value        记录滑块的当前进度值
 * @config     {Number}                 layout       滑块的布局[水平：horizontal,垂直：vertical]
 * @config     {Number}                 min          进度条最左边代表的值，默认值取0
 * @config     {Number}                 max          进度条最右边代表的值，默认值取100
 * @config     {Array}                  range        可拖动的范围，取值min到max之间，例如[30, 80]
 * @config     {Boolean}                disabled     是否禁用
 * @config     {String}                 skin         自定义样式名称前缀
 * @plugin     progressBar              进度条跟随滑块的滑动
 */
baidu.ui.Slider = baidu.ui.createUI(function(options){
    var me = this;
    me.range = me.range || [me.min, me.max];//初始化range
}).extend({
    layout: 'horizontal',//滑块的布局方式 horizontal :水平  vertical:垂直
    uiType: 'slider',
    tplBody: '<div id="#{id}" class="#{class}" onmousedown="#{mousedown}" style="position:relative;">#{thumb}</div>',
    tplThumb: '<div id="#{thumbId}" class="#{thumbClass}" style="position:absolute;"></div>',
    value: 0,//初始化时，进度条所在的值
    min: 0,//进度条最左边代表的值
    max: 100,//进度条最右边代表的值
    disabled: false,
//    range: [0, 100],
    _dragOpt: {},
    _axis: {//位置换算
        horizontal: {
            mousePos: 'x',
            pos: 'left',
            size: 'width',
            clientSize: 'clientWidth',
            offsetSize: 'offsetWidth'
        },
        vertical: {
            mousePos: 'y',
            pos: 'top',
            size: 'height',
            clientSize: 'clientHeight',
            offsetSize: 'offsetHeight'
        }
    },

    /**
     * 获得slider控件字符串
     * @private
     * @return {String}  string     控件的html字符串
     */
    getString : function(){
        var me = this;
        return baidu.format(me.tplBody,{
            id          : me.getId(),
            "class"     : me.getClass(),
            mousedown   : me.getCallRef() + "._mouseDown(event)",
            thumb       : baidu.format(me.tplThumb, {
                thumbId   : me.getId("thumb"),
                thumbClass: me.getClass("thumb")
            })
        });
    },

    /**
     * 处理鼠标在滚动条上的按下事件
     * @private
     */
    _mouseDown : function(e){
        var me = this,
            axis = me._axis[me.layout],
            mousePos = baidu.page.getMousePosition(),
            mainPos = baidu.dom.getPosition(me.getBody()),
            thumb = me.getThumb(),
            target = baidu.event.getTarget(e);
        //如果点在了滑块上面，就不移动
        if(target == thumb
            || baidu.dom.contains(thumb, target)
            || me.disabled){
            return ;
        }
        me._calcValue(mousePos[axis.mousePos]
            - mainPos[axis.pos]
            - thumb[axis.offsetSize] / 2);
        me.update()
        me.dispatchEvent("slideclick");
    },
    
    /**
     * 渲染slider
     * @public
     * @param     {String|HTMLElement}   target     将渲染到的元素或元素id
     */
    render : function(target){
        var me = this;
        if(!target){return;}
        baidu.dom.insertHTML(me.renderMain(target), "beforeEnd", me.getString());
//        me.getMain().style.position = "relative";
        me._createThumb();
        me.update();
        me.dispatchEvent("onload");
    },

    /**
     * 创建滑块
     * @private
     */
    _createThumb : function(){
        var me = this, drag;
        me._dragOpt = {
            "ondragend"     : function(){
                                me.dispatchEvent("slidestop");
                            },
            "ondragstart"   : function(){
                                me.dispatchEvent("slidestart");
                            },
            "ondrag"        : function(){
                                var axis = me._axis[me.layout],
                                    len = me.getThumb().style[axis.pos];
                                me._calcValue(parseInt(len));
                                me.dispatchEvent("slide");
                            },
            range           : [0, 0, 0, 0]
        };
        me._updateDragRange();
        drag = baidu.dom.draggable(me.getThumb(), me._dragOpt);
        me.addEventListener('dispose', function(){
            drag.cancel();
        });
    },

    /**
     * 更新拖拽范围，使用户可以动态修改滑块的拖拽范围
     * @private
     */
    _updateDragRange : function(val){
        var me = this,
            axis = me._axis[me.layout],
            range = val || me.range,
            dragRange = me._dragOpt.range,
            thumb = me.getThumb();
        range = [Math.max(Math.min(range[0], me.max), me.min),
                Math.max(Math.min(range[1], me.max), me.min)];
        if(me.layout.toLowerCase() == 'horizontal'){
            dragRange[1] = me._parseValue(range[1], 'fix') + thumb[axis.offsetSize];
            dragRange[3] = me._parseValue(range[0], 'fix');
            dragRange[2] = thumb.clientHeight;
        }else{
            dragRange[0] = me._parseValue(range[0], 'fix');
            dragRange[2] = me._parseValue(range[1], 'fix') + thumb[axis.offsetSize];
            dragRange[1] = thumb.clientWidth;
        }
    },

    /**
     * 更新slider状态
     * @public
     * @param   {Object}                 [options]    选项layout
     * @config  {Number}                 value        记录滑块的当前进度值
     * @config  {Number}                 layout       滑块的布局[水平：horizontal,垂直：vertical]
     * @config  {Number}                 min          进度条最左边代表的值
     * @config  {Number}                 max          进度条最右边代表的值
     * @config  {Boolean}                disabled     是否禁用
     * @config  {String}                 skin         自定义样式名称前缀
     */
    update : function(options){
        var me = this,
            axis = me._axis[me.layout],
            body = me.getBody();
        options = options || {};
        baidu.object.extend(me, options);
        me._updateDragRange();
        me._adjustValue();
        if (me.dispatchEvent("beforesliderto", {drop: options.drop})) {
            me.getThumb().style[axis.pos] = me._parseValue(me.value, 'pix') + 'px';
            me.dispatchEvent("update");
        }
    },

    /**
     * 校准value值，保证它在range范围内
     * @private
     */
    _adjustValue : function(){
        var me = this,
            range = me.range;
        me.value = Math.max(Math.min(me.value, range[1]), range[0]);
    },

    /**
     * 将位置值转换为value，记录在当前实例中
     * @private
     * @param {number} position
     */
    _calcValue : function(pos){
        var me = this;
        me.value = me._parseValue(pos, 'value');
        me._adjustValue();
    },
    
    /**
     * 将刻度转换为像素或是将像素转换为刻度
     * @param {Number} val 刻度值或是像素
     * @param {Object} type 'pix':刻度转换为像素, 'value':像素转换为刻度
     */
    _parseValue: function(val, type){
        var me = this,
            axis = me._axis[me.layout];
            len = me.getBody()[axis.clientSize] - me.getThumb()[axis.offsetSize];
        if(type == 'value'){
            val = (me.max - me.min) / len * val + me.min;
        }else{//to pix
            val = Math.round(len /(me.max - me.min) * (val - me.min));
        }
        return val;
    },

    /**
     * 获得当前的value
     * @public
     * @return {Number} value     当前滑块位置的值
     */
    getValue : function(){
        return this.value;
    },
    
    /**
     * 获取target元素
     * @private
     * @return {HTMLElement} target
     */
    getTarget : function(){
        return baidu.g(this.targetId);
    },
    
    /**
     * 获取滑块元素
     * @public
     * @return {HTMLElement} thumb     滑块元素
     */
    getThumb : function(){
        return baidu.g(this.getId("thumb"));
    },
    
    disable: function(){
        var me = this;
        me.disabled = true;
        me._updateDragRange([me.value, me.value]);
    },
    
    enable: function(){
        var me = this;
        me.disabled = false;
        me._updateDragRange(me.range);
    },
    /**
     * 销毁当前实例
     * @public
     */
    dispose : function(){
        var me = this;
        me.dispatchEvent('dispose');
        baidu.dom.remove(me.getId());
        me.dispatchEvent('ondispose');
        baidu.lang.Class.prototype.dispose.call(me);
    }
});














/* BASE: baidu/event/getPageX.js */
/* BASE: baidu/event/getPageY.js */






/**
 * 复杂颜色拾取器
 * @name baidu.ui.ColorPalette
 * @class
 * @param {Object}  options 配置.
 * @param {Number}  [options.sliderLength = 150] 滑动条长度.
 * @param {String}  options.coverImgSrc 调色板渐变背景图片地址.
 * @param {String}  options.sliderImgSrc 滑动条背景图片地址.
 * @author walter
 */
baidu.ui.ColorPalette = baidu.ui.createUI(function(options) {
    var me = this;
    me.hue = 360; //色相初始值
    me.saturation = 100; //饱和度初始值
    me.brightness = 100; //亮度初始值
    me.sliderDotY = 0;  //滑动块初始值
    me.padDotY = 0; //面板调色块Y轴初始值
    me.padDotX = me.sliderLength; //面板调色块X轴初始值
}).extend({
    uiType: 'colorpalette',

    tplBody: '<div id="#{id}" class="#{class}">#{content}</div>',

    /**
     * 调色板模板
     */
    tplPad: '<div id="#{padId}" class="#{padClass}"><div id="#{coverId}" class="#{coverClass}"></div>#{padDot}</div>',

    /**
     * 滑动条模板
     */
    tplSlider: '<div id="#{sliderId}" class="#{sliderClass}"></div>',

    /**
     * 调色块模板
     */
    tplPadDot: '<div id="#{padDotId}" class="#{padDotClass}" onmousedown="#{mousedown}"></div>',

    /**
     * 颜色展示区域模板
     */
    tplShow: '<div id="#{newColorId}" class="#{newColorClass}" onclick="#{showClick}"></div><div id="#{savedColorId}" class="#{savedColorClass}" onclick="#{savedColorClick}"></div><div id="#{hexId}" class="#{hexClass}"></div><div id="#{saveId}" class="#{saveClass}" onclick="#{saveClick}"></div>',

    sliderLength: 150,

    coverImgSrc: '',

    sliderImgSrc: '',

    /**
     * 生成ColorPalette的html字符串
     *  @return {String} 生成html字符串.
     */
    getString: function() {
        var me = this,
            strArray = [];

        strArray.push(me._getPadString(),
                      me._getSliderString(),
                      me._getShowString());

        return baidu.string.format(me.tplBody, {
            id: me.getId(),
            'class': me.getClass(),
            content: strArray.join('')
        });
    },

    /**
     * 渲染控件
     * @param {Object} target 目标渲染对象.
     */
    render: function(target) {
        
        var me = this;
        if (me.getMain()) {
            return;
        }
        baidu.dom.insertHTML(me.renderMain(target),
                             'beforeEnd',
                             me.getString());
        me._createSlider();
        me._padClickHandler = baidu.fn.bind('_onPadClick', me);

        baidu.event.on(me.getPad(), 'click', me._padClickHandler);

        me._setColorImgs();
        me.setSliderDot(me.sliderDotY);
        me.setPadDot(me.padDotY, me.padDotX);
        me._saveColor();

        me.dispatchEvent('onload');
    },

    /**
     * 设置滑动条和调色板背景图片
     * @private
     */
    _setColorImgs: function() {
        var me = this,
            cover = me._getCover(),
            slider = me.getSliderBody();

        if (baidu.browser.ie) {
            me._setFilterImg(cover, me.coverImgSrc);
        }
        else {
            me._setBackgroundImg(cover, me.coverImgSrc);
        }
        me._setBackgroundImg(slider, me.sliderImgSrc);
    },

    /**
     * 设置对象背景图片
     * @private
     * @param {Object} obj 要设置的对象.
     * @param {Object} src 图片src.
     */
    _setBackgroundImg: function(obj, src) {
        if (!src) {
            return;
        }
        baidu.dom.setStyle(obj, 'background', 'url(' + src + ')');
    },

    /**
     * 设置对象fliter背景图片,此方法应用于IE系列浏览器
     * @private
     * @param {Object} obj 要设置的对象.
     * @param {Object} src 图片src.
     */
    _setFilterImg: function(obj, src) {        
        if (!src) {
            return;
        }
        baidu.dom.setStyle(obj, 'filter',
             'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' +
              src + '", sizingMethod="crop")');
    },

    /**
     * 生成调色板的html字符串
     * @private
     * @return {String} 生成html字符串.
     */
    _getPadString: function() {
        var me = this;
        return baidu.string.format(me.tplPad, {
            padId: me.getId('pad'),
            padClass: me.getClass('pad'),
            coverId: me.getId('cover'),
            coverClass: me.getClass('cover'),
            padDot: me._getPadDotString()
        });
    },

    /**
     * 生成调色块html字符串
     * @private
     * @return {String} 生成html字符串.
     */
    _getPadDotString: function() {
        var me = this;
        return baidu.string.format(me.tplPadDot, {
            padDotId: me.getId('padDot'),
            padDotClass: me.getClass('padDot'),
            mousedown: me.getCallString('_onPadDotMouseDown')
        });
    },

    /**
     * 生成滑动条html字符串
     * @private
     * @return {String} 生成html字符串.
     */
    _getSliderString: function() {
        var me = this;
        return baidu.string.format(me.tplSlider, {
            sliderId: me.getId('slider'),
            sliderClass: me.getClass('sliderMain')
        });
    },

    /**
     * 创建滑动条
     * @private
     */
    _createSlider: function() {
        var me = this,
            target = me._getSliderMain();

        me.slider = baidu.ui.create(baidu.ui.Slider, {
            autoRender: true,
            element: target,
            layout: 'vertical',
            max: me.sliderLength,
            classPrefix: me.getClass('slider'),
            onslide: function() {
                me.setSliderDot(this.value); //设置滑动块
            },
            onslideclick: function() {
                me.setSliderDot(this.value); //设置滑动块
            }
        });

    },

    /**
     * 生成颜色展示区域html字符串
     * @private
     * @return {String} 生成html字符串.
     */
    _getShowString: function() {
        var me = this;
        return baidu.string.format(me.tplShow, {
            newColorId: me.getId('newColor'),
            newColorClass: me.getClass('newColor'),
            savedColorId: me.getId('savedColor'),
            savedColorClass: me.getClass('savedColor'),
            savedColorClick: me.getCallString('_onSavedColorClick'),
            hexId: me.getId('hex'),
            hexClass: me.getClass('hex'),
            saveId: me.getId('save'),
            saveClass: me.getClass('save'),
            saveClick: me.getCallString('_saveColor')
        });
    },

    /**
     * 鼠标按下调色块事件
     * @private
     */
    _onPadDotMouseDown: function() {
        var me = this,
            pad = me.getPad(),
            position = baidu.dom.getPosition(pad);

        me.padTop = position.top; //计算调色板的offsetTop，用于_onPadDotMouseMove辅助计算
        me.padLeft = position.left; //计算调色板的offsetTop，用于_onPadDotMouseMove辅助计算

        me._movePadDotHandler = baidu.fn.bind('_onPadDotMouseMove', me);
        me._upPadDotHandler = baidu.fn.bind('_onPadDotMouseUp', me);

        baidu.event.on(document, 'mousemove', me._movePadDotHandler);
        baidu.event.on(document, 'mouseup', me._upPadDotHandler);
    },

    /**
     * 鼠标移动调色块事件
     * @private
     * @param {Object} e 鼠标事件对象.
     */
    _onPadDotMouseMove: function(e) {
        e = e || event;
        var me = this,
            pageX = baidu.event.getPageX(e),
            pageY = baidu.event.getPageY(e);

        //计算鼠标坐标相对调色板左上角距离
        me.padDotY = me._adjustValue(me.sliderLength, pageY - me.padTop);
        me.padDotX = me._adjustValue(me.sliderLength, pageX - me.padLeft);

        me.setPadDot(me.padDotY, me.padDotX); //设置调色块
    },

    /**
     * 校准value值，保证它在合理范围内
     * @private
     * @param {Number} x 范围上限,被校准的数值不能超过这个数值.
     * @param {Number} y 需要校准的数值.
     * @return {Number} 校准过的数值.
     */
    _adjustValue: function(x, y) {
        return Math.max(0, Math.min(x, y));
    },

    /**
     * 鼠标松开调色块事件
     * @private
     */
    _onPadDotMouseUp: function() {
        var me = this;
        if(!me._movePadDotHandler){return;}
        baidu.event.un(document, 'mousemove', me._movePadDotHandler);
        baidu.event.un(document, 'mouseup', me._upPadDotHandler);
    },

    /**
     * 调色板单击事件
     * @param {Object} e 鼠标事件.
     * @private
     */
    _onPadClick: function(e) {
        var me = this,
            pad = me.getPad(),
            position = baidu.dom.getPosition(pad);

        me.padTop = position.top;
        me.padLeft = position.left;

        me._onPadDotMouseMove(e); //将调色块移动到鼠标点击的位置
    },

    /**
     * savedColor 单击事件
     * @private
     */
    _onSavedColorClick: function() {
        var me = this,
            dot = me.getSliderDot(),
            position = me.savedColorPosition;

        me.setSliderDot(position.sliderDotY);
        baidu.dom.setStyle(dot, 'top', position.sliderDotY); //恢复滑动块位置
        me.setPadDot(position.padDotY, position.padDotX); //恢复调色块位置
    },

    /**
     * 获取滑动条容器对象
     * @private
     * @return {HTMLElement} dom节点.
     */
    _getSliderMain: function() {
        return baidu.dom.g(this.getId('slider'));
    },

    /**
     * 获取滑动条容器对象
     * @return {HTMLElement} dom节点.
     */
    getSliderBody: function() {
        return this.slider.getBody();
    },

    /**
     * 获取滑动块对象
     * @return {HTMLElement} dom节点.
     */
    getSliderDot: function() {
        return this.slider.getThumb();
    },

    /**
     * 获取调色板对象
     * @return {HTMLElement} dom节点.
     */
    getPad: function() {
        return baidu.dom.g(this.getId('pad'));
    },

    /**
     * 获取调色块对象
     * @return {HTMLElement} dom节点.
     */
    getPadDot: function() {
        return baidu.dom.g(this.getId('padDot'));
    },

    /**
     * 获取调色板cover图层对象
     * @private
     * @return {HTMLElement} dom节点.
     */
    _getCover: function() {
        return baidu.dom.g(this.getId('cover'));
    },

    /**
     * 设置滑动块位置
     * @param {Object} value 滑动块top位置值.
     */
    setSliderDot: function(value) {
        var me = this,
            pad = me.getPad();

        me.sliderDotY = value;
        me.hue = parseInt(360 * (me.sliderLength - value) / me.sliderLength,
                          10); //根据滑动块位置计算色相值

        baidu.dom.setStyle(pad, 'background-color', '#' + me._HSBToHex({
            h: me.hue,
            s: 100,
            b: 100
        })); //设置调色板背景颜色

        me._setNewColor();
    },

    /**
     * 设置调色块位置
     * @param {Object} top 调色块 offsetTop值.
     * @param {Object} left 调色块 offsetLeft值.
     */
    setPadDot: function(top, left) {
        var me = this,
            dot = me.getPadDot();

        me.saturation = parseInt(100 * left / 150, 10); //根据调色块top值计算饱和度
        me.brightness = parseInt(100 * (150 - top) / 150, 10); //根据调色块left值计算亮度

        baidu.dom.setStyles(dot, {
            top: top,
            left: left
        });

        me._setNewColor();
    },

    /**
     * 设置实时颜色
     * @private
     */
    _setNewColor: function() {
        var me = this,
            newColorContainer = baidu.dom.g(this.getId('newColor')),
            hexContainer = baidu.dom.g(this.getId('hex'));

        //记录当前hex格式颜色值
        me.hex = '#' + me._HSBToHex({
            h: me.hue,
            s: me.saturation,
            b: me.brightness
        });

        baidu.dom.setStyle(newColorContainer, 'background-color', me.hex);
        hexContainer.innerHTML = me.hex;
    },

    /**
     * 保存当前颜色
     * @private
     */
    _saveColor: function() {
        var me = this,
            savedColorContainer = baidu.dom.g(this.getId('savedColor'));

        baidu.dom.setStyle(savedColorContainer,
                           'background-color',
                            me.hex); //显示颜色

        me.savedColorHex = me.hex; //保存颜色值

        //保存滑动块、调色块状态
        me.savedColorPosition = {
            sliderDotY: me.sliderDotY,
            padDotY: me.padDotY,
            padDotX: me.padDotX
        };
    },

    /**
     * 获取当前颜色值
     * @return {String} 颜色值.
     */
    getColor: function() {
        return this.hex;
    },

    /**
     * 将HSB格式转成RGB格式
     * @private
     * @param {Object} hsb hsb格式颜色值.
     * @return {Object} rgb格式颜色值.
     */
    _HSBToRGB: function(hsb) {
        var rgb = {},
            h = Math.round(hsb.h),
            s = Math.round(hsb.s * 255 / 100),
            v = Math.round(hsb.b * 255 / 100);
        if (s == 0) {
            rgb.r = rgb.g = rgb.b = v;
        } else {
            var t1 = v,
                t2 = (255 - s) * v / 255,
                t3 = (t1 - t2) * (h % 60) / 60;
            if (h == 360) h = 0;
            if (h < 60) {rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3;}
            else if (h < 120) {rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3;}
            else if (h < 180) {rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3;}
            else if (h < 240) {rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3;}
            else if (h < 300) {rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3;}
            else if (h < 360) {rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3;}
            else {rgb.r = 0; rgb.g = 0; rgb.b = 0;}
        }

        return {
            r: Math.round(rgb.r),
            g: Math.round(rgb.g),
            b: Math.round(rgb.b)
        };
    },

    /**
     * 将rgb格式转成hex格式
     * @private
     * @param {Object} rgb rgb格式颜色值.
     * @return {String} hex格式颜色值.
     */
    _RGBToHex: function(rgb) {
        var hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];
        baidu.array.each(hex, function(val, nr) {
            if (val.length == 1) {
                hex[nr] = '0' + val;
            }
        });
        return hex.join('');
    },

    /**
     * 将hsb格式转成hex格式
     * @private
     * @param {Object} hsb hsb格式颜色值.
     * @return {String} hex格式颜色值.
     */
    _HSBToHex: function(hsb) {
        var me = this;
        return me._RGBToHex(me._HSBToRGB(hsb));
    },

    /**
     * 销毁 ColorPalette
     */
    dispose: function() {
        var me = this;

        baidu.event.un(me.getPad(), 'click', me._padClickHandler);
        me.slider.dispose();

        me.dispatchEvent('ondispose');
        if (me.getMain()) {
            baidu.dom.remove(me.getMain());
        }
        baidu.lang.Class.prototype.dispose.call(me);
    }

});

/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */




/* BASE: baidu/dom/getWindow.js */


/* BASE: baidu/dom/setPosition.js */














/**
 * @author berg, lxp
 * @behavior 为ui控件添加定位行为
 *
 * 根据用户参数将元素定位到指定位置
 * TODO: 1. 用surround做触边折返场景时, 折返的大小通常是原始高宽+另一元素的高宽
 *
 * });
 */
(function() {
    var Posable = baidu.ui.behavior.posable = function() { };

    /**
     * 将控件或者指定元素的左上角放置到指定的坐标
     * @param {Array|Object} coordinate 定位坐标,相对文档左上角的坐标，可以是{x:200,y:300}格式，也可以是[200, 300]格式.
     * @param {HTMLElement|string} element optional 目标元素或目标元素的id，如果不指定，默认为当前控件的主元素.
     * @param {Object} options optional 选项，包括：position/coordinate/offset/insideScreen.
     */
    Posable.setPosition = function(coordinate, element, options) {
        element = baidu.g(element) || this.getMain();
        options = options || {};
        var me = this,
            args = [element, coordinate, options];
        me.__execPosFn(element, '_positionByCoordinate', options.once, args);
    };

    /**
     * 将元素放置到指定的坐标点
     *
     * @param {HTMLElement|string} source 要定位的元素.
     * @param {Array|Object} coordinate 定位坐标,相对文档左上角的坐标，可以是{x:200,y:300}格式，也可以是[200, 300]格式.
     * @param {Object} options optional 选项，同setPosition.
     */
    Posable._positionByCoordinate = function(source, coordinate, options, _scrollJustify) {
        coordinate = coordinate || [0, 0];
        options = options || {};
        
        var me = this,
            elementStyle = {},
            cH = baidu.page.getViewHeight(),
            cW = baidu.page.getViewWidth(),
            scrollLeft = baidu.page.getScrollLeft(),
            scrollTop  = baidu.page.getScrollTop(),
            sourceWidth = source.offsetWidth,
            sourceHeight = source.offsetHeight,
            offsetParent = source.offsetParent,
            parentPos = (!offsetParent || offsetParent == document.body) ? {left: 0, top: 0} : baidu.dom.getPosition(offsetParent);

        //兼容position大小写
        options.position = (typeof options.position !== 'undefined') ? options.position.toLowerCase() : 'bottomright';

        coordinate = _formatCoordinate(coordinate || [0, 0]);
        options.offset = _formatCoordinate(options.offset || [0, 0]);
    
        coordinate.x += (options.position.indexOf('right') >= 0 ? (coordinate.width || 0) : 0); 
        coordinate.y += (options.position.indexOf('bottom') >= 0 ? (coordinate.height || 0) : 0); 
        
        elementStyle.left = coordinate.x + options.offset.x - parentPos.left;
        elementStyle.top = coordinate.y + options.offset.y - parentPos.top;

        switch (options.insideScreen) {
           case "surround" :
                elementStyle.left += elementStyle.left < scrollLeft ? sourceWidth  + (coordinate.width || 0): 
                                    ((elementStyle.left + sourceWidth ) > (scrollLeft + cW) ? - sourceWidth - (coordinate.width || 0) : 0);
                elementStyle.top  += elementStyle.top  < scrollTop  ? sourceHeight  + (coordinate.height || 0):
                                    ((elementStyle.top  + sourceHeight) > (scrollTop  + cH) ? - sourceHeight - (coordinate.height || 0) : 0);
                break;
            case 'fix' :
                elementStyle.left = Math.max(
                        0 - parseFloat(baidu.dom.getStyle(source, 'marginLeft')) || 0,
                        Math.min(
                            elementStyle.left,
                            baidu.page.getViewWidth() - sourceWidth - parentPos.left
                            )
                        );
                elementStyle.top = Math.max(
                        0 - parseFloat(baidu.dom.getStyle(source, 'marginTop')) || 0,
                        Math.min(
                            elementStyle.top,
                            baidu.page.getViewHeight() - sourceHeight - parentPos.top
                            )
                        );
                break;
            case 'verge':
                var offset = {
                    width: (options.position.indexOf('right') > -1 ? coordinate.width : 0),//是否放在原点的下方
                    height: (options.position.indexOf('bottom') > -1 ? coordinate.height : 0)//是否放在原点的右方
                },
                optOffset = {
                    width: (options.position.indexOf('bottom') > -1 ? coordinate.width : 0),
                    height: (options.position.indexOf('right') > -1 ? coordinate.height : 0)
                };
               
                elementStyle.left -= (options.position.indexOf('right') >= 0 ? (coordinate.width || 0) : 0);
                elementStyle.top -= (options.position.indexOf('bottom') >= 0 ? (coordinate.height || 0) : 0);
                
                elementStyle.left += elementStyle.left + offset.width + sourceWidth - scrollLeft > cW - parentPos.left ?
                    optOffset.width - sourceWidth : offset.width;
                elementStyle.top += elementStyle.top + offset.height + sourceHeight - scrollTop > cH - parentPos.top ?
                    optOffset.height - sourceHeight : offset.height;
                break;
        }
        baidu.dom.setPosition(source, elementStyle);


        //如果因为调整位置令窗口产生了滚动条，重新调整一次。
        //可能出现死循环，用_scrollJustify保证重新调整仅限一次。
        if (!_scrollJustify && (cH != baidu.page.getViewHeight() || cW != baidu.page.getViewWidth())) {
            me._positionByCoordinate(source, coordinate, {}, true);
        }
        _scrollJustify || me.dispatchEvent('onpositionupdate');
    };

    /**
     * 根据参数不同，选择执行一次或者在window resize的时候再次执行某方法
     * @private
     *
     * @param {HTMLElement|string} element 根据此元素寻找window.
     * @param {string} fnName 方法名，会在this下寻找.
     * @param {Boolean} once 是否只执行一次.
     * @return {arguments} args 执行方法的参数.
     */
    Posable.__execPosFn = function(element, fnName, once, args) {
        var me = this;

        if (typeof once == 'undefined' || !once) {
            baidu.event.on(
                baidu.dom.getWindow(element),
                'resize',
                baidu.fn.bind.apply(me, [fnName, me].concat([].slice.call(args)))
            );
        }
        me[fnName].apply(me, args);
    };
    /**
     * 格式化坐标格式
     * @param {Object|array} coordinate 要调整的坐标格式.
     * @return {Object} coordinate 调整后的格式
     * 类似：{x : number, y : number}.
     */
    function _formatCoordinate(coordinate) {
        coordinate.x = coordinate[0] || coordinate.x || coordinate.left || 0;
        coordinate.y = coordinate[1] || coordinate.y || coordinate.top || 0;
        return coordinate;
    }
})();



/**
 * 将控件或者指定元素与指定的元素对齐
 *
 * @param {HTMLElement|string} target 要对齐到的元素.
 * @param {HTMLElement|string} element optional 要对齐的元素或元素id，如果不指定，默认为当前控件的主元素.
 * @param {Object} options optional 选项，同setPosition方法.
 */
baidu.ui.behavior.posable.setPositionByElement =
    function(target, element, options) {
        target = baidu.g(target);
        element = baidu.g(element) || this.getMain();
        options = options || {};

        this.__execPosFn(element, '_setPositionByElement', options.once, arguments);
    };

/**
 * 将控件或者指定元素与指定的元素对齐
 * @private
 *
 * @param {HTMLElement|string} target 要对齐到的元素.
 * @param {HTMLElement|string} element optional 要对齐的元素或元素id，如果不指定，默认为当前控件的主元素.
 * @param {Object} options optional 选项，同setPosition方法.
 */
baidu.ui.behavior.posable._setPositionByElement = function(target, element, options){
    var targetPos = baidu.dom.getPosition(target);
    options.once = false;
    options.insideScreen = options.insideScreen || 'verge';
    targetPos.width = target.offsetWidth;
    targetPos.height = target.offsetHeight;
    this._positionByCoordinate(element, targetPos, options, true);
};












/**
 * 颜色拾取器
 * @name baidu.ui.ColorPicker
 * @class
 * @param {Object} options 配置.
 * @param {Number} [options.gridSize = 8] 一行显示的颜色块个数.
 * @param {Function} [options.onchosen] 颜色选择事件.
 * @plugin click 创建一个鼠标点击触发colorPicker的插件
 * @plugin more 弹出调色板插件
 * @author walter
 */
baidu.ui.ColorPicker = baidu.ui.createUI(function(options) {
    var me = this;
    me._initialized = false; //判断是否已经初始化
}).extend({
    uiType: 'colorpicker',

    /**
     * colorPicker 提供选择的颜色值
     */
    colors: ('000,800000,8B4513,2F4F4F,008080,000080,4B0082,696969,' +
             'B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080,' +
             'F00,FF8C00,FFD700,008000,0FF,00F,EE82EE,A9A9A9,' +
             'FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3,' +
             'FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFF').split(','),

    tplBody: '<div id="#{id}" class="#{class}">#{content}</div>',

    tplColor: '<a href="javascript:;" id="#{colorId}" style="#{colorStyle}" class="#{colorClass}" onclick="javascript:#{choose};return false;" #{stateHandler}></a>',

    gridSize: 8,

    position: 'bottomCenter',

    statable: true,

    posable: true,

    /**
     * 生成colorPicker的html字符串代码
     *  @return {String} 生成html字符串.
     */
    getString: function() {
        var me = this,
            strArray = ['<table>'],
            count = 0,
            length = me.colors.length;

        while (count < length) {
            strArray.push('<tr>');
            for (var i = 0; i < me.gridSize; i++) {
                strArray.push('<td>',
                              me._getColorString(me.colors[count]),
                              '</td>');
                count++;
            }
            strArray.push('</tr>');
        }
        strArray.push('</table>');

        return baidu.string.format(me.tplBody, {
            id: me.getId(),
            'class': me.getClass(),
            content: strArray.join('')
        });
    },

    /**
     * 生成颜色块的html字符串代码
     * @private
     * @param {String} color 颜色值.
     * @return {String} 生成html字符串.
     */
    _getColorString: function(color) {
        var me = this;
        return baidu.string.format(me.tplColor, {
            colorId: me.getId(color),
            colorStyle: 'background-color:#' + color,
            colorClass: me.getClass('color'),
            choose: me.getCallString('_choose', color),
            stateHandler: me._getStateHandlerString('', color)
        });
    },

    /**
     * 渲染控件
     * @param {Object} target 目标渲染对象.
     */
    render: function(target) {
        var me = this;
        target = baidu.g(target);
        if (me.getMain() || !target) {
            return;
        }
        me.targetId = target.id || me.getId('target');
        me.renderMain();
        me.dispatchEvent('onload');
    },

    /**
     * 更新colorPicker
     * @param {Object} options 需要更新的配置.
     */
    update: function(options) {
        var me = this,
            main = me.getMain(),
            target = me.getTarget();
        
        options = options || {};
        baidu.object.extend(me, options);
        main.innerHTML = me.getString();
        me.setPositionByElement(target, main, {
            position: me.position,
            once: true
        });

        me.dispatchEvent('onupdate');
    },

    /**
     * 响应颜色被选择,并发出 oncolorchosen 事件
     * @param {Object} color 颜色值.
     */
    _choose: function(color) {
        var me = this;
        me.close();
        me.dispatchEvent('onchosen', {
            color: '#' + color
        });
    },

    /**
     * 打开 colorPicker
     */
    open: function() {
        var me = this;
        if (!me._initialized) {
            me.update();
            me._initialized = true;
        }
        baidu.dom.show(me.getMain());
        baidu.ui.ColorPicker.showing = me;
        me.dispatchEvent('onopen');
    },

    /**
     * 关闭 colorPicker
     */
    close: function() {
        var me = this;
        baidu.dom.hide(me.getMain());
        me.dispatchEvent('onclose');
    },

    /**
     * 获取target元素
     * @return {HTMLElement} HTML元素.
     */
    getTarget: function() {
        return baidu.g(this.targetId);
    },

    /**
     * 销毁 colorPicker
     */
    dispose: function() {
        var me = this;
        me.dispatchEvent('ondispose');
        if (me.getMain()) {
            baidu.dom.remove(me.getMain());
        }
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

/* BASE: baidu/lang/instance.js */

//

/**
 * 获取元素所在的控件
 * @param {HTMLElement|string} 要查找的元素，如果是字符串，则查找这个guid为此字符串的控件
 * @param {string} optional  type 匹配查找指定类型的控件【暂未支持】
 * @return {object} ui控件
 */
baidu.ui.get = function(element/*, type*/){
    var buid;

    //如果是string，则按照guid来找
    if(baidu.lang.isString(element)){
        return baidu.lang.instance(element);
    }else{
        /*
         *type = type.toLowerCase();
         */
        do{
            //如果元素是document
        	//加上了!element判断,防止游离节点的父节点为null的情况  rocy@2010-08-05
            if(!element || element.nodeType == 9){
                return null;
            }
            if(buid = baidu.dom.getAttr(element, "data-guid")){
                     return baidu.lang.instance(buid);
                /*
                 *if( !type || buid.toLowerCase().indexOf(type) === 0){
                 *    return baidu.lang.instance(buid);
                 *}
                 */
            }
        }while((element = element.parentNode) != document.body)
    }
};




/* BASE: baidu/dom/getAncestorBy.js */



/**
 * 创建一个鼠标点击触发的colorPicker
 * @name baidu.ui.ColorPicker.ColorPicker$click
 * @author walter
 */
baidu.ui.ColorPicker.extend({
    /**
     * 插件触发方式，默认为点击
     * @param {String} [options.type = 'click'].
     */
    type: 'click',

    /**
     * body点击事件，点击body关闭菜单
     * @param {Object} e 事件.
     */
    bodyClick: function(e) {
        var me = this,
            target = baidu.event.getTarget(e || window.event),
            judge = function(el) {
                return el == me.getTarget();
            };

        //判断如果点击的是菜单或者target则返回，否则直接关闭菜单
        if (!target ||
            judge(target) ||
            baidu.dom.getAncestorBy(target, judge) ||
            baidu.ui.get(target) == me) {
            return;
        }
        me.close();
    }
});

baidu.ui.ColorPicker.register(function(me) {
    if (me.type != 'click') {
        return;
    }

    me._targetOpenHandler = baidu.fn.bind('open', me);
    me._bodyClickHandler = baidu.fn.bind('bodyClick', me);

    me.addEventListener('onload', function() {
        var target = me.getTarget();
        if (target) {
            baidu.on(target, 'click', me._targetOpenHandler);
            baidu.on(document, 'click', me._bodyClickHandler);
        }
    });

    me.addEventListener('ondispose', function() {
        var target = me.getTarget();
        if (target) {
            baidu.un(target, 'click', me._targetOpenHandler);
            baidu.un(document, 'click', me._bodyClickHandler);
        }
    });
});

baidu.ui.Dialog.register(function(me){
    me.addEventListener("onload",function(){

        //默认自动dispose
        if (typeof me.autoDispose == 'undefined' || me.autoDispose) {
            me.addEventListener('onclose', function() {
                me.dispose();
            });
        }
    });
});






/**
 * 根据this.buttons创建dialog下部的buttons
 * butions格式
 * {
 *  name,{baidu.ui.button.Button相同的参数}
 * }
 */
baidu.extend(baidu.ui.Dialog.prototype,{
    
    /**
     * 创建底部按钮
     * @param {Object} option 创建按钮的options
     * @param {String} name 按钮的唯一标识符
     * @return void
     */
    createButton:function(option,name){
        var me = this;
        baidu.extend(option,{
            classPrefix : me.classPrefix + "-" + name,
            skin : me.skin ? me.skin + "-" + name : "",
            element : me.getFooter(),
            autoRender : true,
            parent : me
        });
        var buttonInstance = new baidu.ui.Button(option);
        me.buttonInstances[name] = buttonInstance;
    },
   
    /**
     * 删除底部按钮
     * @param {String} name 按钮的唯一标识符
     * @return void
     */
    removeButton:function(name){
        var me = this,
            button = me.buttonInstances[name];
        if(button){
            button.dispose();
            delete(me.buttonInstances[name]);
            delete(me.buttons[name]);
        }
    }
});
baidu.ui.Dialog.register(function(me){
    //存储button实例
    me.buttonInstances = {};
    me.language = me.language || 'zh-CN';
    
    var accept,cancel,tmpButtons = {},
        language = baidu.i18n.cultures[me.language].language;
    
    accept = {
        'content' : language['ok'],
        'onclick' : function() {
            var me = this,
                parent = me.getParent();
            parent.dispatchEvent('onaccept') && parent.close();
        }
    };
    cancel = {
        'content' : language['cancel'],
        'onclick' : function() {
            var me = this,
                parent = me.getParent();
            parent.dispatchEvent('oncancel') && parent.close();
        }
    };

    //在onLoad时创建buttons
    me.addEventListener("onload",function(){
        switch(me.type){
            case "alert":
                me.submitOnEnter = me.submitOnEnter || true;
                tmpButtons = {accept:accept};
                break;
            case "confirm":
                me.submitOnEnter = me.submitOnEnter || true;
                tmpButtons = {accept:accept,cancel:cancel};
                break;
            default:
        }
        me.buttons = baidu.extend(tmpButtons,me.buttons || {});
        baidu.object.each(me.buttons,function(opt, name){
            me.createButton(opt,name);
        });

        //注册ontener事件
        me.submitOnEnter && me.addEventListener('onenter', function(e) {
            me.buttonInstances['accept'].fire('click', e);
        });
    });

    //在dispose时同时dispose buttons
    me.addEventListener("ondispose",function(){
        baidu.object.each(me.buttons,function(opt, name){
            me.removeButton(name);
        });
    });

    //在update时同时update buttons
    me.addEventListener("onupdate",function(){
        baidu.object.each(me.buttons,function(opt, name){
            me.buttonInstances[name] ? me.buttonInstances[name].update(opt) : me.createButton(opt,name); 
        });
    });
});







/**
 * ColorPalette 插件
 * @name baidu.ui.ColorPicker.ColorPicker$more
 * @param {Number} [options.sliderLength = 150] 滑动条长度.
 * @param {String} options.coverImgSrc 调色板背景渐变图片路径.
 * @param {String} options.sliderImgSrc 滑动条背景图片路径.
 * @param {String} [options.titleText = 'More Colors'] 标题文字.
 * @param {Object} [options.dilogOption] 填出对话框配置.
 * @param {Object} [options.more = true] 是否开启插件功能.
 * @author walter
 */
baidu.ui.ColorPicker.extend({

    sliderLength: 150,

    coverImgSrc: '',

    sliderImgSrc: '',

    titleText: 'More Colors',

    dialogOption: {},
    
    more: true,
    /**
     * 生成调色板对话框
     * @private
     */
    _createColorPaletteDialog: function() {
        var me = this;
        me.colorPaletteDialog = new baidu.ui.Dialog(baidu.object.extend({
            titleText: me.titleText,
            height: 180,
            width: 360,
            modal: true,
            type: 'confirm',
            onaccept: function() {
                me.dispatchEvent('onchosen', {
                    color: me.colorPalette.hex
                });
            },
            onclose: function(){
                me.colorPalette._onPadDotMouseUp();
            },
            draggable: true,
            autoDispose: false,
            autoOpen: false,
            autoRender: true
        }, me.dialongOption || {}));
    },

    /**
     * 生成复杂调色板
     * @private
     */
    _createColorPalette: function() {
        var me = this;
        me.colorPalette =
            baidu.ui.create(baidu.ui.ColorPalette, {
                autoRender: true,
                sliderLength: me.sliderLength,
                coverImgSrc: me.coverImgSrc,
                sliderImgSrc: me.sliderImgSrc,
                element: me.colorPaletteDialog.getContent()
            });
    }
});

baidu.ui.ColorPicker.register(function(me) {
    if(!me.more) return;
    me.addEventListener('onupdate', function() {
        var strArray = [],
            body = me.getBody();
        baidu.ui.create(baidu.ui.Button, {
            content: me.titleText,
            classPrefix: me.getClass('morecolorbutton'),
            autoRender: true,
            element: body,
            onclick: function() {
                me.colorPaletteDialog.open();
            }
        });
        me._createColorPaletteDialog();
        me._createColorPalette();
    });
});

/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/Combox.js
 * author: rocy
 * version: 1.0.0
 * date: 2010-12-17
 */


/* BASE: baidu/event/preventDefault.js */
/* BASE: baidu/dom/getAncestorByTag.js */

/**
 * @class  Menubar 下拉菜单
 * @param {Object} [options]                             配置选项
 * @param {String} [options.width = '200']               选项宽度
 * @param {String} [options.height]                      选项高度
 * @param {Number} [options.zIndex = 1200]               菜单zIndex
 * @param {String} [options.position = 'bottomCenter']   相对位置
 * @param {Object} [options.data]                        数据项
 * @param {Number} [options.hideDelay = 300]             鼠标移出子菜单多长时间，菜单消失
 * @param {Function} [options.toggle]                    开关函数,返回false时不显示
 */
baidu.ui.Menubar = baidu.ui.createUI(function(options){
    var me = this;
    me.items = {};//建立数据索引存储区
    me.data = options.data || [];
    me._initialized = false; //判断是否已经初始化
    me.dispatchEvent("oninit");
}).extend(
    /**
     *  @lends baidu.ui.Menubar.prototype
     */
{
    uiType: "menubar",
    width: 200,//这个地方不要写成字符串
    height: '',
    zIndex: 1200,
    hideDelay: 300,
    position: 'bottomCenter',
    tplBody: '<div id="#{id}" class="#{class}">#{content}</div>',
    tplBranch: '<ul id="#{ulId}">#{subitems}</ul>',
    tplItem: '<li onmouseover="#{onmouseover}" onmouseout="#{onmouseout}"><a href="#" id="#{id}" class="#{class}" onclick="#{onclick}" title="#{title}">#{content}</a>#{branch}</li>',
    tplContent: '<span class="#{contentClass}">#{content}</span>',
    tplArrow: '<span class="#{arrow}"></span>',
	/**
	 * @private
	 */
    toggle: function(){return true},
    posable: true,
    
    /**
     * 获取Menubar组件的HTML String
	 * @private
     * @return {String}
     */
    getString: function(){
        var me = this;
        return baidu.string.format(me.tplBody, {
            id: me.getId(),
            "class": me.getClass(),
            guid: me.guid,
            content: me.getItemsString(me.data, 0)
        });
    },
    
    /**
     * 生成items字符串
	 * @private
     * @param {Object} items 数据
     * @param {String} branchId 条目ID
     * @return {String}
     */
    getItemsString: function(items, branchId){
        var me = this,
            htmlArr = [];
        baidu.array.each(items, function(itemData, idx){
            var itemArr = [],
                itemId = branchId + '-' + idx;
            me.items[itemId] = itemData;//建立数据索引，方便查找item数据
                itemArr.push(baidu.string.format(me.tplContent, {
                contentClass : me.getClass("content"),
                content : itemData.content || itemData.label
            }));

            if (itemData.items) {
                itemArr.push(baidu.string.format(me.tplArrow, {
                    arrow: me.getClass("arrow")
                }));
            }

            htmlArr.push(baidu.string.format(me.tplItem, {
                id: me.getItemId(itemId),
                "class": (itemData.disabled ? (me.getClass("item") + ' ' + me.getClass("item-disabled")) : me.getClass("item")),
                onclick: me.getCallRef() + ".itemClick('"+itemId+"', event);",
                onmouseover: itemData.disabled || me.getCallRef() + ".itemMouseOver(event, '" + itemId + "')",
                onmouseout: itemData.disabled || me.getCallRef() + ".itemMouseOut(event, '" + itemId + "')",
                content: itemArr.join(''),
                branch: itemData.items ? me.getItemsString(itemData.items, itemId) : '',
                title: itemData.title
            }));
        });
        
        return baidu.string.format(me.tplBranch, {
            ulId: me.getBranchId(branchId),
            subitems: htmlArr.join('')
        });
    },
    
    /**
     * 渲染menubar
     * @param {HTMLElement} target 目标元素
     */
    render: function(target){
        var me = this;
        target = baidu.g(target);
        if(target){
            me.targetId = target.id || me.getId("target");
        }
        me.renderMain();
        me.dispatchEvent("onload");
    },
    
    /**
     * 单个条目被点击时触发
     * @param {String} idx item索引
     * @param {Event} evt 浏览器的事件对象
     */
    itemClick: function(idx, evt){
        var me = this;
        baidu.event.preventDefault(evt || window.event);
        me._close();
        me.dispatchEvent("onitemclick", me.getItemEventData(idx));
    },
    
    /**
     * 事件触发数据
     * @param {String} idx item索引
     * @return {Object}   item对象
     */
    getItemEventData: function(idx){
        return {
            value: this.getItemData(idx),
            index: idx
        };
    },
    
    /**
     * 单个条目mouseover的响应
     * @param {Object} idx     索引
     */
    itemMouseOver: function(evt, idx){
        var me = this,
            target = baidu.event.getTarget(evt),
            itemData = me.getItemData(idx), 
            itemDom = me.getItem(idx),
            subItem;
        baidu.dom.addClass(itemDom, me.getClass("item-hover"));
        if(itemData.items){//如果有子菜单，先运算子菜单的打开位置
            subItem = baidu.dom.g(me.getBranchId(idx));
            if(subItem.style.display == 'none'){
                baidu.dom.show(subItem);
                target.tagName.toUpperCase() != 'LI' && (target = baidu.dom.getAncestorByTag(target, 'LI'));//如果换了tplItem这里就会有问题;
                me.setPositionByElement(target, subItem, {
                    position: 'rightCenter',
                    once: true
                });
            }
        }
        itemData.showing = true;//记录显示状态，为延迟关闭功能使用
        me.dispatchEvent("onitemmouseover", me.getItemEventData(idx));
    },
    
    /**
     * 单个条目mouseout的响应
     * @param {Object} idx item索引
     */
    itemMouseOut: function(evt, idx){
        var me = this,
            target = baidu.event.getTarget(evt),
            itemData = me.getItemData(idx), 
            itemDom = me.getItem(idx);
        baidu.dom.removeClass(me.getItem(idx), me.getClass("item-hover"));
        itemData.showing = false;
        clearTimeout(itemData.outListener);
        itemData.outListener = setTimeout(function(){ //延迟关闭菜单
            if (!itemData.showing) {
                itemData.items && baidu.dom.hide(me.getBranchId(idx));
                me.dispatchEvent("onitemmouseout", me.getItemEventData(idx));
            }
        }, me.hideDelay);
    },
    
    /**
     * 更新menubar
     * @param {Object} options    选项
     */
    update: function(options){
        var me = this, 
            main = me.getMain(), 
            target = me.getTarget();
        options && baidu.object.extend(me, options);
        main.innerHTML = me.getString();
        
        me.dispatchEvent("onupdate");
        
        baidu.dom.setStyle(main, 'z-index', me.zIndex);
        
        var body = me.getBody();
        baidu.dom.setStyles(body, {
            height: me.height,
            width: me.width
        });
        
        baidu.dom.setStyle(me.getBranchId(0), 'width', me.width);
        baidu.dom.addClass(me.getBranchId(0), me.getClass('root'));
        
        baidu.object.each(me.items, function(item, key){
            if (item.items) {//判断是否有子菜单
                baidu.dom.setStyles(me.getBranchId(key), {
//                    left: me.width,//这句运算子标签的出现位置
                    width: me.width,
                    position: 'absolute',
                    display: 'none'
                });
            }
        });
                       
        if (target) {
            me.setPositionByElement(target, me.getMain(), {
                position: me.position,
                once: true
            });
        }
    },
    
    /**
     * 获取条目的元素id
     * @param {Number} idx 索引值
     * @return {String} id    获取item的id
     */
    getItemId: function(idx){
        return this.getId("item-" + idx);
    },
    
    /**
     * 获取子菜单容器id
     * @param {Object} idx item索引
     */
    getBranchId: function(idx){
        return this.getId("branch-" + idx);
    },
    
    /**
     * 获取指定索引值的页面元素
     * @param {Number} idx     索引
     * @return {HTMLElement} dom节点
     */
    getItem: function(idx){
        return baidu.g(this.getItemId(idx));
    },
    
    /**
     * 获取条目数据
     * @param {Number} idx 条目索引
     * @return {Object} 条目对应数据
     */
    getItemData: function(idx){
        return this.items[idx];
    },
    
    /**
     * 打开menubar
     */
    open: function(){
        var me = this,
            target = me.getTarget(),
            body = me.getBody(),
            showing;
        if (baidu.lang.isFunction(me.toggle) && !me.toggle()) {
            return;
        }
        if (!me.dispatchEvent("onbeforeopen")) 
            return;
        if (showing = baidu.ui.Menubar.showing) {
            showing.close();
        }
        body && (body.style.display = '');
        if (!me._initialized) {//如果已经初始化就不再重复update
            me.update();
            me._initialized = true;
        }else{
            if(target){
                me.setPositionByElement(target, me.getMain(), {
                    position: me.position,
                    once: true
                });
            }
        }
        me.dispatchEvent("onopen");
        baidu.ui.Menubar.showing = me;
    },
    
    /**
     * 关闭menubar
     */
    close: function(){
        var me = this,
            body = me.getBody();
        if (!body) 
            return;
        
        if (me.dispatchEvent("onbeforeclose")) {
            me._close();
            me.dispatchEvent("onclose");
        }
    },
   
    _close: function(){
        var me = this,
            body = me.getBody();
        
        baidu.ui.Menubar.showing = null;
        body.style.display = 'none';
    },

    /**
     * 销毁Menubar
     */
    dispose: function(){
        var me = this;
        me.dispatchEvent("ondispose");
        me.getMain() && baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    },
    
    /**
     * 获取target元素
     * @return {HTMLElement} HTML元素
     */
    getTarget: function(){
        return baidu.g(this.targetId);
    }
});













/**
 * 创建一个鼠标点击触发的menubar
 */
baidu.ui.Menubar.extend({
    /**
     * 插件触发方式，默认为点击
     * @param {String} [options.type = 'click']
     */
    type: 'click',
    
    /**
     * body点击事件，点击body关闭菜单
     * @param {Object} e 事件
     */
    bodyClick: function(e){
        var me = this;
        var target = baidu.event.getTarget(e || window.event),
            judge = function(el){
                return el == me.getTarget();
            };

        //判断如果点击的是菜单或者target则返回，否则直接关闭菜单
        if (!target || judge(target) || baidu.dom.getAncestorBy(target, judge) || baidu.ui.get(target) == me) 
            return;
        me.close();
    }
});

baidu.ui.Menubar.register(function(me){
    if (me.type == 'click') {
		me.targetOpenHandler = baidu.fn.bind("open", me);
		me.bodyClickHandler = baidu.fn.bind("bodyClick", me);
		
        me.addEventListener('onload', function(){
            var target = me.getTarget();
            if (target) {
                baidu.on(target, 'click', me.targetOpenHandler);
                baidu.on(document, 'click', me.bodyClickHandler);
            }
        });
        
        me.addEventListener("ondispose", function(){
            var target = me.getTarget();
            if (target) {
                baidu.un(target, 'click', me.targetOpenHandler);
                baidu.un(document, 'click', me.bodyClickHandler);
            }
        });
    }
});












 /**
 * combox类
 * @class Combox类
 * @param  {Object}               [options]        选项，用于创建combox。
 * @config {Element}              target           combox的触发元素
 * @config {Number|String}        width            宽度值。当指定element时，默认为element宽度；否则不设置（可以通过css指定）。
 * @config {Number|String}        height           高度值。当指定element时，默认为element宽度；否则不设置（可以通过css指定）。
 * @config {String}               skin             自定义样式前缀
 * @config {Boolean}              editable         是否可以输入
 * @config {Array}                data             储存combox每个条目的数据。每个条目数据格式: { content: 'some html string', value : ''}。
 * @config {Array|Object}         offset           偏移量，若为数组，索引0为x方向，索引1为y方向; 若为Object，键x为x方向，键y为y方向。单位：px，默认值：[0,0]。
 * @config {Number}               zIndex           浮起combox层的z-index值，默认为1200。
 * @config {Function}             onitemclick      combox中单个条目鼠标点击的回调函数，参数:{data : {value: Item对应的数据, index : Item索引值}}
 * @config {Function}             onitemclick      combox中单个条目鼠标点击的回调函数，function(evt){}，evt.index返回item的索引，evt.value返回一个json，{content: '', value: ''}
 * @config {Function}             onbeforeclose    关闭之前触发
 * @config {Function}             onclose          关闭时触发
 * @config {Function}             onbeforeopen     打开之前触发
 * @config {Function}             onopen           打开时触发
 * @config {Function}             onmouseover      悬停时触发
 * @config {Function}             onmouseout       离开时触发
 * @config {Function}             onmousedown      鼠标按下时触发
 * @config {Function}             onmouseup        鼠标抬起时触发
 * @plugin statable 状态插件
 * @plugin select   通过select控件的数据创建combox     
 */
baidu.ui.Combox = baidu.ui.createUI(function (options){
  var me = this;
  me.data = me.data || [];
  me.menu = me.menu || false; //下拉menu,用于判断menu是否已存在
}).extend(
    /**
     *  @lends baidu.ui.Combox.prototype
     */
{
    uiType: "combox",
    editable: true,
    width: '',
    height: '',
    zIndex: 1200,
    statable: true,
    posable: true,

    /**
     * 过滤方法
	 * @public
     * @param {String} filterStr 需检索的字符串值
     * @param {Array} data 目标数据
     */
    filter: function(filterStr,data){
        var ret = [];
        baidu.array.each(data || this.data, function(dataItem){
            var strIndex = String(dataItem.value || dataItem.content).indexOf(filterStr);
            if (strIndex >= 0) {
                ret.push(dataItem);
            } 
        });
        return ret;
    },

    tplBody : ['<div id="#{id}" class="#{class}" #{stateHandler}>',
                    '<input id="#{inputid}" class="#{inputClass}" autocomplete="off" readOnly="readOnly"/>',
                    '<span id="#{arrowid}" class="#{arrowClass}"></span>',
               '</div>'].join(''),

    /**
     * 生成combox的html字符串代码
     * @private
     * @return {String} 生成html字符串
     */
    getString: function(){
        var me = this;
        return baidu.format(me.tplBody, {
            id: me.getId(),
            "class": me.getClass(),
            inputClass: me.getClass('input'),
            arrowClass: me.getClass('arrow'),
            inputid: me.getId("input"),
            arrowid: me.getId("arrow"),
            stateHandler: me._getStateHandlerString()
        });
    },

    /**
     * 渲染控件
     * @public
     * @param {Object} target 目标渲染对象
     */
    render: function(target){
        var me = this;
        if(me.getMain()){
            return ;
        }
        
        me.dispatchEvent("onbeforerender");
        baidu.dom.insertHTML(me.renderMain(target || me.target), "beforeEnd", me.getString());
        me._createMenu(); //创建下拉menu
        me._enterTipMode();
        me.position && me.setPosition(me.position, target);
        me.dispatchEvent("onload");
    },

    /**
     * 给input添加keyup、focus事件，当触发事件，下拉框弹出相关项
     * @private
     */
    _enterTipMode : function(){
        var me = this, 
            input = me.getInput();
        me._showMenuHandler = baidu.fn.bind(function(){
            var me = this;
            var input = me.getInput();
            me.menu.open();
            me.menu.update({//如果开启input可编辑模式，则智能筛选数据
                data: me.editable ? me.filter(input.value, me.data) : me.data
            });
        }, me);
        
        baidu.on(input, "focus", me._showMenuHandler);
        if(me.editable){
            input.readOnly = '';
            baidu.on(input, "keyup", me._showMenuHandler);
        }
    },

    /**
     * 创建下拉菜单
     * @private
     * @return {baidu.ui.Menubar} Menubar对象
     */
    _createMenu : function(){
        var me = this,
            body = me.getBody(),
            arrow = me.getArrow(),
            menuOptions = {
                width: me.width || body.offsetWidth,
                onitemclick: function(data){
                    me.chooseItem(data);
                },
                element: body,
                autoRender: true,
                data: me.data,
                onbeforeclose: me.onbeforeclose,
                onclose: me.onclose,
                onbeforeopen: me.onbeforeopen,
                onopen: me.onopen
            };
                 
        me.menu = baidu.ui.create(baidu.ui.Menubar, menuOptions);
        me.menu.close(true);
        
        me._showAllMenuHandler = baidu.fn.bind(function(){
            var me = this;
            me.menu.open();
            me.menu.update({
                data: me.data
            });
        }, me);
        baidu.on(arrow, 'click', me._showAllMenuHandler);
        return me.menu;
    },

    /**
     * 获取input元素
     * @return {HTMLElement} input元素
     */
    getInput : function(){
        return baidu.g(this.getId("input"));
    },

    /**
     * 获取下拉箭头元素
     * @return {HTMLElement} arrow元素
     */
    getArrow : function(){
        return baidu.g(this.getId("arrow"));
    },

    /**
     * 响应条目被选择,并发出 onitemclick 事件
     * @param {Object} data 选中的数据
     */
    chooseItem : function(data){
        var me = this;
        me.getInput().value = data.value.content;
        me.dispatchEvent('onitemclick', data);
    },

    /**
     * 设置input的值
     * @param {String} value 值
     */
    setValue:function(value){
        this.getInput().value = value;
    },

    /**
     * 销毁Combox
     * @public
     */
    dispose: function(){
        var me = this;
        baidu.un(me.getInput(), 'keyup', me._showMenuHandler);
        baidu.un(me.getInput(), 'focus', me._showMenuHandler);
        baidu.un(me.getArrow(), 'click', me._showAllMenuHandler);
        me.menu && me.menu.dispose();
        me.getMain() && baidu.dom.remove(me.getMain());
        me.dispatchEvent('ondispose');
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

/**
 * select 插件
 * @param   {Object}            [options]   参数对象
 * @config  {Element|String}    select      select对象的id或者element本身
 * @config  {String}            type        启动插件参数，设置为'select'
 * @author  
 */
baidu.ui.Combox.register(function(me){
    var select = me.select = baidu.dom.g(me.select),
        pos;
    if(!select
        || me.type.toLowerCase() != 'select'
        || select.tagName.toUpperCase() != 'SELECT'){return;}
    me.addEventListener('beforerender', function(){
        baidu.array.each(select.options, function(item){
            me.data.push({value: (item.value || item.innerHTML), content: item.innerHTML});
        });
        pos = baidu.dom.getPosition(select);
        me.position = {x: pos.left, y: pos.top};
        select.style.display = 'none';
        me.addEventListener('itemclick', function(data){
            select.value = data.value.value || data.value.content;
        });
    });
});
/**
 * 提供enable、disable行为
 */
baidu.ui.Combox.register(function(me){
 
    me.addEventListener('onenable', function(){
        var input = me.getInput();
            
        baidu.on(me.getArrow(), 'click', me._showAllMenuHandler);
        baidu.on(input, "focus", me._showMenuHandler);
        
        if(me.editable){
            input.readOnly = '';
            baidu.on(input, "keyup", me._showMenuHandler);
        }    
    });
	
    me.addEventListener('ondisable', function(){
        var input = me.getInput();

        baidu.un(input, "keyup", me._showMenuHandler);
        baidu.un(input, "focus", me._showMenuHandler);
        baidu.un(me.getArrow(), 'click', me._showAllMenuHandler);
        
        input.readOnly = 'readOnly';
    });
});

/* BASE: baidu/object/merge.js */

/*
 * popup基类，建立一个popup实例，这个类原则上不对外暴露
 * reference: http://docs.jquery.com/UI/Popup (Popup in jquery)
 */

 /**
 * popup基类，建立一个popup实例
 * @class
 * @param     {Object}             options               选项
 * @config    {DOMElement}         content               要放到popup中的元素，如果传此参数时同时传contentText，则忽略contentText。
 * @config    {String}             contentText           popup中的内容
 * @config    {String|Number}      width                 内容区域的宽度。注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
 * @config    {String|Number}      height                内容区域的高度
 * @config    {String|Number}      top                   popup距离页面上方的距离
 * @config    {String|Number}      left                  popup距离页面左方的距离
 * @config    {String}             classPrefix           popup样式的前缀
 * @config    {Number}             zIndex                popup的zIndex值
 * @config    {Function}           onopen                popup打开时触发
 * @config    {Function}           onclose               popup关闭时触发
 * @config    {Function}           onbeforeclose         popup关闭前触发，如果此函数返回false，则组织popup关闭。
 * @config    {Function}           onupdate              popup更新内容时触发
 * @config    {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭popup
 * @config    {String}             closeText             closeButton模块提供支持，关闭按钮上的文字
 * @config    {Boolean}            modal                 modal模块支持，是否显示遮罩
 * @config    {String}             modalColor            modal模块支持，遮罩的颜色
 * @config    {Number}             modalOpacity          modal模块支持，遮罩的透明度
 * @config    {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
 * @config    {Boolean}            draggable             draggable模块支持，是否支持拖拽
 * @config    {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
 * @config    {Function}           ondrag                draggable模块支持，拖拽过程中触发
 * @config    {Function}           ondragend             draggable模块支持，拖拽结束时触发
 * @plugin    smartCover                                 智能遮罩
 * @remark
 * @return {baidu.ui.Popup}                                    Popup类
 */

baidu.ui.Popup = baidu.ui.createUI(function (options){
}).extend(
    /**
     *  @lends baidu.ui.Popup.prototype
     */
{
    //ui控件的类型，传入给UIBase **必须**
    uiType            : "popup",
   //ui控件的class样式前缀 可选
    //classPrefix     : "tangram-popup-",

    width           : '',
    height          : '',

    top             : 'auto',
    left            : 'auto',
    zIndex          : 1200,//没有做层管理
    //content         : null,//dom节点
    contentText     : '',

    //onopen          : function(){},
    /**
     * @private
     */
    onbeforeclose   : function(){ return true},
    //onclose         : function(){},
    //onupdate        : function(){},


    tplBody          : "<div id='#{id}' class='#{class}' style='position:relative; top:0px; left:0px;'></div>",

    /**
     * 查询当前窗口是否处于显示状态
     * @public
     * @return    {Boolean}       是否处于显示状态
     */
    isShown : function(){
        return baidu.ui.Popup.instances[this.guid] == 'show';
    },

    /**
     * @private
     */
    getString : function(){
        var me = this;
        return baidu.format(
                me.tplBody, {
                    id      : me.getId(),
                    "class" : me.getClass()
                }
            );
    },

    /**
     * render popup到DOM树
     * @private
     */
    render : function(){
        var me = this,
            main;

        //避免重复render
        if(me.getMain()){
            return ;
        }

        main = me.renderMain();
        
        main.innerHTML = me.getString();

        me._update(me);

        baidu.dom.setStyles(me.getMain(), {
            position    : "absolute",
            zIndex      : me.zIndex,
            marginLeft  : "-100000px"
        });
        
        me.dispatchEvent("onload");

        return main;
    },

    /**
     * 显示当前popup
     * @public
     * @param  {Object}             options               选项参数
     * @config {DOMElement}         content               要放到popup中的元素，如果传此参数时同时传contentText，则忽略contentText。
     * @config {String}             contentText           popup中的内容
     * @config {String|Number}      width                 内容区域的宽度。注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
     * @config {String|Number}      height                内容区域的高度
     * @config {String|Number}      top                   popup距离页面上方的距离
     * @config {String|Number}      left                  popup距离页面左方的距离
     * @config {String}             classPrefix           popup样式的前缀
     * @config {Number}             zIndex                popup的zIndex值
     * @config {Function}           onopen                popup打开时触发
     * @config {Function}           onclose               popup关闭时触发
     * @config {Function}           onbeforeclose         popup关闭前触发，如果此函数返回false，则组织popup关闭。
     * @config {Function}           onupdate              popup更新内容时触发
     * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭popup
     * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的文字
     * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
     * @config {String}             modalColor            modal模块支持，遮罩的颜色
     * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
     * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
     * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
     * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
     * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
     * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
     */
    open : function(options){
        var me = this;

        me._update(options);

        me.getMain().style.marginLeft = "auto";
        
        baidu.ui.Popup.instances[me.guid] = "show";

        me.dispatchEvent("onopen");
    },

    /**
     * 隐藏当前popup
     * @public
     */
    close : function(){
        var me = this;
        if(me.dispatchEvent("onbeforeclose")){
            me.getMain().style.marginLeft = "-100000px";
            baidu.ui.Popup.instances[me.guid] = "hide";
            me.dispatchEvent("onclose");
        }
    },
    
    /**
     * 更新popup状态 
     * @public
     * @param  {Object}             options               选项参数
     * @config {DOMElement}         content               要放到popup中的元素，如果传此参数时同时传contentText，则忽略contentText。
     * @config {String}             contentText           popup中的内容
     * @config {String|Number}      width                 内容区域的宽度。注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
     * @config {String|Number}      height                内容区域的高度
     * @config {String|Number}      top                   popup距离页面上方的距离
     * @config {String|Number}      left                  popup距离页面左方的距离
     * @config {String}             classPrefix           popup样式的前缀
     * @config {Number}             zIndex                popup的zIndex值
     * @config {Function}           onopen                popup打开时触发
     * @config {Function}           onclose               popup关闭时触发
     * @config {Function}           onbeforeclose         popup关闭前触发，如果此函数返回false，则组织popup关闭。
     * @config {Function}           onupdate              popup更新内容时触发
     * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭popup
     * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的文字
     * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
     * @config {String}             modalColor            modal模块支持，遮罩的颜色
     * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
     * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
     * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
     * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
     * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
     * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
     *
     */
    update : function(options){
        var me = this;
        me._update(options);
        me.dispatchEvent("onupdate");
    },
   
    _update: function(options){
         options = options || {};                                                                                                                          
         var me = this, contentWrapper = me.getBody();                                                                                                     
                                                                                                                                                           
         //扩展options属性                                                                                                                                 
         baidu.object.extend(me, options);                                                                                                                 
                                                                                                                                                           
         //更新内容                                                                                                                                        
         if(options.content){                                                                                                                              
             //content优先                                                                                                                                 
             if(contentWrapper.firstChild != options.content){                                                                                             
                 contentWrapper.innerHTML = "";                                                                                                            
                 contentWrapper.appendChild(options.content);                                                                                              
             }                                                                                                                                             
         }else if(options.contentText){                                                                                                                    
             //建议popup不要支持text                                                                                                                       
             contentWrapper.innerHTML = options.contentText;                                                                                               
         }                                                                                                                                                 
         me._updateSize();                                                                                                                                 
         me._updatePosition();                                                                                                                             
    },

    /**
     * 更新大小,子类可以通过同名方法覆盖;
     * 默认实现为使用参数的width和height赋值
     */
    //[Interface]
    _updateSize : function(){
        var me = this;
        baidu.dom.setStyles(me.getMain(), { width : me.width, height : me.height});
    },
    /**
     * 更新位置,子类可以通过同名方法覆盖;
     * 默认实现为使用参数的top和left赋值
     */
    //[Interface]
    _updatePosition : function(){
        var me = this;
        baidu.dom.setStyles(me.getMain(), { top : me.top, left : me.left});
    },
    /**
     * 销毁控件
     * @public
     */
    dispose : function(){
        var me = this;
        me.dispatchEvent("ondispose");
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

baidu.ui.Popup.instances = baidu.ui.Popup.instances || [];





baidu.extend(baidu.ui.Popup.prototype,{
    coverable: true,
    coverableOptions: {}
});

baidu.ui.Popup.register(function(me){

    if(me.coverable){

        me.addEventListeners("onopen,onload", function(){
            me.Coverable_show();
        });

        me.addEventListener("onclose", function(){
            me.Coverable_hide();
        });

        me.addEventListener("onupdate",function(){
            me.Coverable_update();
        });
    }
});












/* BASE: baidu/browser/isStrict.js */




/**
 * 创建一个日历对象绑定于一个input输入域
 * @name baidu.ui.DatePicker
 * @class
 * @param {Object} options config参数
 * @config {Number} width 日历组件的宽度
 * @config {Number} height 日历组件的高度
 * @config {String} format 日历组件格式化日历的格式，默认：yyyy-MM-dd
 * @config {Object} popupOptions Picker组件的浮动层由Popup组件渲染，该参数用来设置Popup的属性，具体参考Popup
 * @config {Object} calendarOptions Picker组件的日历由Calendar组件渲染，该参数来用设置Calendar的属性，具体参考Calendar
 * @config {Function} onpick 当选中某个日期时的触发事件
 * @config {String} language 当前语言，默认为中文
 */
baidu.ui.DatePicker = baidu.ui.createUI(function(options){
    var me = this;
    me.format = me.format || baidu.i18n.cultures[me.language].calendar.dateFormat || 'yyyy-MM-dd';
    me.popupOptions = baidu.object.merge(me.popupOptions || {},
        options,
        {overwrite: true, whiteList: ['width', 'height']});
    me.calendarOptions = baidu.object.merge(me.calendarOptions || {},
        options,
        {overwrite: true, whiteList: ['weekStart']});
    me._popup = new baidu.ui.Popup(me.popupOptions);
    me._calendar = new baidu.ui.Calendar(me.calendarOptions);
    me._calendar.addEventListener('clickdate', function(evt){
        me.pick(evt.date);
    });
}).extend(
/**
 *  @lends baidu.ui.DatePicker.prototype
 */
{
    uiType: 'datePicker',

    language: 'zh-CN',
    
    /**
     * 取得从input到得字符按format分析得到的日期对象
     * @private
     */
    _getInputDate: function(){
        var me = this,
            patrn = [/yyyy|yy/, /M{1,2}/, /d{1,2}/],//只支持到年月日的格式化，需要时分秒的请扩展此数组
            key = [],
            val = {},
            count = patrn.length,
            i = 0,
            regExp;
        for(; i < count; i++){
            regExp = patrn[i].exec(me.format);
            key[i] = regExp ? regExp.index : null;
        }
        me.input.value.replace(/\d{1,4}/g, function(mc, index){
            val[index] = mc;
        });
        for(i = 0; i < key.length; i++){
            key[i] = val[key[i]];
            if(!key[i]){return;}
        }
        return new Date(key[0], key[1] - 1, key[2]);//需要时分秒的则扩展参数
    },
    
    /**
     * 鼠标点击的事件侦听器，主要用来隐藏日历
     * @private
     */
    _onMouseDown: function(evt){
        var me = this,
            popup = me._popup,
            target = baidu.event.getTarget(evt);
        if(target.id != me.input.id
            && !baidu.dom.contains(popup.getBody(), target)){
            me.hide();
        }
    },
    
    /**
     * 渲染日期组件到body中并绑定input
     * @param {HTMLElement} target 一个input对象，该input和组件绑定
     */
    render: function(target){
        var me = this,
            focusHandler = baidu.fn.bind('show', me),
            mouseHandler = baidu.fn.bind('_onMouseDown', me),
            keyHandler = baidu.fn.bind('hide', me),
            input = me.input = baidu.dom.g(target),
            popup = me._popup;
        if(me.getMain() || !input){
            return;
        }
        popup.render();
        me._calendar.render(popup.getBody());
        me.on(input, 'focus', focusHandler);
        me.on(input, 'keyup', keyHandler);
        me.on(document, 'click', mouseHandler);
    },
    
    /**
     * 当点击某个日期时执行pick方法来向input写入日期
     * @param {Date} date 将日期写到input中
     */
    pick: function(date){
        var me = this;
        me.input.value = baidu.date.format(date, me.format);
        me.hide();
        me.dispatchEvent('pick');
    },
    
    /**
     * 显示日历
     */
    show: function(){
        var me = this,
            pos = me.input && baidu.dom.getPosition(me.input),
            popup = me._popup,
            calendar = me._calendar,
            doc = document[baidu.browser.isStrict ? 'documentElement' : 'body'],
            inputHeight = me.input.offsetHeight,
            popupHeight = me._popup.getBody().offsetHeight;
        me._calendar.setDate(me._getInputDate() || calendar._toLocalDate(new Date()));
        me._calendar.renderTitle();
        me._calendar._renderDate();
//        me._calendar.update({initDate: me._getInputDate() || calendar._toLocalDate(new Date())});
        pos.top += (pos.top + inputHeight + popupHeight - doc.scrollTop > doc.clientHeight) ? -popupHeight
            : inputHeight;
        me._popup.open(pos);
    },
    
    /**
     * 隐藏日历
     */
    hide: function(){
        this._popup.close();
    },
    
    /*
     * 析构函数
     */
    dispose: function(){
        var me = this;
        me.dispatchEvent('dispose');
        me._calendar.dispose();
        me._popup.dispose();
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

/**
 * 装饰器控件基类
 * @name baidu.ui.Decorator
 * @class
 */

baidu.ui.Decorator = baidu.ui.createUI(function(options){

}).extend({
    uiType : "decorator",

    type: 'box',

    //装饰器模板
    tpl : {
        "box" : "<table cellspacing='0' cellpadding='0' border='0' id='#{id}'>" + 
                "<tr>" + 
                "<td #{class}></td>" + 
                "<td #{class}></td>" + 
                "<td #{class}></td>" +
                "</tr>" + 
                "<tr>" + 
                //在ie中若td为空，当内容缩小时，td高度缩不去
                "<td #{class}><i style='visibility:hidden'>&nbsp;</i></td>" + 
                "<td #{class} id='#{innerWrapId}' valign='top'></td>" + 
                "<td #{class}><i style='visibility:hidden'>&nbsp;</i></td>" + 
                "</tr>" + 
                "<tr>" + 
                "<td #{class}></td>" + 
                "<td #{class}></td>" + 
                "<td #{class}></td>" + 
                "</tr>" + 
                "</table>"
    },

    //装饰器模板的Class填充列表
    tplClass : {
        "box" : ['lt', 'ct', 'rt', 'lc', 'cc', 'rc', 'lb', 'cb', 'rb']
    },

    /**
     * 获得装饰器内部ui的body元素
     */
    getInner : function(){
        return baidu.g(this.innerId);
    },
    
    getBox:function(){
        return baidu.g(this.getId('table'));
    },

    /**
     * 获得装饰器内部ui的main元素的外包装
     */
    _getBodyWrap : function(){
        return baidu.g(this.getId("body-wrap"));
    },

    /**
     *
     * 渲染装饰器
     *
     * 2010/11/15 调整实现方式，新的实现不会修改ui原来的main元素
     */
    render : function(){
        var me = this,
            decoratorMain = document.createElement('div'),
            uiMain = me.ui.getMain(),
            style = uiMain.style,
            ruleCount = 0;

        document.body.appendChild(decoratorMain);
        me.renderMain(decoratorMain),

        decoratorMain.className = me.getClass(me.type + "-main");

        decoratorMain.innerHTML = baidu.format(
            me.tpl[me.type], {
                id : me.getId('table'),
                'class' : function (value){
                    return "class='" + me.getClass(me.type + "-" + me.tplClass[me.type][ruleCount++]) + "'"
                },
                innerWrapId : me.getId("body-wrap")
            }
        );

        baidu.each(baidu.dom.children(uiMain), function(child){
            me._getBodyWrap().appendChild(child);
        });
        uiMain.appendChild(decoratorMain);

        me.innerId = uiMain.id;
        uiMain.getBodyHolder = me._getBodyWrap();
    }
    
});








baidu.ui.Dialog.register(function(me){
    if(me.type == "iframe"){
        baidu.extend(me,{
            autoRender : true,
            tplIframe: "<iframe width='100%' height='97%' frameborder='0' scrolling='no' name='#{name}' id='#{id}' class='#{class}'></iframe>",

            /**
             * 获取iframe
             * @public
             * @return {HTMLElement} iframe
             */
            getIframe: function(){
                return baidu.g(this.getId('iframe'));
            }
        });
        
        var contentText,
            iframeId = me.getId('iframe'),
            iframeName = me.iframeName || iframeId,
            iframeElement,
            contentWindow,
            contentText = baidu.format(me.tplIframe,{
                name: iframeName,
                id: iframeId,
                'class': me.getClass('iframe')
            });

        me.addEventListener("onload",function(){
            me._update({contentText:contentText});
            me._updatePosition();
            iframeElement = baidu.g(iframeId);
    
            //解决iframe加载后无法准确定位dialog的问题
            baidu.on(iframeElement, 'onload', function() {
                //同域则获取被包含页的高度并赋予iframe
                //if(contentWindow = iframeElement.contentWindow){
                //    iframeElement.height = Math.max(contentWindow.document.documentElement.scrollHeight,contentWindow.document.body.scrollHeight) + "px";   
                //}
                me._updatePosition();
                me.dispatchEvent('onupdate');
            });
            iframeElement.src = me.iframeSrc;
        });  
    }
});

/**
 *
 * 键盘支持模块
 * 1. esc 关闭最上层的dialog
 * 2. enter 确认alert和confirm
 */
baidu.extend(baidu.ui.Dialog.prototype,{
    enableKeyboard : true,
    closeOnEscape : true
});
baidu.ui.Dialog.register(function(me){

    baidu.ui.Dialog.keyboardHandler = baidu.ui.Dialog.keyboardHandler || function(e){
        e = window.event || e;
        var keyCode = e.keyCode || e.which, onTop, eachDialog;
        
        //所有操作针对zIndex最大的dialog
        baidu.object.each(baidu.ui.Dialog.instances, function(item, key){
            if(item == "show"){
                eachDialog = baidu.lang.instance(key);
                if(!onTop || eachDialog.zIndex > onTop.zIndex){
                    onTop = eachDialog;
                }
            }
        });
        if(onTop){
            switch (keyCode){
                //esc按键触发
                case 27:
                    onTop.closeOnEscape && onTop.close();
                    break;
                //回车键触发
                case 13:
                    onTop.dispatchEvent("onenter");
                    break;
                default:
            }
        }
    };

    if(me.enableKeyboard && !baidu.ui.Dialog.keyboardEventReady){
        baidu.on(document, "keyup", baidu.ui.Dialog.keyboardHandler);
        baidu.ui.Dialog.keyboardEventReady = true;
    }
    
    //如果一个instance都没有了，才把事件删除
    me.addEventListener("ondispose", function(){
        var noInstance = true;
        baidu.object.each(baidu.ui.Dialog.instances, function(item, key){
            noInstance = false;
            return false;
        });        
        if(noInstance){
            baidu.event.un(document, "keyup", baidu.ui.Dialog.keyboardHandler);
            baidu.ui.Dialog.keyboardEventReady = false;
        }
    });
});

/* BASE: baidu/dom/_styleFixer/opacity.js */


















/* BASE: baidu/dom/fixable.js */







//添加对flash的隐藏和显示
//在webkit中，使用iframe加div的方式遮罩wmode为window的flash会时性能下降到无法忍受的地步
//在Gecko中，使用透明的iframe无法遮住wmode为window的flash
//在其余浏览器引擎中wmode为window的flash会被遮罩，处于不可见状态
//因此，直接将wmode为window的flash隐藏，保证页面最小限度的修改


/**
 * 为控件增加遮罩。
 * @class Modal类
 */


baidu.ui.Modal = baidu.ui.createUI(function(options) {
    var me = this,
        container = (options && options.container) ? baidu.g(options.container) : null;

    !container && (container = document.body);
    if (!container.id) {
        container.id = me.getId('container');
    }

    me.containerId = container.id;
    me.styles = {
        color: '#000000',
        opacity: 0.6,
        zIndex: 1000
    };
    
}).extend(
    /**
     *  @lends baidu.ui.Modal.prototype
     */
{
    uiType: 'modal',
    _showing: false,

    /**
     * 获取modal的Container
     * @public
     * @return {HTMLElement} container.
     */
    getContainer: function() {
        var me = this;
        return baidu.g(me.containerId);
    },

    /**
     * 渲染遮罩层
     * @public
     * @return {NULL}
     * */
    render: function() {
        var me = this,
            modalInstance,
            fixableInstance,
            style,
            main,
            id = me.containerId,
            container = baidu.g(me.containerId);

        //当该container中已经存在modal时
        //将所需参数付给当前的modalInstance
        if (modalInstance = baidu.ui.Modal.collection[id]) {
            me.mainId = modalInstance.mainId;
            main = me.getMain();
        }else {
            //如果不存在modal,则创建新的modal
            main = me.renderMain();
            if (container !== document.body) {
                container.appendChild(main);
            }else{
                fixableInstance = baidu.dom.fixable(main, {
                    autofix: false,
                    vertival: 'top',
                    horizontal: 'left',
                    offset: {x:0, y:0}
                });
            }
            //将参数写入
            baidu.ui.Modal.collection[id] = {
                mainId: me.mainId,
                instance: [],
                flash:{},
                fixableInstance: fixableInstance
            };
        }

        me.dispatchEvent('onload');
    },

    /**
     * 显示遮罩层
     * @public
     * @param  {Object} options     显示选项,任何合法的style属性.
     * @return {NULL}
     */
    show: function(options) {
        var me = this,
            container = me.getContainer(),
            main = me.getMain(),
            containerId = me.containerId,
            modalInstanceOptions = baidu.ui.Modal.collection[containerId],
            fixableInstance = modalInstanceOptions.fixableInstance,
            length = modalInstanceOptions.instance.length,
            lastTop;

        if (me._showing)
            return;

        if (length > 0) {
            lastTop = baidu.lang.instance(modalInstanceOptions.instance[length - 1]);
            lastTop && lastTop._removeHandler();
        }
        options = options || {};
        me._show(options.styles || {});
        if(fixableInstance)
            fixableInstance.render();
        main.style.display = 'block';
      
        //将在此层中隐藏flash入库
        modalInstanceOptions.flash[me.guid] = me._hideFlash();
    
        //将自己的guid加在guid最后
        modalInstanceOptions.instance.push(me.guid);
        me._showing = true;

        me.dispatchEvent('onshow');
    },

    /**
     * 更新遮罩层，绑定window.resize & window.scroll
     * @private
     * @param {Object} styles
     * @return {NULL}
     */
    _show: function(styles) {
        var me = this;

        me._getModalStyles(styles || {});
        me._update();

        if(me.getContainer() === document.body && baidu.browser.ie && baidu.browser.ie <= 7){
            me.windowHandler = me.getWindowHandle();
            baidu.on(window, 'resize', me.windowHandler);
        }
    },

    /**
     * 隐藏遮罩层
     * @public
     * @return {NULL}
     */
    hide: function() {
        var me = this;
        me._hide(); 
        me.dispatchEvent('onhide');
    },

    _hide: function(){
        var me = this,
            containerId = me.containerId,
            modalInstanceOptions = baidu.ui.Modal.collection[containerId],
            flash = modalInstanceOptions.flash[me.guid],
            main = me.getMain(),
            length = modalInstanceOptions.instance.length,
            lastTop;

         if (!me._showing)
             return;

         for (var i = 0; i < length; i++) {
             if (modalInstanceOptions.instance[i] == me.guid) {
                 modalInstanceOptions.instance.splice(i, 1);
                 break;
             }
         }
         length = modalInstanceOptions.instance.length;
         if (i == length) {
             me._removeHandler();
             if (length > 0) {
                 lastTop = baidu.lang.instance(modalInstanceOptions.instance[length - 1]);
                 lastTop && lastTop._show();
             }else {
                 main.style.display = 'none';
             }

             me._restoreFlash(flash);
         }else{
             //如果不是最后一个，就将该层对应的flash移动到下一层的数组中
             lastTop = baidu.lang.instance(modalInstanceOptions.instance[length - 1]);
             modalInstanceOptions.flash[lastTop.guid] = modalInstanceOptions.flash[lastTop.guid].concat(flash);
         }

         modalInstanceOptions.flash[me.guid] = []; 
         me._showing = false;
    },


    /**
     * 接触window.resize和window.scroll上的事件绑定
     * @private
     * @return {NULL}
     */
    _removeHandler: function() {
        var me = this;
        if(me.getContainer() === document.body && baidu.browser.ie && baidu.browser.ie <= 7){
            baidu.un(window, 'resize', me.windowHandler);
        }
    },

    /**
     * window.resize & window.scroll 事件调用的function
     * @public
     * @return {NULL}
     */
    getWindowHandle: function() {
        var me = this,
            main = me.getMain();

        return function() {
            baidu.setStyles(main, {
                width: baidu.page.getViewWidth(),
                height: baidu.page.getViewHeight()
            });
            
            if(me.getContainer() === document.body && baidu.browser.ie && baidu.browser.ie <= 7){
                //iframe 补丁
                window.top !== window.self && setTimeout(function(){
                    me._getModalStyles({});
                    me._update();
                },16);
            }
         };
    },

    /**
     * 更新遮罩层
     * @public
     * @param  {Object} options 显示选项，同show.
     * @return {NULL}
     */
    update: function(options) {
        options = options || {};
        var me = this,
            main = me.getMain(),
            modalInstanceOptions = baidu.ui.Modal.collection[me.containerId];

        options = options || {};
        baidu.extend(me, options);

        me._getModalStyles(options.styles || {});
        me._update();
        delete(options.styles);
        baidu.extend(me, options);

        me.dispatchEvent('onupdate');
    },

    /**
     * 更新样式
     * @private
     * @return {NULL}
     */
    _update: function() {
        var me = this, main = me.getMain();
        baidu.dom.setStyles(main, me.styles);
    },

    /**
     * 获取遮罩层相对container左上角的top和left
     * @private
     * @options {object} show传入的styles
     * @return {NULL}
     */
    _getModalStyles: function(styles) {
        var me = this,
            main = me.getMain(),
            container = me.getContainer(),
            offsetParentPosition,
            parentPosition, offsetParent;

        function getStyleNum(d,style) {
            var result = parseInt(baidu.getStyle(d, style));
            result = isNaN(result) ? 0 : result;
            result = baidu.lang.isNumber(result) ? result : 0;
            return result;
        }

        if (container !== document.body) {
            styles['width'] = container.offsetWidth;
            styles['height'] = container.offsetHeight;

            if (baidu.getStyle(container, 'position') == 'static') {
                offsetParent = main.offsetParent || document.body;
                offsetParentPosition = baidu.dom.getPosition(offsetParent);
                parentPosition = baidu.dom.getPosition(container);
                styles['top'] = parentPosition.top - offsetParentPosition.top + getStyleNum(offsetParent, 'marginTop');
                styles['left'] = parentPosition.left - offsetParentPosition.left + getStyleNum(offsetParent, 'marginLeft');
            }
        }else {
     
            if ( baidu.browser.ie > 7 || !baidu.browser.ie) {
                styles['width'] = '100%';
                styles['height'] = '100%';
            }else {
                styles['width'] = baidu.page.getViewWidth();
                styles['height'] = baidu.page.getViewHeight();
            }
        }

        //更新styles
        baidu.extend(me.styles, styles);
        me.styles['backgroundColor'] = me.styles['color'] || me.styles['backgroundColor'];
        delete(me.styles['color']);
    },

    /**
     * 隐藏flash
     * @private
     * @return {Null}
     */
    _hideFlash: function(){
        var me = this,
            container = me.getContainer(),
            elements = container.getElementsByTagName('object'),
            result = [];

        //只隐藏wmode = window的flash
        baidu.each(elements, function(item){
            var isWinMode = true;
            
            if(baidu.dom.getAncestorBy(item,function(element){
                if(baidu.getStyle(element, 'zIndex') > me.styles.zIndex){
                    return true;
                }
                
                return false;
            })){
                return;
            }

            baidu.each(baidu.dom.children(item), function(param){
                if(baidu.getAttr(param, 'name') == 'wmode' && baidu.getAttr(param, 'value') != 'window'){
                    isWinMode = false;
                }
            });

            if(isWinMode){
                result.push([item,baidu.getStyle(item, 'visibility')]);
                item.style.visibility = 'hidden';
            }
        });

        return result;
    },

    /**
     * 还原flash
     * @private
     * @return {Null}
     */
    _restoreFlash: function(flash){
        baidu.each(flash, function(item){
            if(item[0] != null){
                item[0].style.visibility = item[1];
            }
        });  
    },

    /**
     * 销毁
     * @public
     * @return {Null}
     */
    dispose: function(){
        var me = this;
        
        me._hide();
        me.dispatchEvent('ondispose');
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

//存储所有的modal参数
baidu.ui.Modal.collection = {};

/* BASE: baidu/browser/isWebkit.js */
/* BASE: baidu/browser/isGecko.js */


baidu.extend(baidu.ui.Modal.prototype,{
    coverable: true,
    coverableOptions: {}
});

baidu.ui.Modal.register(function(me){

    if(me.coverable){

        if(!baidu.browser.isWebkit && !baidu.browser.isGecko){
            me.addEventListener("onload", function(){
                me.Coverable_show();
            });

            me.addEventListeners("onshow,onupdate",function(){
                me.Coverable_update();
            });

            me.addEventListener("onhide", function(){
                me.Coverable_hide();
            })
        }
    }
});


baidu.extend(baidu.ui.Dialog.prototype, {
    modal : true,
    modalColor : "#000000",
    modalOpacity : 0.4,
    hideModal : function(){
        var me = this;
        (me.modal && me.modalInstance) && me.modalInstance.hide();
    }
});
baidu.ui.Dialog.register(function(me){
    if(me.modal){
        me.addEventListener("onopen", function(){
            //防止一个dialog创建两个modal
            if(!me.modalInstance){
                me.modalInstance = new baidu.ui.Modal({autoRender:true});
            }

            me.modalInstance.show({
                targetUI    : me,
                styles:{
                    color       : me.modalColor,
                    opacity     : me.modalOpacity,
                    zIndex      : me.modalZIndex ? me.modalZIndex : me.zIndex - 1
                }
            });
        });

        me.addEventListener("onclose", me.hideModal);
        me.addEventListener("ondispose", me.hideModal);
    }
});


//依赖包










/**
 * Input基类，创建一个input实例。
 * @class Input类
 * @param     {String|HTMLElement}     target        存放input控件的元素，input控件会渲染到该元素内。
 * @param     {Object}                 [options]     选项
 * @config    {String}                 text          input文本信息
 * @config    {Boolean}                disabled      控件是否有效，默认为false（有效）。
 * @config    {Function}               onfocus       聚焦时触发
 * @config    {Function}               onblur        失去焦点时触发
 * @config    {Function}               onchage       input内容改变时触发
 * @config    {Function}               onkeydown     按下键盘时触发
 * @config    {Function}               onkeyup       释放键盘时触发
 * @config    {Function}               onmouseover   鼠标悬停在input上时触发
 * @config    {Function}               onmouseout    鼠标移出input时触发
 * @config    {Function}               ondisable     当调用input的实例方法disable，使得input失效时触发。
 * @config    {Function}               onenable      当调用input的实例方法enable，使得input有效时触发。
 * @config    {Function}               ondispose     销毁实例时触发
 * @returns   {Boolean} 是否有效，true(失效)/false(有效)。
 */

baidu.ui.Input = baidu.ui.createUI(new Function).extend(
	/**
     *  @lends baidu.ui.Input.prototype
     */
{
    //ui控件的类型，传入给UIBase **必须**
    uiType            : "input",
    //ui控件的class样式前缀 可选
    //classPrefix     : "tangram-input-",
    tplBody         : '<input id="#{id}" class="#{class}" value="#{text}" onfocus="#{onfocus}" onblur="#{onblur}" onchange="#{onchange}" onkeydown="#{onkeydown}" onkeyup="#{onkeyup}" onmouseover="#{onmouseover}" onmouseout="#{onmouseout}" />',
    disabled		: false,
 
    /**
     * 获得input的HTML字符串。
     * @private
     * @returns {String} HTML字符串
     */
    getString : function(){
        var input = this;
        return baidu.format(input.tplBody, {
				id          : input.getId(),
				onfocus		: input.getCallString("_onFocus"),
				onblur		: input.getCallString("_onBlur"),
				onchange	: input.getCallString("_onChange"),
				onkeydown	: input.getCallString("_onKeyDown"),
				onkeyup		: input.getCallString("_onKeyUp"),
				onmouseover : input.getCallString("_onMouseOver"),
				onmouseout  : input.getCallString("_onMouseOut"),
				text		: input.text,
            	"class"     : input.getClass(input.isDisabled() ? "disable" : "")
        });
    },

    /**
     *  将input绘制到DOM树中。target参数不可省，否则无法渲染。
	 * @public
	 * @param {String|HTMLElement} target 目标渲染对象
     */	
	render : function(target){
		if(!baidu.g(target)){
			return ;
		}
		var input = this;
        baidu.dom.insertHTML(input.renderMain(target), "beforeEnd", input.getString());
        input.getBody().disabled = input.disabled;
	},
	
	_onEventHandle : function(eventName, styleName){
		var input = this;
		if(input.isDisabled()){
			return;
		}
		input._changeStyle(styleName);
		input.dispatchEvent(eventName);
	}, 
	
    /*
     *  聚焦input框时调用。
     */    
	_onFocus : function(){
        this._onEventHandle("onfocus","focus");
	},
    
    /*
     *  失去input框焦点时调用。
     */    
	_onBlur : function(){
        this._onEventHandle("onblur");
	},
	
	/*
     *  input框中内容改变时触发。
     */    
	_onChange : function(){
        this._onEventHandle("onchange");
	},
	
    /*
     *  鼠标按下按钮时调用。
     */ 	
	_onKeyDown : function(){
		this._onEventHandle("onkeydown","focus");
	},

    /*
     *  按钮弹起时调用。
     */ 
	_onKeyUp : function(){
		this._onEventHandle("onkeyup","focus");		
	},
	
    /*
     *  鼠标移出按钮时调用。
     */ 	
	_onMouseOver : function(){
		this._onEventHandle("onmouseover","hover");	
	},	
	
    /*
     *  鼠标移出按钮时调用。
     */ 	
	_onMouseOut : function(){
		this._onEventHandle("onmouseout");			
	},
	
    /*
     *  触发不同事件引起input框样式改变时调用。
     *  style值为normal(tangram-input)、hover(tangram-input-hover)、disable(tangram-input-disable)、focus(tangram-input-focus)
     */ 
	_changeStyle : function(style){
		var input = this,
            body = input.getBody();
		
		baidu.dom.removeClass(
            body,
            input.getClass("hover") + " " + input.getClass("focus") + " " + input.getClass("disable")
        );

		baidu.addClass(body, input.getClass(style));
	},

    /**
     *  判断input是否处于失效状态。
	 * @public
	 * @return {Boolean}    是否处于失效状态
     */ 	
	isDisabled : function(){
		return this.disabled;
	},
	
	/**
     *  获得input文字。
	 * @public 
	 * @return {String}    输入框的文字 
     */
	getText : function(){
		var text = this.getBody().value; 
		return text;
	},
	
	

	_able : function(eventName, isDisabled, styleName){
		var input = this;
		input._changeStyle(styleName);
		input.getBody().disabled = isDisabled;
		input.disabled = isDisabled;
		input.dispatchEvent(eventName);	
	},
	
	/**
     *  使input控件有效。
	 * @public
     */ 
	enable : function(){
		this._able("onenable", false);
	},

    /**
     *  使input控件失效。
	 * @public
     */
	disable : function(){	
		this._able("ondisable", true, "disable");
	},
	
    /**
     *  销毁实例。
	 * @public
     */
	dispose : function(){
		var input = this;
		input.dispatchEvent("ondispose");
		baidu.dom.remove(input.getBody());
		baidu.lang.Class.prototype.dispose.call(input);
	}

});


/**
 * Baidu登陆框
 * */




 
 
 






/**
 * 应用实现 login 备注：涉及passport的API接口参数可以参见http://fe.baidu.com/doc/zhengxin/passport/openapi_help.text
 * @name baidu.ui.Login
 * @class
 * @param  {String|DOMElement}  content               内容或者内容对应的元素
 * @param  {Object}             [options]             选项参数
 * @config {DOMElement}         content               要放到dialog中的元素，如果传此参数时同时传contentText，则忽略contentText。
 * @config {String}             contentText           dialog中的内容
 * @config {String|Number}      width                 内容区域的宽度，注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
 * @config {String|Number}      height                内容区域的高度
 * @config {String|Number}      top                   dialog距离页面上方的距离
 * @config {String|Number}      left                  dialog距离页面左方的距离
 * @config {String}             titleText             dialog标题文字
 * @config {String}             classPrefix           dialog样式的前缀
 * @config {Number}             zIndex                dialog的zIndex值
 * @config {Function}           onopen                dialog打开时触发
 * @config {Function}           onclose               dialog关闭时触发
 * @config {Function}           onbeforeclose         dialog关闭前触发，如果此函数返回false，则组织dialog关闭。
 * @config {Function}           onupdate              dialog更新内容时触发 * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭dialog。 * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的title。
 * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
 * @config {String}             modalColor            modal模块支持，遮罩的颜色
 * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
 * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
 * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
 * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
 * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
 * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
 * @config {Boolean}            [autoOpen]            是否一开始就打开，默认为true
 * @config {String}             loginURL              登陆地址,无须改动
 * @config {String}             regURL                注册地址,无须改动
 * @config {String}             loginJumpURL          登陆跳转地址,必须，为提交表单跨域使用，可前往 http://fe.baidu.com/~zhengxin/passport/jump.html  下载，或者线上 http://passport.baidu.com/jump.html 
 * @config {String}             regJumpURL            注册跳转地址,必须，为提交表单跨域使用，可前往 http://fe.baidu.com/~zhengxin/passport/jump.html  下载，或者线上
http://passport.baidu.com/jump.html 
 * @config {String}             defaultStatus         弹出时初始状态(登录或注册),取值 ['login','reg'],默认为 login
 * @config {Function}           onLoginSuccess        登录成功回调 TODO 默认处理函数 json.un
 * @config {Function}           onLoginFailure        登录失败回调 TODO 默认处理函数, json.error
 * @config {Function}           onRegisterSuccess     注册成功回调函数
 * @config {Function}           onRegisterFailure     注册失败回调函数
 *
 */

baidu.ui.Login = baidu.ui.createUI(function(options){ },{superClass:baidu.ui.Dialog}).extend(
{
    		//ui控件的类型，传入给UIBase **必须**
		uiType: 'login',
    		//ui控件的class样式前缀 可选
    		classPrefix     : "tangram-dialog",
		//titleText: '登录',
		loginURL: 'http://passport.baidu.com/api/?login&time=&token=&tpl=pp',
		loginJumpURL: window.location.href,
		//登录成功回调 TODO 默认处理函数 json.un
		onLoginSuccess: function(obj, json) {},
		//登录失败回调 TODO 默认处理函数, json.error
		onLoginFailure: function(obj, json) {},
		loginContainerId: 'loginContainer',
		loginPanelId: 'loginPanel',
		tplContainer: '\
        <div id="content" class="passport-content">\
            <div id="#{idLoginPanel}" class="passport-login-panel">\
	            <div id="#{idLoginContainer}"></div>\
	            <div id="regDiv">\
                    <hr size="0" style="border-top:1px solid #AAAAAA">\
                    <div class="reg">没有百度账号？<a href="https://passport.baidu.com/?reg&tpl=mn" target="_self">立即注册百度账号</a></div>\
                </div>\
            </div>\
        </div>\
           ' ,

    getString: function() {
       var me = this,
            html,
            title = 'title',
            titleInner = 'title-inner',
            content = 'content',
            footer = 'footer';
	me.contentText = me.contentText || baidu.string.format(me.tplContainer, {
    		idLoginContainer: me.loginContainerId,
    		idLoginPanel: me.loginPanelId
    	});

	 return baidu.format(me.tplDOM, {
            id: me.getId(),
            'class' : me.getClass(),
            title: baidu.format(
                me.tplTitle, {
                    id: me.getId(title),
                    'class' : me.getClass(title),
                    'inner-id' : me.getId(titleInner),
                    'inner-class' : me.getClass(titleInner),
                    content: me.titleText || ''
                }),
            content: baidu.format(
                me.tplContent, {
                    id: me.getId(content),
                    'class' : me.getClass(content),
                    content: me.contentText || ''
                }),
            footer: baidu.format(
                me.tplFooter, {
                    id: me.getId(footer),
                    'class' : me.getClass(footer)
            })
        });

},
  open: function() {
    		var me = this;
    		me.renderLogin();
    		me.dispatchEvent('onopen');

    	},
   close: function() {
    		var me = this;
    		me.loginJson = me.regJson = null;
		if (me.dispatchEvent('onbeforeclose')) {
			me.getMain().style.marginLeft = '-100000px';
			baidu.ui.Login.instances[me.guid] = 'hide';
			me.dispatchEvent('onclose');
		}

    	},
   renderLogin: function() {
    		var me = this;
    		if (me.loginJson) return;
	    	baidu.sio.callByServer(me.loginURL, function(value) {
	    		var json = me.loginJson = eval(value);
		        baidu.sio.callByBrowser(json.jslink, function(value) {
		        	baidu.ui.Dialog.prototype.open.call(me);

			        me.loginDom = bdPass.LoginTemplate.render(json, me.loginContainerId, {
					   renderSafeflg: true,
					   onSuccess: me.onLoginSuccess,
					   jumpUrl: me.loginJumpURL,
					   onFailure: me.onLoginFailure
			        });
			        me.update();
		        });
	    	});
    	},
     dispose: function() {
		 var me = this;
		 //删除实例引用
		 delete baidu.ui.Login.instances[me.guid];
		 me.dispatchEvent('dispose');
		 baidu.un(window, 'resize', me.windowResizeHandler);
		 baidu.dom.remove(me.getMain());
		 baidu.lang.Class.prototype.dispose.call(me);
	 }
});
baidu.ui.Login.instances = baidu.ui.Login.instances || {};

/**
 * 应用实现 tab:login&&register 备注：涉及passport的API接口参数可以参见http://fe.baidu.com/doc/zhengxin/passport/openapi_help.text
 * @function
 * @config {String}             regURL                注册地址,无须改动
 * @config {String}             regJumpURL            注册跳转地址,必须，为提交表单跨域使用，可前往 http://fe.baidu.com/~zhengxin/passport/jump.html  下载，或者线上
 * @config {Function}           onRegisterSuccess     注册成功回调函数
 * @config {Function}           onRegisterFailure     注册失败回调函数
 * @config {String}             defaultStatus         弹出时初始状态(登录或注册),取值 ['login','reg'],默认为 login
 */ 
baidu.extend(baidu.ui.Login.prototype,{

     regPanelId: 'regPanel',
     regContainerId: 'regContainer',
     //弹出时初始状态(登录或注册),取值 ['login','reg'],默认为 login
     defaultStatus: 'login',
     tabId: 'navTab',
     currentTabClass: 'act',
     registerText: "",
     register: true,
     regURL: 'http://passport.baidu.com/api/?reg&time=&token=&tpl=pp',
     regJumpURL: window.location.href,
     tplContainer : '\
		<div id="nav" class="passport-nav">\
			<ul id="#{tabId}" class="passport-nav-tab">\
				<li class="#{currentTabClass}" ><a href="##{idLoginPanel}" onclick="#{clickTabLogin};return false;" hidefocus="true" >登录</a></li>\
				<li><a href="##{idRegPanel}" onclick="#{clickTabReg};return false;" hidefocus="true" >注册</a></li>\
			</ul>\
			 <p class="clear"></p>\
		</div>\
	 	<div id="content" class="passport-content">\
			<div id="#{idLoginPanel}" class="passport-login-panel">\
				<div id="#{idLoginContainer}"></div>\
				<div id="regDiv">\
					<hr size="0" style="border-top:1px solid #AAAAAA">\
					<div class="reg">没有百度账号？<a href="##{idRegPanel}" onclick="#{clickTabReg};return false;">立即注册百度账号</a></div>\
				</div>\
			</div>\
		<div id="#{idRegPanel}" class="passport-reg-panel" style="display:none">\
			<div id="#{idRegContainer}" class="passport-reg-container"></div>\
		</div>\
		</div>'  ,

		onRegisterSuccess: function(obj,json) {}, onRegisterFailure: function(obj, json) {},
getString: function() {
       var me = this,
            html,
            title = 'title',
            titleInner = 'title-inner',
            content = 'content',
            footer = 'footer';
	me.contentText = me.contentText || baidu.string.format(me.tplContainer, {
    		clickTabLogin: me.getCallRef() + ".changeTab('login')",
    		clickTabReg: me.getCallRef() + ".changeTab('reg')",
    		idLoginContainer: me.loginContainerId,
    		idRegContainer: me.regContainerId,
    		idLoginPanel: me.loginPanelId,
    		idRegPanel: me.regPanelId,
    		tabId: me.tabId,
    		currentTabClass: me.currentTabClass
    	});

	 return baidu.format(me.tplDOM, {
            id: me.getId(),
            'class' : me.getClass(),
            title: baidu.format(
                me.tplTitle, {
                    id: me.getId(title),
                    'class' : me.getClass(title),
                    'inner-id' : me.getId(titleInner),
                    'inner-class' : me.getClass(titleInner),
                    content: me.titleText || ''
                }),
            content: baidu.format(
                me.tplContent, {
                    id: me.getId(content),
                    'class' : me.getClass(content),
                    content: me.contentText || ''
                }),
            footer: baidu.format(
                me.tplFooter, {
                    id: me.getId(footer),
                    'class' : me.getClass(footer)
            })
        });

},
  open: function() {
    		var me = this;
    		(me.defaultStatus == 'login') ?  me.renderLogin() : me.changeTab('reg');
    		 //me.renderLogin();
    		me.dispatchEvent('onopen');

    	},

     changeTab: function(type) {
        	var me = this,
		 panelIds = [me.loginPanelId, me.regPanelId],
			tabs = baidu.dom.children(me.tabId),
	         className = me.currentTabClass,
			curIndex = (type == 'login') ? 0 : 1;
		for (var i = 0; i < panelIds.length; ++i) {
			baidu.dom.removeClass(tabs[i], className); baidu.g(panelIds[i]).style.display = 'none';
		}
		baidu.dom.addClass(tabs[curIndex], className);
		baidu.g(panelIds[curIndex]).style.display = ''; 
		(type == 'reg') ?  me.renderReg() : me.renderLogin();
	},
renderReg: function() {
    		var me = this;
    		if (me.regJson) return;
	    	baidu.sio.callByServer(me.regURL, function(value) {
	    		var json = me.regJson = eval(value);
		        baidu.sio.callByBrowser(json.jslink, function(value) {
		        	baidu.ui.Dialog.prototype.open.call(me);

			        me.registerDom = bdPass.RegTemplate.render(json, me.regContainerId, {
					   renderSafeflg: true,
					   onSuccess: me.onRegisterSuccess,
					   jumpUrl: me.regJumpURL,
					   onFailure: me.onRegisterFailure
			        });
			        me.update();
		        });
	    	});
    	}

});





baidu.ui.Menubar.extend({
    enableFx:true,
    showFx : baidu.fx.expand,
	showFxOptions : {duration:200},
	hideFx : baidu.fx.collapse,
	hideFxOptions : {duration:500,restoreAfterFinish:true}
});

baidu.ui.Menubar.register(function(me){
    
    if(me.enableFx){
       
        var fxHandle = null;

        me.addEventListener('onopen', function(){
            !baidu.ui.Menubar.showing && 'function' == typeof me.showFx && me.showFx(baidu.g(me.getId()),me.showFxOptions);
        });

        me.addEventListener('onbeforeclose',function(e){
            me.dispatchEvent("onclose");
            
            fxHandle = me.hideFx(baidu.g(me.getId()),me.hideFxOptions);
            fxHandle.addEventListener('onafterfinish',function(){
                me._close();
            });
            
            e.returnValue = false;
        });
        
        me.addEventListener('ondispose', function(){
            fxHandle && fxHandle.end(); 
        });
    }
});

/**
 *  鼠标hover触发menubar插件
 */
baidu.ui.Menubar.extend({
   
    /**
     * 插件触发方式，默认为点击
     * @param {String} [options.type = 'hover']
     */
    type: 'hover',

    /**
     * 菜单显示延迟时间
     * @param {Number} [options.showDelay = 100]
     */
    showDelay: 100,
    
    /**
     * 菜单关闭延迟时间
     * @param {Number} [options.hideDelay = 500]
     */
    hideDelay: 500,
    
    /**
     * 鼠标浮动到target上显示菜单
     */
    targetHover: function(){
        var me = this;
        clearTimeout(me.hideHandler);
        me.showHandler = setTimeout(function(){
            me.open();
        }, me.showDelay);
    },
    
    /**
     * 鼠标移出target关闭菜单
     */
    targetMouseOut: function(){
        var me = this;
        clearTimeout(me.showHandler);
        clearTimeout(me.hideHandler);
        me.hideHandler = setTimeout(function(){
            me.close();
        }, me.hideDelay);
    },
	
   /**
     * 清除hideHandler
     */
    clearHideHandler:function(){
        clearTimeout(this.hideHandler);
    }
	
});

baidu.ui.Menubar.register(function(me){
    me.targetHoverHandler = baidu.fn.bind('targetHover', me);
    me.targetMouseOutHandler = baidu.fn.bind('targetMouseOut', me);
    me.clearHandler = baidu.fn.bind('clearHideHandler', me)

    if (me.type == 'hover') {
        me.addEventListener('onload', function(){
            var target = me.getTarget();
            if (target) {
                baidu.on(target, 'mouseover', me.targetHoverHandler);
                baidu.on(document, 'click', me.targetMouseOutHandler);
            }
        });
        
        me.addEventListener('onopen', function(){
            var target = me.getTarget(), 
                body = me.getBody();
            if (target) {
                baidu.on(body, 'mouseover', me.clearHandler);
                baidu.on(target, 'mouseout', me.targetMouseOutHandler);
                baidu.on(body, 'mouseout', me.targetMouseOutHandler);
            }
        });
        
        me.addEventListener('ondispose', function(){
            var target = me.getTarget(), 
                body = me.getBody();
            if (target) {
                baidu.un(target, 'mouseover', me.targetHoverHandler);
                baidu.un(target, 'mouseout', me.targetMouseOutHandler);
				baidu.un(document, 'click', me.targetMouseOutHandler);
            }
            if (body) {
                baidu.un(body, 'mouseover', me.clearHandler);
                baidu.un(body, 'mouseout', me.targetMouseOutHandler);
            }
        });
    }
});

/**
 * 菜单图标
 */
baidu.ui.Menubar.extend({
    tplIcon : '<span class="#{icon}" style="#{iconStyle};"></span>',
    
    /**
     * 更新item图标
     */
    updateIcons : function(){
        var me = this;
        baidu.object.each(me.items, function(item, key){
            if (me.getItem(key)) {
                baidu.dom.insertHTML(me.getItem(key), "afterBegin", baidu.string.format(me.tplIcon, {
                    icon: me.getClass("icon"),
                    iconStyle: item.icon ? ('background-position:' + item.icon) : 'background-image:none'
                }))
            }
        });
    }
});

baidu.ui.Menubar.register(function(me){
    me.addEventListener('onupdate', me.updateIcons);
});



/* BASE: baidu/event/get.js */ /** * 生成分页功能，默认会有一个横向的页面跳转链接列表，其两端有首页，尾页，上一页，下一页。若要自定义样式（如隐藏某些部件），请使用css（注：控件中各部件的css类名都有控件的tangram类名前缀）首页：first，尾页：last，上一页：previous，下一页：next，当前页：current。若要自定义控件生成的HTML，请参考源代码中以tpl开头的模板属性，类中的属性和方法都可以通过options动态覆盖。 * @class  * @param     {Object}            [options]         更新选项，若选项值不符合规则，则此次更新不予更新任何选项 * @config    {Number}            beginPage         页码范围：起始页码，默认值1。 * @config    {Number}            endPage           页码范围：最后页码+1，必须大于起始页码，默认值100。 * @config    {Number}            currentPage       必须在页码范围内，若未指定currentPage且当前页码已超出页码范围，则会自动将currentPage更新到beginPage。 * @config    {Number}            itemCount         默认显示多少个页面的链接（不包括“首页”等特殊链接），默认值10。 * @config    {Number}            leftItemCount     当前页面链接在页面链接列表中的默认位置，必须小于itemCount，默认值4。 * @config    {Object}            specialLabelMap   设置首页，上一页，下一页链接显示的内容。默认为{first:'首页',next:'下一页',previous:'上一页'} * @config    {String}            tplHref           链接显示样式，默认为"##{page}" * @config    {String}            tplLabel          页码显示样式，默认为"[#{page}]" * @config    {String}            tplCurrentLabel   选中页码的显示样式 */baidu.ui.Pager = baidu.ui.createUI(function (options){    this._init.apply(this, arguments);}).extend(    /**     *  @lends baidu.ui.Pager.prototype     */{    uiType: 'pager',    id: 'pager',    tplHref: '##{page}',    tplLabel: '[#{page}]',    specialLabelMap: {        'first': '首页',        'last': '尾页',        'previous': '上一页',        'next': '下一页'    },    tplCurrentLabel: '#{page}',    tplItem: '<a class="#{class}" page="#{page}" target="_self" href="#{href}">#{label}</a>',    //FIXME: 用#{onclick}形式绑定事件    //#{onclick} {onclick: me.getCallRef() + ""}    tplBody: '<div onclick="#{onclick}" id="#{id}" class="#{class}">#{items}</div>',    beginPage: 1,    endPage: 100,    //当前页面    //currentPage: undefined,    itemCount: 10,    leftItemCount: 4,    /**     * 初始化函数     * @param options     * @see baidu.ui.pager.Pager#update     */    _init: function (options){        var me = this;        me.update();    },    // 特殊链接请使用css控制隐藏和样式    /**     * 更新设置	 * @public      * @param      {Object}     options          更新设置     * @config     {Number}     beginPage        开始页     * @config     {Number}     endPage          结束页     * @config     {Number}     currentPage      跳转目标页的索引     * @config     {Number}     itemCount        默认列出多少个a标签     * @config     {Function}   leftItemCount    当前页的显示位置, 有默认实现     */    update: function (options){        var me = this;        options = options || {};        if (me.checkOptions(options)) {            //如果用户修改currentPage，则触发gotoPage事件. 如果事件处理函数取消了跳转，则不更新currentPage;            if (options.hasOwnProperty('currentPage') && options.currentPage != me.currentPage) {                if (!me._notifyGotoPage(options.currentPage, false)) {                    delete options.currentPage;                }            }            me._updateNoCheck(options);            return true;        }        return false;    },    _updateNoCheck: function (options){        var me = this;        baidu.object.extend(me, options);        if (me.getMain()) {            me._refresh();        }    },    /**     * 检查参数是否出错     * @private     * @param {Object} options     */    checkOptions: function (options){        var me = this;        var begin = options.beginPage || me.beginPage;        var end = options.endPage || me.endPage;        // TODO: trace信息        if (end <= begin) {            return false;        }        // TODO: 不应该放在这里        if (options.hasOwnProperty('beginPage') && me.currentPage < begin) {            me.currentPage = begin;        }        if (options.hasOwnProperty('endPage') && me.currentPage >= end) {            me.currentPage = end - 1;        }        var current = options.currentPage || me.currentPage;        if (current < begin || current >= end){            return false;        }        return true;    },    /**     * 构造链接的HTML     * @private     * @param page {Number}     * @param [spec] {String} first|last...     * @private     */    _genItem: function (page, spec){        var me = this;        return baidu.string.format(me.tplItem, {            "class": spec ? me.getClass(spec) : '',            page: page,            href: baidu.string.format(me.tplHref, {                page: page            }),            label: function (){                return ( spec                  ? (spec == "current"                       ? baidu.string.format(me.tplCurrentLabel, { page: page })                       : me.specialLabelMap[spec]                     )                  : baidu.string.format(me.tplLabel, { page: page }) );            }        });    },    /**     * @private     */    _genBody: function (){        var me = this;        var begin = me.beginPage;        var end = me.endPage;        var current = me.currentPage;        // 处理范围小于显示数量的情况        var numlist = Math.min(end - begin, me.itemCount);        // 处理当前页面在范围的两端的情况        var leftcnt = Math.min(current - begin, me.leftItemCount);        leftcnt = Math.max(numlist - (end - current), leftcnt);        var startPage = current - leftcnt;        // 生成特殊链接        var pageMap = {            first: begin,            last: end - 1,            previous: current - 1,            next: current + 1        };        var spec = {};        baidu.object.each(pageMap, function (s, k){            spec[k] = me._genItem(s, k);        });        spec.previous = pageMap.previous < begin ? '' : spec.previous;        spec.next = pageMap.next >= end ? '' : spec.next;        spec.first = startPage == begin ? '' : spec.first;        spec.last = startPage + numlist >= end - 1 ? '' : spec.last;        // 生成常规链接        var buff = [];        for (var i=0; i<numlist; i++) {            var page = startPage + i;            buff[i] = me._genItem(page, page == current ? "current" : null);        }        return baidu.string.format(me.tplBody, {            id: me.getId(),            "class": me.getClass(),            items: spec.first + spec.previous + buff.join('') + spec.next + spec.last,            onclick: me.getCallRef() + "._handleOnClick(event, this);"        });    },    /**     * 刷新界面     * @private     */    _refresh: function (){        var me = this;        me.getMain().innerHTML = me.getString();    },    /**     * 鼠标点击链接事件     * @private     * @param evt     */    _handleOnClick: function (evt){        evt = baidu.event.get(evt);        var me = this,            el = evt.target,            page = Number(el.getAttribute('page'));        // IE6 doesnot support Element#hasAttribute.        // 无需checkOptions检查，因为能点到页码的都是正常值        if (page && me._notifyGotoPage(page, true)) {            me._updateNoCheck({ currentPage: page });        } else {            evt.preventDefault();        }    },    _notifyGotoPage: function (page, fromClick){        return this.dispatchEvent('ongotopage', { page: page, fromClick: fromClick });    },    /**     * 跳转页面事件  参数evt.page 可以使用evt.returnValue = false来取消跳转     * @private     * @param evt {Object} 将要跳转到的页面的索引     * @event     */    ongotopage: function (evt){        //evt.returnValue = false;    },    /**     * 获取用于生成控件的HTML     * @private     */    getString: function (){        var me = this;        if (me.currentPage === undefined) {            me.currentPage = me.beginPage;        }        return me._genBody();    },    /**     * 将控件渲染到目标元素     * @public     * @param    {String|HTMLElement}    container     目标元素或元素id     */    render: function (container){        var me = this;        me.renderMain(container);        me.getMain().innerHTML = me.getString();        me.update();        me.dispatchEvent('onload');    },    /**     * 销毁控件	 * @public     */    dispose: function (){        var me = this;        me.dispatchEvent('ondispose');        if (me.getMain()) {            var main = me.getMain();            baidu.event.un(main, 'click', me._handleOnClick);            if (main.parentNode && main.parentNode.nodeType == 1) {                main.parentNode.removeChild(main);            }            me.dispose = null;            main = null;            baidu.lang.Class.prototype.dispose.call(me);        } else {            me.addEventListener('onload', function callee(){                me.removeEventListener('onload', callee);                me.dispose();            });        }    }});


/**
 *
 * 进度条控件
 *
 * @param options
 */
baidu.ui.ProgressBar = baidu.ui.createUI(function(options) {
}).extend({
    uiType: 'progressBar',
    tplBody: '<div id="#{id}" class="#{class}">#{bar}</div>',
    tplBar: '<div id="#{barId}" class="#{barClass}"></div>',

    //初始化时，进度条所在的值
    value: 0,

    layout: 'horizontal',

    _min: 0,
    _max: 100,
     //位置变换
    axis: {
        horizontal: {offsetSize: 'offsetWidth', size: 'width'},
        vertical: {offsetSize: 'offsetHeight', size: 'height'}
    },
    /**
     * 获得控件字符串
     * @return {string} HTML string.
     */
    getString: function() {
        var me = this;
        return baidu.format(me.tplBody, {
            id: me.getId(),
            'class' : me.getClass(),
            bar: baidu.format(me.tplBar, {
                barId: me.getId('bar'),
                barClass: me.getClass('bar')
            })
        });
    },

    /**
     * 渲染进度条
     * @param {HTMLElement} target
     */
    render: function(target) {
        var me = this,
            main;

        if (!target) {
            return;
        }

        baidu.dom.insertHTML(
            me.renderMain(target),
            'beforeEnd',
            me.getString()
        );
        me.dispatchEvent('onload');

        me.update();
    },


    /**
     * 更新progressBar状态
     * @param {object} options 参数.
     */
    update: function(options) {
        var me = this;

        options = options || {};
        baidu.object.extend(me, options);

        me.value = Math.max(Math.min(me.value, me._max), me._min);
        if (me.value == me._lastValue) {
            return;
        }
        var len = me.axis[me.layout].size;
        baidu.dom.setStyle(me.getBar(), len, me._calcPos(me.value));
        me._lastValue = me.value;

        me.dispatchEvent('update');
    },

    /**
     * 获得当前的value
     * @return {number} value.
     */
    getValue: function() {
        var me = this;
        return me.value;
    },

    /**
     * 将value转换为位置信息
     */
    _calcPos: function(value) {
        var me = this;
        var len = me.getBody()[me.axis[me.layout].offsetSize];
        return value * (len) / (me._max - me._min);
    },

    /**
     * 禁用进度条
     */
    disable: function() {
        this.disabled = true;
    },

    /**
     * 启用进度条
     */
    enable: function() {
        this.disabled = false;
    },

    /**
     * 获取target元素
     * @return {HTMLElement} target.
     */
    getTarget: function() {
        return baidu.g(this.targetId);
    },

    /**
     * 获取进度条元素
     * @return {HTMLElement} bar.
     */
    getBar: function() {
        return baidu.g(this.getId('bar'));
    },

    /**
     * 销毁当前实例
     */
    dispose: function() {
        var me = this;
        baidu.dom.remove(me.getId());
    }
});
/**
 * 创建一个简单的滚动条
 * @class ScrollBar基类
 * @param   {Object}    options config参数.
 * @config  {String}    orientation 设置横向或是竖向滚动条，默认值：vertical,可取值：horizontal.
 * @config  {Number}    value       滚动条滚动的百分比值，定义域(0, 100)
 * @config  {Number}    dimension   滚动条滑块占全部内容的百分比，定义域(0, 100)
 * @config  {Number}    step        用户自定义当点击滚动按钮时每次滚动百分比距离，定义域(0, 100)
 * @config  {Function}  onscroll    当滚动时触发该事件，function(evt){}，evt.value可以取得滚动的百分比
 * @author linlingyu
 */
baidu.ui.ScrollBar = baidu.ui.createUI(function(options) {
    var me = this;
        me._scrollBarSize = {width: 0, height: 0};//用来存入scrollbar的宽度和高度
}).extend(
/**
 *  @lends baidu.ui.ScrollBar.prototype
 */
{
    uiType: 'scrollbar',
    tplDOM: '<div id="#{id}" class="#{class}"></div>',
    tplThumb: '<div class="#{prev}"></div><div class="#{track}"></div><div class="#{next}"></div>',
    value: 0,//描述滑块初始值停留的百分比，定义域(0, 100)
    dimension: 10,//描述滑块占整个可滚动区域的百分比，定义域(0, 100)
    orientation: 'vertical',//横竖向的排列方式，取值 horizontal,vertical
    step: 5,//单步移动5%
    _axis: {
        horizontal: {
            size: 'width',
            unSize: 'height',
            offsetSize: 'offsetWidth',
            unOffsetSize: 'offsetHeight',
            clientSize: 'clientWidth',
            scrollPos: 'scrollLeft',
            scrollSize: 'scrollWidth'
        },
        vertical: {
            size: 'height',
            unSize: 'width',
            offsetSize: 'offsetHeight',
            unOffsetSize: 'offsetWidth',
            clientSize: 'clientHeight',
            scrollPos: 'scrollTop',
            scrollSize: 'scrollHeight'
        }
    },

    /**
     * 生成滑块的内容字符串
     * @return {String}
     * @private
     */
    getThumbString: function() {
        var me = this;
        return baidu.string.format(me.tplThumb, {
            prev: me.getClass('thumb-prev'),
            track: me.getClass('thumb-track'),
            next: me.getClass('thumb-next')
        });
    },

    /**
     * 将scrollBar的body渲染到用户给出的target
     * @param {String|HTMLElement} target 一个dom的id字符串或是dom对象.
     */
    render: function(target) {
        var me = this;
        if (!target || me.getMain()) {return;}
        baidu.dom.insertHTML(me.renderMain(target), 'beforeEnd',
            baidu.string.format(me.tplDOM, {
            id: me.getId(),
            'class': me.getClass()
        }));
        me._renderUI();
        me.dispatchEvent('load');
    },

    /**
     * 将Button和Slider渲染到body中
     * @private
     */
    _renderUI: function() {
        var me = this,
            axis = me._axis[me.orientation],
            body = me.getBody(),
            prev,
            slider,
            next;
        function options(type) {
            return{
                classPrefix: me.classPrefix + '-' +type,
                skin: me.skin ? me.skin + '-' + type : '',
                poll: {time: 4},
                onmousedown: function() {me._basicScroll(type);},
                element: body,
                autoRender: true
            };
        }
        prev = me._prev = new baidu.ui.Button(options('prev'));
        baidu.dom.insertHTML(body, 'beforeEnd', baidu.string.format(me.tplDOM, {
            id: me.getId('track'),
            'class': me.getClass('track')
        }));
        next = me._next = new baidu.ui.Button(options('next'));
        function handler(evt) {
            me.dispatchEvent('scroll', {value: Math.round(evt.target.getValue())});
        }
        slider = me._slider = new baidu.ui.Slider({
            classPrefix: me.classPrefix + '-slider',
            skin: me.skin ? me.skin + '-slider' : '',
            layout: me.orientation,
            onslide: handler,
            onslideclick: handler,
            element: baidu.dom.g(me.getId('track')),
            autoRender: true
        });
        me._scrollBarSize[axis.unSize] = next.getBody()[axis.unOffsetSize];//这里先运算出宽度，在flushUI中运算高度
        me._thumbButton = new baidu.ui.Button({
            classPrefix: me.classPrefix + '-thumb-btn',
            skin: me.skin ? me.skin + '-thumb-btn' : '',
            content: me.getThumbString(),
            capture: true,
            element: slider.getThumb(),
            autoRender: true
        });
        me.flushUI(me.value, me.dimension);
        //注册滚轮事件
        me._registMouseWheelEvt(me.getMain());
    },

    /**
     * 更新组件的外观，通过传入的value来使滚动滑块滚动到指定的百分比位置，通过dimension来更新滑块所占整个内容的百分比宽度
     * @param {Number} value 滑块滑动的百分比，定义域(0, 100).
     * @param {Number} dimension 滑块的宽点占内容的百分比，定义域(0, 100).
     */
    flushUI: function(value, dimension) {
        var me = this,
            axis = me._axis[me.orientation],
            btnSize = me._prev.getBody()[axis.offsetSize] + me._next.getBody()[axis.offsetSize],
            body = me.getBody(),
            slider = me._slider,
            thumb = slider.getThumb(),
            val;
        //当外观改变大小时
        baidu.dom.hide(body);
        val = me.getMain()[axis.clientSize];
        me._scrollBarSize[axis.size] = (val <= 0) ? btnSize : val;
        slider.getMain().style[axis.size] = (val <= 0 ? 0 : val - btnSize) + 'px';//容错处理
        thumb.style[axis.size] = Math.max(Math.min(dimension, 100), 0) + '%';
        baidu.dom.show(body);
        me._scrollTo(value);//slider-update
    },

    /**
     * 滚动内容到参数指定的百分比位置
     * @param {Number} val 一个百分比值.
     * @private
     */
    _scrollTo: function(val) {
        //slider有容错处理
        this._slider.update({value: val});
    },

    /**
     * 滚动内容到参数指定的百分比位置
     * @param {Number} val 一个百分比值.
     */
    scrollTo: function(val) {
        var me = this;
        me._scrollTo(val);
        me.dispatchEvent('scroll', {value: val});
    },

    /**
     * 根据参数实现prev和next按钮的基础滚动
     * @param {String} pos 取值prev|next.
     * @private
     */
    _basicScroll: function(pos) {
        var me = this;
        me.scrollTo(Math.round(me._slider.getValue()) + (pos == 'prev' ? -me.step : me.step));
    },

    /**
     * 滑轮事件侦听器
     * @param {Event} evt 滑轮的事件对象.
     * @private
     */
    _onMouseWheelHandler: function(evt) {
        var me = this,
            target = me.target,
            evt = evt || window.event,
            detail = evt.detail || -evt.wheelDelta;
        baidu.event.preventDefault(evt);
        me._basicScroll(detail > 0 ? 'next' : 'prev');
    },

    /**
     * 注册一个滚轮事件
     * @param {HTMLElement} target 需要注册的目标dom.
     * @private
     */
    _registMouseWheelEvt: function(target) {
//        if(this.orientation != 'vertical'){return;}
        var me = this,
            getEvtName = function() {
                var ua = navigator.userAgent.toLowerCase(),
                    //代码出处jQuery
                    matcher = /(webkit)/.exec(ua)
                        || /(opera)/.exec(ua)
                        || /(msie)/.exec(ua)
                        || ua.indexOf('compatible') < 0
                        && /(mozilla)/.exec(ua)
                        || [];
                return matcher[1] == 'mozilla' ? 'DOMMouseScroll' : 'mousewheel';
            },
            entry = {
                target: target,
                evtName: getEvtName(),
                handler: baidu.fn.bind('_onMouseWheelHandler', me)
            };
        baidu.event.on(entry.target, entry.evtName, entry.handler);
        me.addEventListener('dispose', function() {
            baidu.event.un(entry.target, entry.evtName, entry.handler);
        });
    },

    /**
     * 设置滚动条的隐藏或显示
     * @param {Boolean} val 布尔值 true:显示, false:隐藏.
     */
    setVisible: function(val) {
        this.getMain().style.display = val ? '' : 'none';
    },

    /**
     * 取得当前是隐藏或是显示状态
     * @return {Boolean} true:显示, false:隐藏.
     */
    isVisible: function() {
        return this.getMain().style.display != 'none';
    },

    /**
     * 取得滚动条的宽度和高度
     * @return {Object} 一个json，有width和height属性.
     */
    getSize: function() {
        return this._scrollBarSize;
    },

    /**
     * 更新滚动条的外观
     * @param {Object} options 参考构造函数参数.
     */
    update: function(options) {
        var me = this;
        me.dispatchEvent('beforeupdate');//该事件是用于和插件container结合使用，不对外开放
        baidu.object.extend(me, options);
        me.flushUI(me.value, me.dimension);
        me.dispatchEvent('update');
    },

    /**
     * 销毁对象
     */
    dispose: function() {
        var me = this;
        me.dispatchEvent('dispose');
        me._prev.dispose();
        me._thumbButton.dispose();
        me._slider.dispose();
        me._next.dispose();
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

/**
 * 让滚动条邦定一个容器
 * @param   {Object}                options config参数.
 * @config  {String|HTMLElement}    container 一个容器的dom或是id的字符串
 * @author linlingyu
 */
baidu.ui.ScrollBar.register(function(me) {
    if (!me.container) {return;}
    me.addEventListeners({
        load: function() {
            me.update();
            if (me.orientation == 'vertical') {
                me._registMouseWheelEvt(me.getContainer());
            }
        },
        beforeupdate: function() {
            var me = this;
                axis = me._axis[me.orientation],
                container = me.getContainer();
            if (!container) {return;}

            me.dimension = Math.round(container[axis.clientSize]
                    / container[axis.scrollSize] * 100);
            me.value = container[axis.scrollSize] - container[axis.clientSize];
            me.value > 0 && (me.value = Math.round(container[axis.scrollPos]
                / (container[axis.scrollSize]
                - container[axis.clientSize]) * 100));
        },
        scroll: function(evt) {
            var container = me.getContainer(),
                axis = me._axis[me.orientation];
            container[axis.scrollPos] = evt.value / 100
                * (container[axis.scrollSize] - container[axis.clientSize]);
        }
    });
});
baidu.object.extend(baidu.ui.ScrollBar.prototype, {
    /**
     * 取得用户传入的需要被滚动条管理的对象
     * @return {HTMLElement}
     */
    getContainer: function() {
        return baidu.dom.g(this.container);
    }
});

/* BASE: baidu/dom/_styleFixer/float.js */


/**
 * 创建一个panel来作为滚动条的容器
 * @class ScrollPanel基类
 * @param   {Object}                options config参数.
 * @config  {String}                overflow 取值'overflow-y':创建竖向滚动, 'overflow-x':创建横向滚动条, 'auto':创建滚动条(默认)
 * @config  {String|HTMLElement}    container 需要被滚动条管理的容器对象
 * @author linlingyu
 */
baidu.ui.ScrollPanel = baidu.ui.createUI(function(options) {

}).extend(
/**
 *  @lends baidu.ui.ScrollPanel.prototype
 */
{
    uiType: 'scrollpanel',
    tplDOM: '<div id="#{id}" class="#{class}">#{body}</div>',
    overflow: 'auto',
    _scrollBarSize: 0,//滚动条尺寸
    _yVisible: false,//用来标示竖向滚动条的隐藏显示状态
    _xVisible: false,//用来标示横向滚动条的隐藏显示状态
    _axis: {
        y: {
            size: 'height',
            unSize: 'width',
            unScrollSize: 'scrollWidth',
            unClientSize: 'clientWidth',
            offsetSize: 'offsetHeight'
        },
        x: {
            size: 'width',
            unSize: 'height',
            unScrollSize: 'scrollHeight',
            unClientSize: 'clientHeight',
            offsetSize: 'offsetWidth'
        }
    },

    /**
     * 取得panel所需要body字符串
     * @private
     */
    getString: function() {
        var me = this,
            str = baidu.string.format(me.tplDOM, {
                id: me.getId('panel'),
                'class': me.getClass('panel')
            });
        str = baidu.string.format(me.tplDOM, {
            id: me.getId(),
            'class': me.getClass(),
            body: str
        });
        return baidu.string.format(me.tplDOM, {
            id: me.getId('main'),
            'class': me.getClass('main'),
            body: str
        });
    },

    /**
     * 渲染ScrollPanel到页面中
     * @param {String|HTMLElement} target ScrollPanel依附于target来渲染.
     */
    render: function(target) {
        var me = this;
        me.target = target;
        if (!target || me.getMain()) {return;}
        baidu.dom.insertHTML(me.getTarget(), 'afterEnd', me.getString());
        me.renderMain(me.getId('main'));
        me._renderUI();
    },

    /**
     * 根据参数渲染ScrollBar到容器中
     * @private
     */
    _renderUI: function() {
        var me = this,
            main = me.getMain(),
            panel = me.getPanel(),
            target = me.getTarget(),
            skin = me.skin || '';
        main.style.width = target.offsetWidth + 'px';
        main.style.height = target.offsetHeight + 'px';
        panel.appendChild(target);
        function getScrollbar(pos) {
            var track = me.getId('overflow-' + pos),
                axis = me._axis[pos],
                panel = me.getPanel(),
                bar;
            baidu.dom.insertHTML(panel,
                (pos == 'y' ? 'afterEnd' : 'beforeEnd'),
                baidu.string.format(me.tplDOM, {
                    id: track,
                    'class': me.getClass('overflow-' + pos)
                }));
            track = baidu.dom.g(track);
            if ('y' == pos) {

                baidu.dom.setStyle(panel, 'float', 'left');
                baidu.dom.setStyle(track, 'float', 'left');
            }
            //
            me['_' + pos + 'Visible'] = true;
            bar = me['_' + pos + 'Scrollbar'] = new baidu.ui.ScrollBar({
                skin: skin + 'scrollbar' + '-' + pos,
                orientation: pos == 'y' ? 'vertical' : 'horizontal',
                container: me.container,
                element: track,
                autoRender: true
            });
            track.style[axis.unSize] = bar.getSize()[axis.unSize] + 'px';
            me._scrollBarSize = bar.getSize()[axis.unSize];
            bar.setVisible(false);
        }
        if (me.overflow == 'overflow-y'
            || me.overflow == 'auto') {
            getScrollbar('y');
        }
        if (me.overflow == 'overflow-x'
            || me.overflow == 'auto') {
            getScrollbar('x');
        }
        me._smartVisible();
    },

    /**
     * 根据内容智能运算容器是需要显示滚动条还是隐藏滚动条
     * @private
     */
    _smartVisible: function() {
        var me = this,
            size = {yshow: false, xshow: false};
        if (!me.getContainer()) {return}
        function getSize(orie) {//取得邦定容器的最小尺寸和内容尺寸
            var axis = me._axis[orie],
                bar = me['_' + orie + 'Scrollbar'],
                container = me.getContainer(),
                size = {};
            if (!bar || !bar.isVisible()) {
                container.style[axis.unSize] = container[axis.unClientSize]
                    - me._scrollBarSize + 'px';
            }
            size[axis.unSize] = container[axis.unClientSize];
            size['scroll' + axis.unSize] = container[axis.unScrollSize];
            return size;
        }
        function setContainerSize(orie, size) {//根据是否显示滚动条设置邦定容器的尺寸
            var axis = me._axis[orie],
                container = me.getContainer();
            if (!me['_' + orie + 'Visible']
                || !size[orie + 'show']
                || !me['_' + orie + 'Scrollbar']) {
                container.style[axis.unSize] = container[axis.unClientSize]
                    + me._scrollBarSize + 'px';
            }
        }
        function setScrollBarVisible(orie, size) {//设置滚动条的显示或隐藏
            var axis = me._axis[orie],
                container = me.getContainer(),
                scrollbar = me['_' + orie + 'Scrollbar'],
                isShow = size[orie + 'show'];
            if (scrollbar) {
                scrollbar.getMain().style[axis.size] = container[axis.offsetSize] + 'px';
                scrollbar.setVisible(me['_' + orie + 'Visible'] ? isShow : false);
                scrollbar.update();
            }
        }
        baidu.object.extend(size, getSize('y'));
        baidu.object.extend(size, getSize('x'));
        if (size.scrollwidth <= size.width + me._scrollBarSize
            && size.scrollheight <= size.height + me._scrollBarSize) {//两个都不显示
            size.yshow = size.xshow = false;
        }else if (size.scrollwidth <= size.width
            && size.scrollheight > size.height + me._scrollBarSize) {//只显示竖
            size.yshow = true;
            size.xshow = false;
        }else if (size.scrollwidth > size.width + me._scrollBarSize
            && size.scrollheight <= size.height) {//只显示横
            size.yshow = false;
            size.xshow = true;
        }else {//两个都显示
            size.yshow = size.xshow = true;
        }
        setContainerSize('y', size);
        setContainerSize('x', size);
        setScrollBarVisible('y', size);
        setScrollBarVisible('x', size);
    },

    /**
     * 设置滚动条的隐藏或是显示状态
     * @param {Boolean} val 必选，true:显示, false:隐藏.
     * @param {String} pos 可选，当有两个滚动条时可以指定只隐藏其中之一，取值'x'或'y'，不传该参数隐藏或显示全部.
     */
    setVisible: function(val, pos) {
        var me = this;
        if (pos) {
            me['_' + pos + 'Visible'] = val;
        }else {
            me._yVisible = me._xVisible = val;
        }
        me._smartVisible();
    },

    /**
     * 取得滚动条的隐藏或显示状态
     * @param {String} pos 取值'x'或是'y'来选择要取得哪个滚动条的隐藏或是显示状态.
     * @return {Boolean} 返回布尔值来标示当前的隐藏或是显示状态.
     */
    isVisible: function(pos) {
        var me = this;
        return me['_' + pos + 'Visible'];
    },

    /**
     * 取得滚动条对象
     * @param {String} pos 取值'x'或是'y'来标示需取得哪个滚动条，当不传该参数则返回所有滚动条.
     * @return {ScrollBar|Array} 返回滚动条对象或数组.
     */
    getScrollBar: function(pos) {
        var me = this,
            instance = pos ? me['_' + pos + 'Scrollbar'] : null;
        if(!instance){
            instance = (me._yScrollbar && me._xScrollbar) ? [me._yScrollbar, me._xScrollbar]
                : (me._yScrollbar || me._xScrollbar)
        }
        return instance;
    },

    /**
     * 更新所有滚动条的外观
     * @param {Object} options 参数请参考构造函数参数.
     */
    update: function(options) {
        var me = this;
        baidu.object.extend(me, options);
        me._smartVisible();
    },

    /**
     * 取得panel的dom节点
     * @return {HTMLElement}
     */
    getPanel: function() {
        return baidu.dom.g(this.getId('panel'));
    },

    /**
     * 取得用户传入的目标对象
     * @return {HTMLElement}
     */
    getTarget: function() {
        return baidu.dom.g(this.target);
    },

    /**
     * 取得用户传入的container对象
     * @return {HTMLElement}
     */
    getContainer: function() {
        return baidu.dom.g(this.container);
    },

    /**
     * 销毁对象
     */
    dispose: function() {
        var me = this,
            ybar = me._yScrollbar,
            xbar = me._xScrollbar;
        me.dispatchEvent('dispose');
        me.getMain().parentNode.appendChild(me.getTarget());
        if (ybar) {ybar.dispose();}
        if (xbar) {xbar.dispose();}
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});


/**
 *
 * 和进度条结合  进度条跟随滑块的滑动
 */
baidu.ui.Slider.register(function(me){
    me.addEventListener("load", function(){
        baidu.dom.insertHTML(me.getThumb(), "beforeBegin", me.getProgressBarString());
        me.progressBar = new baidu.ui.ProgressBar({
            layout: me.layout,
            skin : me.skin ? me.skin + "-followProgressbar" : null
        });
        me.progressBar.render(me.getId("progressbar"));
        me._adjustProgressbar();
        me.addEventListener("dispose", function(){
                me.progressBar.dispose();
        });
    });
    me.addEventListeners('slide, slideclick, update', function(){
        me._adjustProgressbar();
    });
});

baidu.ui.Slider.extend({
    tplProgressbar : "<div id='#{rsid}' class='#{class}' style='position:absolute; left:0px; top:0px;'></div>",//这里position如果没有设置，会造成该div和thumb之间掉行
        
        /**
         * 根据tplProgressbar生成一个容器用来存入progressBar组件
         */
    getProgressBarString : function(){
        var me = this;
        return baidu.string.format(me.tplProgressbar, {
                rsid : me.getId("progressbar"),
                "class" : me.getClass("progressbar")
        });
    },
    
    /**
     * 当滑动thumb时，让prgressBar的长度跟随滑块
     */
    _adjustProgressbar : function(){
        var me = this,
            layout = me.layout,
            axis = me._axis[layout],
            thumb = me.getThumb(),
            thumbPos = parseInt(thumb.style[axis.pos], 10);
        if(!me.progressBar){return;}
        me.progressBar.getBar().style[me.progressBar.axis[layout].size] = (isNaN(thumbPos) ? 0 : thumbPos)
            + thumb[axis.offsetSize] / 2 + 'px';
    }
});
/**
 * @class 星级评价条
 * @param {Object} [options] 选项
 * @param {Number} [options.total] 总数,默认5个
 * @param {Number} [options.current] 当前亮着的星星数
 * @param {String} [options.classOn] 星星点亮状态的className
 * @param {String} [options.classOff] 星星未点亮状态的className
 */
//TODO: 实现一个支持任意刻度的星的显示
baidu.ui.StarRate = baidu.ui.createUI(function(options){
   var me = this; 
   me.element = null; 
}).extend(
    /**
     *  @lends baidu.ui.StarRate.prototype
     */ 
    {
    uiType  : "starRate",
    // 总共需要多少个星星【可选，默认显示5个】
    total : 5,
    // 亮着的星星数【可选，默认无】
    current : 0,
    // 鼠标移出焦点区域触发函数【可选】
    //leave : function(){}
    // 鼠标经过的触发功能函数【可选】
    //hover : function(num){}
    // 点击的触发功能函数【可选】
    //click : function(num){}
    tplStar : '<span id="#{id}" class="#{className}" onmouseover="#{onmouseover}" onclick="#{onclick}"></span>',
    
    classOn : 'on',
    
    classOff : 'off',
    isDisable : false,
    /**
     * 获得控件的string
     * @private
     */
    getString : function(){
        var me = this, ret = [], i;
        for(i=0; i < me.total; ++i){
            ret.push(baidu.string.format(me.tplStar, {
                id          : me.getId(i),
                className   : i < me.current ? me.getClass(me.classOn) : me.getClass(me.classOff),
                onmouseover : me.getCallString("hoverAt",i+1),
                onclick     : me.getCallString("clickAt", i+1)
            }));
        }
        return ret.join('');
    },
    /**
     * 渲染控件
     * @public 
     * @param   {HTMLElement}   element       目标父级元素
     */
    render : function(element){
        var me = this;
            me.element = baidu.g(element);
        baidu.dom.insertHTML(me.element, "beforeEnd",me.getString());
    
        me._mouseOutHandle = baidu.fn.bind(function(){
            var me = this;
            me.starAt(me.current);
            me.dispatchEvent("onleave");
        },me);

        baidu.on(me.element, 'mouseout', me._mouseOutHandle);
    },

    /**
     * 指定高亮几个星星
     * @public 
     * @param   {number}  num  索引
     */
    starAt : function(num){
        var me = this, i;
        for(i=0; i < me.total; ++i){
            baidu.g(me.getId(i)).className = i < num ? me.getClass(me.classOn) : me.getClass(me.classOff);
        }
    },
    /**
     * 鼠标悬停指定高亮几个星星
     * @public 
     * @param   {number}  num  索引
     */
    hoverAt : function(num){
        if(!this.isDisable){
            this.starAt(num);
            this.dispatchEvent("onhover",{data : {index : num}});
        }
    },
    /**
     * 鼠标点击指定高亮几个星星
     * @public 
     * @param   {number}  num  索引
     */
    clickAt : function(num){
        if(!this.isDisable){
            this.current = num;
            this.dispatchEvent("onclick",{data : {index : num}});
        }
    },
    
    /**
     * 值不可更改,即不响应鼠标事件
     */
    disable : function(){
        var me = this;
        me.isDisable = true;
    },
    /**
     * disable之后的恢复
     */
    enable : function(){
        var me = this;
        me.isDisable = false;
    },
    /**
     * 销毁控件
     */
    dispose:function(){
        var me = this;
        baidu.un(me.element, 'mouseout', me._mouseOutHandle);
       
        for(i=0; i < me.total; ++i){
            baidu.dom.remove(me.getId(i));
        }
        
        me.dispatchEvent("ondispose");
        baidu.lang.Class.prototype.dispose.call(me);
    }
});

/* BASE: baidu/event/stop.js */



/* BASE: baidu/array/contains.js */











/**
 * @class  Suggestion基类，建立一个Suggestion实例
 *
 * @param  {Object}   [options]        选项.
 * @config {Function} onshow           当显示时触发。
 * @config {Function} onhide           当隐藏时触发，input或者整个window失去焦点，或者confirm以后会自动隐藏。
 * @config {Function} onconfirm        当确认条目时触发，回车后，或者在条目上按鼠标会触发确认操作。参数是event对象，其中有data属性，包括item和index值。item为当前确认的条目，index是条目索引。。
 * @config {Function} onbeforepick     使用方向键选中某一行，鼠标点击前触发。
 * @config {Function} onpick           使用方向键选中某一行，鼠标点击时触发。参数是event对象，其中有data属性，包括item和index值。item为当前确认的条目，index是条目索引。
 * @config {Function} onhighlight      当高亮时触发，使用方向键移过某一行，使用鼠标滑过某一行时会触发高亮。参数是event对象，其中有data属性，包括item和index值。item为当前确认的条目，index是条目索引。
 * @config {Function} onload
 * @config {Function} onmouseoveritem
 * @config {Function} onmouseoutitem
 * @config {Function} onmousedownitem
 * @config {Function} onitemclick
 * @config {Function} view             重新定位时，会调用这个方法来获取新的位置，传入的参数中会包括top、 left、width三个值。
 * @config {Function} getData          在需要获取数据的时候会调用此函数来获取数据，传入的参数word是用户在input中输入的数据。
 * @config {String}   prependHTML      写在下拉框列表前面的html
 * @config {String}   appendHTML       写在下拉框列表后面的html
 */
baidu.ui.Suggestion = baidu.ui.createUI(function(options) {
    var me = this;

    me.addEventListener('onload', function() {
        //监听suggestion外面的鼠标点击
        baidu.on(document, 'mousedown', me.documentMousedownHandler);

        //窗口失去焦点就hide
        baidu.on(window, 'blur', me.windowBlurHandler);
    });

    //初始化dom事件函数
    me.documentMousedownHandler = me._getDocumentMousedownHandler();
    me.windowBlurHandler = me._getWindowBlurHandler();

    //value为在data中的value
    me.enableIndex = [];
    //这个index指的是当前高亮条目在enableIndex中的index而非真正在data中的index
    me.currentIndex = -1;

}).extend(
    /**
     *  @lends baidu.ui.Suggestion.prototype
     */
{
    uiType: 'suggestion',
    onbeforepick: new Function,
    onpick: new Function,
    onconfirm: new Function,
    onhighlight: new Function,
    onshow: new Function,
    onhide: new Function,

    /**
     * @private
     */
    getData: function() {return []},
    prependHTML: '',
    appendHTML: '',

    currentData: {},

    tplDOM: "<div id='#{0}' class='#{1}' style='position:relative; top:0px; left:0px'></div>",
    tplPrependAppend: "<div id='#{0}' class='#{1}'>#{2}</div>",
    tplBody: "<table cellspacing='0' cellpadding='2'><tbody>#{0}</tbody></table>",
    tplRow: '<tr><td id="#{0}" onmouseover="#{2}" onmouseout="#{3}" onmousedown="#{4}" onclick="#{5}" class="#{6}">#{1}</td></tr>',

    /**
     * 获得suggestion的外框HTML string
     * @private
     * @return {String}
     */
    getString: function() {
        var me = this;
        return baidu.format(
            me.tplDOM,
            me.getId(),
            me.getClass(),
            me.guid
        );
    },

    /**
     * 将suggestion渲染到dom树中
     * @public
     * @param {HTMLElement} target
     * @return {Null}
     */
    render: function(target) {
        var me = this,
            main,
            target = baidu.g(target);

        if (me.getMain() || !target) {
            return;
        }
        if (target.id) {
            me.targetId = target.id;
        }else {
            me.targetId = target.id = me.getId('input');
        }

        main = me.renderMain();

        main.style.display = 'none';
        main.innerHTML = me.getString();

        this.dispatchEvent('onload');
    },

    /**
     * 当前suggestion是否处于显示状态
     * @private
     * @return {Boolean}
     */
    _isShowing: function() {
        var me = this,
            main = me.getMain();
        return main && main.style.display != 'none';
    },

    /**
     * 把某个词放到input框中
     * @public
	 * @param {String} index 条目索引.
     * @return {Null}
     */
    pick: function(index) {
        var me = this,
            currentData = me.currentData,
            word = currentData && typeof index == 'number' && typeof currentData[index] != 'undefined' ? currentData[index].value : index,
            eventData = {
                data: {
                    item: word == index ? {value: index, content: index} : currentData[index],
                    index: index
                }
            };

        if (me.dispatchEvent('onbeforepick', eventData)) {
            me.dispatchEvent('onpick', eventData);
        }
    },

    /**
     * 绘制suggestion
     * @public
     * @param {String}  word 触发sug的字符串.
     * @param {Object}  data suggestion数据.
     * @param {Boolean} [showEmpty] 如果sug数据为空是否依然显示 默认为false.
     * @return {Null}
     */
    show: function(word, data, showEmpty) {

        var i = 0,
            len = data.length,
            me = this;

        me.enableIndex = [];
        me.currentIndex = -1;

        if (len == 0 && !showEmpty) {
            me.hide();
        } else {
            me.currentData = [];
            for (; i < len; i++) {
                if (typeof data[i].value != 'undefined') {
                    me.currentData.push(data[i]);
                }else {
                    me.currentData.push({
                        value: data[i],
                        content: data[i]
                    });
                }
                if (typeof data[i]['disable'] == 'undefined' || data[i]['disable'] == false) {
                    me.enableIndex.push(i);
                }
            }

            me.getBody().innerHTML = me._getBodyString();
            me.getMain().style.display = 'block';
            me.dispatchEvent('onshow');
        }
    },

    /**
     * 隐藏suggestion
     * @public
     * @return {Null}
     */
    hide: function() {
        var me = this;

        //如果已经是隐藏状态就不用派发后面的事件了
        if (!me._isShowing())
            return;

        me.getMain().style.display = 'none';
        me.dispatchEvent('onhide');
    },

    /**
     * 高亮某个条目
     * @public
	 * @param {String} index 条目索引.
     * @return {Null}
     */
    highLight: function(index) {
        var me = this,
            enableIndex = me.enableIndex,
            item = null;

        //若需要高亮的item被设置了disable，则直接返回
        if (!me._isEnable(index)) return;

        me.currentIndex >= 0 && me._clearHighLight();
        item = me._getItem(index);
        baidu.addClass(item, me.getClass('current'));
        me.currentIndex = baidu.array.indexOf(enableIndex, index);

        me.dispatchEvent('onhighlight', {
            index: index,
            data: me.getDataByIndex(index)
        });
    },

    /**
     * 清除item高亮状态
     * @public
     * @return {Null}
     */
    clearHighLight: function() {
        var me = this,
            currentIndex = me.currentIndex,
            index = me.enableIndex[currentIndex];

        //若当前没有元素处于高亮状态，则不发出事件
        me._clearHighLight() && me.dispatchEvent('onclearhighlight', {
            index: index,
            data: me.getDataByIndex(index)
        });
    },

    /**
     * 清除suggestion中tr的背景样式
     * @private
     * @return {Boolean} bool 当前有item处于高亮状态并成功进行clear highlight,返回true，否则返回false.
     */
    _clearHighLight: function() {
        var me = this,
            currentIndex = me.currentIndex,
            enableIndex = me.enableIndex,
            item = null;

        if (currentIndex >= 0) {
            item = me._getItem(enableIndex[currentIndex]);
            baidu.removeClass(item, me.getClass('current'));
            me.currentIndex = -1;
            return true;
        }
        return false;
    },

    /**
     * confirm指定的条目
	 * @public
     * @param {Number|String} index or item.
     * @param {String} source 事件来源.
     * @return {Null}
     */
    confirm: function(index, source) {
        var me = this;

        if (source != 'keyboard') {
            if (!me._isEnable(index)) return;
        }

        me.pick(index);
        me.dispatchEvent('onconfirm', {
            data: me.getDataByIndex(index) || index,
            source: source
        });
        me.currentIndex = -1;
        me.hide();
    },

    /**
     * 根据index拿到传给event的data数据
     * @private
     * @return {Object}
     * @config {HTMLElement} item
     * @config {Number} index
     */
    getDataByIndex: function(index) {

        return {
            item: this.currentData[index],
            index: index
        };
    },

    /**
     * 获得target的值
     * @public
     * @return {String}
     */
    getTargetValue: function() {
        return this.getTarget().value;
    },

    /**
     * 获得input框元素
     * @public
	 * @return {HTMLElement}
     */
    getTarget: function() {
        return baidu.g(this.targetId);
    },

    /**
     * 获得指定的条目
     * @private
     * @return {HTMLElement}
     */
    _getItem: function(index) {
        return baidu.g(this.getId('item' + index));
    },

    /**
     * 渲染body部分的string
     * @private
     * @return {String}
     */
    _getBodyString: function() {

        var me = this,
            html = '',
            itemsHTML = [],
            data = me.currentData,
            len = data.length,
            i = 0;

        function getPrependAppend(name) {
            return baidu.format(
                me.tplPrependAppend,
                me.getId(name),
                me.getClass(name),
                me[name + 'HTML']
            );
        }


        html += getPrependAppend('prepend');

        for (; i < len; i++) {
            itemsHTML.push(baidu.format(
                me.tplRow,
                me.getId('item' + i),
                data[i].content,
                me.getCallRef() + '._itemOver(event, ' + i + ')',
                me.getCallRef() + '._itemOut(event, ' + i + ')',
                me.getCallRef() + '._itemDown(event, ' + i + ')',
                me.getCallRef() + '._itemClick(event, ' + i + ')',
                (typeof data[i]['disable'] == 'undefined' || data[i]['disable'] == false) ? '' : me.getClass('disable')
            ));
        }

        html += baidu.format(me.tplBody, itemsHTML.join(''));
        html += getPrependAppend('append');
        return html;
    },

    /**
     * 当焦点通过鼠标或键盘移动到某个条目
     * @private
     * @param {Event} e
     * @param {Number} index
     * @return {Null}
     */
    _itemOver: function(e, index) {
        var me = this;
        baidu.event.stop(e || window.event);
        me._isEnable(index) && me.highLight(index);

        me.dispatchEvent('onmouseoveritem', {
            index: index,
            data: me.getDataByIndex(index)
        });
    },

    /**
     * 当焦点通过鼠标或键盘移出某个条目
     * @private
     * @param {Event} e
     * @param {Number} index
     * @return {Null}
     */
    _itemOut: function(e, index) {
        var me = this;
        baidu.event.stop(e || window.event);
        me._isEnable(index) && me.clearHighLight();

        me.dispatchEvent('onmouseoutitem', {
            index: index,
            data: me.getDataByIndex(index)
        });
    },

    /**
     * 当通过鼠标选中某个条目
     * @private
     * @param {Event} e
     * @param {Number} index
     * @return {Null}
     */
    _itemDown: function(e, index) {
        var me = this;
        baidu.event.stop(e || window.event);

        me.dispatchEvent('onmousedownitem', {
            index: index,
            data: me.getDataByIndex(index)
        });
    },

    /**
     * 当鼠标点击某个条目
     * @private
     * @param {Event} e
     * @param {Number} index
     * @return {Null}
     */
    _itemClick: function(e, index) {
        var me = this;
        baidu.event.stop(e || window.event);

        me.dispatchEvent('onitemclick', {
            index: index,
            data: me.getDataByIndex(index)
        });

        me._isEnable(index) && me.confirm(index, 'mouse');
    },

    /**
     * 判断item是否处于enable状态
     * @param {Number} index 索引，和传入的data中相同.
     * @return {Boolean}
     */
    _isEnable: function(index) {
        var me = this;
        return baidu.array.contains(me.enableIndex, index);
    },

    /**
     * 外部事件绑定
     * @private
     * @return {Function}
     */
    _getDocumentMousedownHandler: function() {
        var me = this;
        return function(e) {
            // todo : baidu.event.getTarget();
            e = e || window.event;
            var element = e.target || e.srcElement,
                ui = baidu.ui.get(element);
            //如果在target上面或者me内部
            if (element == me.getTarget() || (ui && ui.uiType == me.uiType)) {
                return;
            }
            me.hide();
        };
    },

    /**
     * 外部事件绑定
     * @private
     * @return {Function}
     */
    _getWindowBlurHandler: function() {
        var me = this;
        return function() {
            me.hide();
        };
    },

    /**
     * 销毁suggesiton
     * @public
     * @return {Null}
     */
    dispose: function() {
        var me = this;
        me.dispatchEvent('dispose');

        baidu.un(document, 'mousedown', me.documentMousedownHandler);
        baidu.un(window, 'blur', me.windowBlurHandler);
        baidu.dom.remove(me.mainId);

        baidu.lang.Class.prototype.dispose.call(this);
    }
});

baidu.extend(baidu.ui.Suggestion.prototype, {
    coverable: true,
    coverableOptions: {}
});

baidu.ui.Suggestion.register(function(me) {

    if (me.coverable) {

        me.addEventListener('onshow', function() {
            me.Coverable_show();
        });

        me.addEventListener('onhide', function() {
            me.Coverable_hide();
        });
    }
});

/**
 * 为Suggestion提供数据内存缓存
 * 扩展这里可做本地缓存
 * @author berg
 */

baidu.ui.Suggestion.extend({
    /*
     * 设置一组数据给suggestion
     * 调用者可以选择是否立即显示这组数据: noShow
     * @public
     * @return {null}
     */
    setData: function(word, data, noShow) {
        var me = this;
		me.dataCache[word] = data;
        if (!noShow) {
            me.show(word, me.dataCache[word]);
        }
    }
});

baidu.ui.Suggestion.register(function(me) {
    //初始化dataCache
    me.dataCache = {},
    /*
     * 获取一个词对应的me数据
     * 通过事件返回结果
     */
    me.addEventListener('onneeddata', function(ev, word) {
        var dataCache = me.dataCache;
        if (typeof dataCache[word] == 'undefined') {
            //没有数据就去取数据
            me.getData(word);
        }else {
            //有数据就直接显示
            me.show(word, dataCache[word]);
        }
    });
});

/**
 * 为Suggestion提供位置校准功能
 * @author berg
 */
baidu.ui.Suggestion.extend({
    posable: true,
    fixWidth: true,
    getWindowResizeHandler: function() {
        var me = this;
        return function() {
            me.adjustPosition(true);
        };
    },

	/*
     * 重新放置suggestion
     * @private
     */
    adjustPosition: function(onlyAdjustShown) {
       var me = this,
            target = me.getTarget(),
            targetPosition,
            main = me.getMain(),
            pos;

        if (!me._isShowing() && onlyAdjustShown) {
            return;
        }
        targetPosition = baidu.dom.getPosition(target),
        pos = {
                top: (targetPosition.top + target.offsetHeight - 1),
                left: targetPosition.left,
                width: target.offsetWidth
            };
        //交给用户的view函数计算
        pos = typeof me.view == 'function' ? me.view(pos) : pos;

        me.setPosition([pos.left, pos.top], null, {once: true});
        baidu.dom.setOuterWidth(main, pos.width);
    }
});
baidu.ui.Suggestion.register(function(me) {

    me.windowResizeHandler = me.getWindowResizeHandler();

    me.addEventListener('onload', function() {
        me.adjustPosition();
        //监听搜索框与suggestion弹出层的宽度是否一致。
        if (me.fixWidth) {
            me.fixWidthTimer = setInterval(function() {
                var main = me.getMain(),
                    target = me.getTarget();
                if (main.offsetWidth != 0 && target && target.offsetWidth != main.offsetWidth) {
                    me.adjustPosition();
                    main.style.display = 'block';
                }
            }, 100);
        }
        //当窗口变化的时候重新放置
        baidu.on(window, 'resize', me.windowResizeHandler);
    });

    //每次出现的时候都重新定位，保证用户在初始化之后修改了input的位置，也不会出现混乱
    me.addEventListener('onshow', function() {
        me.adjustPosition();
    });

    me.addEventListener('ondispose', function() {
        baidu.un(window, 'resize', me.windowResizeHandler);
        clearInterval(me.fixWidthTimer);
    });

});

baidu.ui.Suggestion.register(function(me) {
    var target,

        //每次轮询获得的value
        oldValue = '',

        //一打开页面就有的input value
        keyValue,

        //使用pick方法上框的input value
        pickValue,
        mousedownView = false,
        stopCircleTemporary = false;


    me.addEventListener('onload', function() {
        target = this.getTarget();

        keyValue = target.value;

        //生成dom事件函数
        me.targetKeydownHandler = me.getTargetKeydownHandler();

        //加入dom事件
        baidu.on(target, 'keydown', me.targetKeydownHandler);

        target.setAttribute('autocomplete', 'off');

        //轮询计时器
        me.circleTimer = setInterval(function() {
            if (stopCircleTemporary) {
                return;
            }

            if (baidu.g(target) == null) {
                me.dispose();
            }

            var nowValue = target.value;
            //todo,这里的流程可以再简化一点
            if (
                nowValue == oldValue &&
                nowValue != '' &&
                nowValue != keyValue &&
                nowValue != pickValue
              ) {
                if (me.requestTimer == 0) {
                    me.requestTimer = setTimeout(function() {
                        me.dispatchEvent('onneeddata', nowValue);
                    }, 100);
                }
            }else {
                clearTimeout(me.requestTimer);
                me.requestTimer = 0;
                if (nowValue == '' && oldValue != '') {
                    pickValue = '';
                    me.hide();
                }
                oldValue = nowValue;
                if (nowValue != pickValue) {
                    me.defaultIptValue = nowValue;
                }
                if (keyValue != target.value) {
                    keyValue = '';
                }
            }
        }, 10);

        baidu.on(target, 'beforedeactivate', me.beforedeactivateHandler);
    });

    me.addEventListener('onitemclick', function() {
        stopCircleTemporary = false;
        //更新oldValue，否则circle的时候会再次出现suggestion
        me.defaultIptValue = oldValue = me.getTargetValue();
    });

    me.addEventListener('onpick', function(event) {
        //firefox2.0和搜狗输入法的冲突
        if (mousedownView)
            target.blur();
        target.value = pickValue = event.data.item.value;
        if (mousedownView)
            target.focus();
    });

    me.addEventListener('onmousedownitem', function(e) {
        mousedownView = true;
        //chrome和搜狗输入法冲突的问题
        //在chrome下面，输入到一半的字会进框，如果这个时候点击一下suggestion，就会清空里面的东西，导致suggestion重新被刷新
        stopCircleTemporary = true;
        setTimeout(function() {
            stopCircleTemporary = false;
            mousedownView = false;
        },500);
    });
    me.addEventListener('ondispose', function() {
        baidu.un(target, 'keydown', me.targetKeydownHandler);
        baidu.un(target, 'beforedeactivate', me.beforedeactivateHandler);
        clearInterval(me.circleTimer);
    });
});

baidu.ui.Suggestion.extend({
    /*
     * IE和M$输入法打架的问题
     * 在失去焦点的时候，如果是点击在了suggestion上面，那就取消其默认动作(默认动作会把字上屏)
     */
    beforedeactivateHandler: function() {
        return function() {
            if (mousedownView) {
                window.event.cancelBubble = true;
                window.event.returnValue = false;
            }
        };
    },

    getTargetKeydownHandler: function() {
        var me = this;

        /*
         * 上下键对suggestion的处理
         */
        function keyUpDown(up) {

            if (!me._isShowing()) {
                me.dispatchEvent('onneeddata', me.getTargetValue());
                return;
            }

            var enableIndex = me.enableIndex,
                currentIndex = me.currentIndex;

            //当所有的data都处于disable状态。直接返回
            if (enableIndex.length == 0) return;
            if (up) {
                switch (currentIndex) {
                    case -1:
                        currentIndex = enableIndex.length - 1;
                        me.pick(enableIndex[currentIndex]);
                        me.highLight(enableIndex[currentIndex]);
                        break;
                    case 0:
                        currentIndex = -1;
                        me.pick(me.defaultIptValue);
                        me.clearHighLight();
                        break;
                    default:
                        currentIndex--;
                        me.pick(enableIndex[currentIndex]);
                        me.highLight(enableIndex[currentIndex]);
                        break;
                }
            }else {
                switch (currentIndex) {
                    case -1:
                        currentIndex = 0;
                        me.pick(enableIndex[currentIndex]);
                        me.highLight(enableIndex[currentIndex]);
                        break;
                    case enableIndex.length - 1:
                        currentIndex = -1;
                        me.pick(me.defaultIptValue);
                        me.clearHighLight();
                        break;
                    default:
                        currentIndex++;
                        me.pick(enableIndex[currentIndex]);
                        me.highLight(enableIndex[currentIndex]);
                        break;
                }
            }
            me.currentIndex = currentIndex;
        }
        return function(e) {
            var up = false, index;
            e = e || window.event;
            switch (e.keyCode) {
                case 9:     //tab
                case 27:    //esc
                    me.hide();
                    break;
                case 13:    //回车，默认为表单提交
                    baidu.event.stop(e);
                    me.confirm( me.currentIndex == -1 ? me.getTarget().value : me.enableIndex[me.currentIndex], 'keyboard');
                    break;
                case 38:    //向上，在firefox下，按上会出现光标左移的现象
                    up = true;
                case 40:    //向下
                    baidu.event.stop(e);
                    keyUpDown(up);
                    break;
                default:
                   me.currentIndex = -1;
            }
        };
    },

    /*
     * pick选择之外的oldValue
     */
    defaultIptValue: ''

});



/**
 * 表格翻页的插件
 * @param   {Object} options config参数
 * @config  {Number} pageSize 一页显多少行的数字表示形式
 */
baidu.ui.Table.register(function(me){
	me._createPage();
	me.addEventListener("beforeupdate", function(){
		me._createPage();
	});
});
//
baidu.object.extend(baidu.ui.Table.prototype, {
	currentPage : 1,	//当前页
//	pageSize : 10,	//没有默认值，如果在options中设定了该值表示要分页，不设定则表示全部显示
	_createPage : function(){
		var me = this;
		me.dataSet = me.data || [];
		if(me.pageSize){//如果需要分页
			me.data = me.data.slice(0, me.pageSize);
		}
	},
	/**
	 * 直接翻到索引指定的页数
	 * @param {Object} index
	 * @memberOf {TypeName} 
	 */
	gotoPage : function(index){
		var me = this,
			index = index <= 0 ? 1 : Math.min(index, me.getTotalPage()),//对页数的修正
			offset = (index - 1) * me.pageSize,
			data = me.dataSet.slice(offset, offset + me.pageSize),
			i = 0,
			row;
		for(; i < me.pageSize; i++){
			row = me.getRow(i);
			if(data[i]){
				if(row){
					row.update(data[i]);
				}else{
					me.dispatchEvent("addrow", {rowId : me._addRow(data[i])});
				}
			}else{
				if(row){
					me.dispatchEvent("removerow", {rowId : me._removeRow(i--)});
				}
			}
		}
		me.data = data;
		me.currentPage = index;
		me.dispatchEvent("gotopage");
	},
	
	/**
	 * 翻到上一页
	 * @memberOf {TypeName} 
	 */
	prevPage : function(){
		var me = this;
		me.gotoPage(--me.currentPage);
	},
	
	/**
	 * 翻到下一页
	 * @memberOf {TypeName} 
	 */
	nextPage : function(){
		var me = this;
		me.gotoPage(++me.currentPage);
	},
	
	/**
	 * 取得总记录数
	 * @memberOf {TypeName} 
	 * @return {number} 
	 */
	getTotalCount : function(){
		return this.dataSet.length;
	},
	
	/**
	 * 取得总页数
	 * @memberOf {TypeName} 
	 * @return {number} 
	 */
	getTotalPage : function(){
		var me = this;
		return baidu.lang.isNumber(me.pageSize) ? Math.ceil(me.dataSet.length/me.pageSize)
		  : me.currentPage;
	},
	
	/**
	 * 取得当前页数
	 * @memberOf {TypeName} 
	 * @return {number} 
	 */
	getCurrentPage : function(){
		return this.currentPage;
	},
	
	/**
	 * 新增一个行，
	 * @param {Object} options 格式同table的addRow
	 * @param {Number} index 在索引的行之前插入，可选项，默认值是在最后插入
	 * @memberOf {TypeName} 
	 */
	addRow : function(options, index){
		var me = this,
			index = baidu.lang.isNumber(index) ? index : me.getTotalCount(),
			currPage = me.getCurrentPage(),
			instPage = Math.ceil((index + 1) / me.pageSize),
			data = options,
			rowId;
		if(me.pageSize){
			me.dataSet.splice(index, 0, data);
            if(currPage >= instPage){//addrow
                index %= me.pageSize;
                if(currPage != instPage){
                    data = me.dataSet[(currPage - 1) * me.pageSize];
                    index = 0;
                }
                rowId = me._addRow(data, index);
                if(me.getRowCount() > me.pageSize){//removerow
                    me.dispatchEvent("removerow", {rowId : me._removeRow(me.getRowCount() - 1)});
                }
            }
            me.dispatchEvent("addrow", {rowId : rowId});
		}else{
			me.dispatchEvent("addrow", {rowId : me._addRow(options, index)});
		}	
	},
	
	/**
	 * 移除一个行
	 * @param {Object} index 需要移除的行的索引
	 * @memberOf {TypeName} 
	 */
	removeRow : function(index){
		var me = this,
			currPage = me.getCurrentPage(),
			delePage = Math.ceil((index + 1) / me.pageSize),
			removeRowId,
			data;
		if(me.pageSize){
			me.dataSet.splice(index, 1);
	        if(currPage >= delePage){
	            index = currPage != delePage? 0 : index % me.pageSize;
	            removeRowId = me._removeRow(index);
	            data = me.dataSet[currPage * me.pageSize - 1];//-1是上面删除了的一个
	            if(data){
	                me.dispatchEvent("addrow", {rowId : me._addRow(data)});
	            }
	        }
	        me.dispatchEvent("removerow", {rowId : removeRowId});
		}else{
			me.dispatchEvent("removerow", {rowId : me._removeRow(index)});
		}
	}
});






/**
 * 使单元格支持编辑
 * @param {Object} options config参数
 * @config {Object} widthPager 当该参数要在table的结尾处增加翻页按钮
 */
baidu.ui.Table.register(function(me){
    me.addEventListeners("load, update", function(){
        if(me.withPager){
            baidu.dom.insertHTML(me.getTarget(), "beforeEnd", "<div id='" + me.getId("-pager") + "' align='right'></div>");
            me.pager = new baidu.ui.Pager({
                endPage : me.getTotalPage() + 1,
                ongotopage : function(evt){me.gotoPage(evt.page);}
            });
            me.pager.render(me.getPagerContainer());
            me.addEventListeners("addrow, removerow", function(){
                me.pager.update({endPage : me.getTotalPage() + 1});
            });
            me.resize();
            baidu.event.on(window, "resize", function(){me.resize();});
        }
    });
});

baidu.object.extend(baidu.ui.Table.prototype, {
    /**
     * 取得存放pager的容器
     * @memberOf {TypeName} 
     * @return {html-element} 
     */
    getPagerContainer : function(){
        return baidu.g(this.getId("-pager"));
    },
    
    /**
     * 重设pager容器的大小
     * @memberOf {TypeName} 
     */
    resize : function(){
        var me = this;
        baidu.dom.setStyle(me.getPagerContainer(), "width", me.getBody().offsetWidth + "px");
    }
});
/**
 * 使单元格支持编辑
 * @param {Object} options config参数
 * @config {Object} columns，在columns的数据描述中加入enableEdit属性并设置为true表示该支持可双击紡辑，如：{index:0, enableEdit: true}
 */
baidu.ui.Table.register(function(me){
    //me._editArray = [];    //存入用户设置的需要编辑的行对象
    //me._textField;        //编辑的通用input
    if(!me.columns){return;}
    me.addEventListeners('load, update', function(){
        var i = 0,
            rowCount = me.getRowCount(),
            editArray = me._editArray = [],
            field = me._textField = new baidu.ui.Input({//这里每次update都会innerHTML,则每次都得新建input
                element: me.getMain(),
                autoRender: true
            });
        field.getBody().onblur = baidu.fn.bind('_cellBlur', me);
        baidu.dom.hide(field.getBody());
        baidu.array.each(me.columns, function(item){
            if(item.hasOwnProperty('enableEdit')){
                editArray.push(item);
            }
        });
        for(; i < rowCount; i++){
            me.attachEdit(me.getRow(i));
        }
    });
});
//
baidu.object.extend(baidu.ui.Table.prototype, {
    /**
     * 绑定一行中的某列拥有双击事件
     * @param {baidu.ui.table.Row} row 行对象
     * @memberOf {TypeName} 
     */
    attachEdit : function(row){
        var me = this;
        baidu.array.each(me._editArray, function(item){
            var cell = row.getBody().cells[item.index];
                cell.ondblclick = item.enableEdit ? baidu.fn.bind('_cellFocus', me, cell)
                    : null;
        });
    },
    
    /**
     * 当双击单元格时取得焦点实现编辑
     * @param {HTMLElement} cell 一个td对象
     * @param {Event} evt 浏览器的事件对象
     */
    _cellFocus : function(cell, evt){
        var me = this,
            input = me._textField.getBody(),
            cellWidth = cell.clientWidth;//当是自适应模式时，这里需要先把clientWidth保存
        if(baidu.event.getTarget(evt || window.event).id == input.id){return;}
        input.value = cell.innerHTML;
        cell.innerHTML = '';
        //input.style.width = '0px';//当是自适应模式是时，需要先设为0
        cell.appendChild(input);
        baidu.dom.show(input);
        input.style.width = cellWidth
            - input.offsetWidth
            + input.clientWidth + 'px';
        input.focus();
        input.select();
    },
    
    /**
     * 失去单元格焦点时编辑数据写回单元格
     * @param {Object} evt
     */
    _cellBlur : function(evt){
        var me = this,
            target = baidu.event.getTarget(evt || window.event),
            cell = baidu.dom.getAncestorByTag(target, "td");
        baidu.dom.hide(target);
        me.getTarget().appendChild(target);
        cell.innerHTML = target.value;
    }
});

/* BASE: baidu/object/values.js */


/**
 * 增加选择列的插件
 * @param   {Object} options config 参数
 * @config  {Object} columns，在columns的数据描述中加入type属性并设置为'checkbox'表示该列支持checkbox，如：{index:0, type: 'checkbox'}
 */
baidu.ui.Table.register(function(me){
//	me._selectedItems = {};      //当前选中的id:checkbox-id, data:row-data
//	me._checkboxList = {};       //所有的 row-id 和 checkbox-id 对照表
//  me._checkboxDomList = {};    //提高全选性能，提有DOM节点
	if(me.columns){
		me.addEventListeners("load, update", function(){
			me._selectedItems = {};
			me._checkboxList = {};
			me._checkboxDomList = {};
			me._createSelect();
		});
		me.addEventListeners({
			addrow : function(evnt){
				me.addCheckbox(evnt.rowId, me._selectIndex);
			},
			removerow : function(evnt){
				me.removeCheckbox(evnt.rowId);
			},
			gotopage : function(){
				me.unselectAll();
			}
		});
	}
});

baidu.object.extend(baidu.ui.Table.prototype, {
	tplSelect : '<input id="#{id}" type="checkbox" value="#{value}" onclick="#{handler}"/>', //这里事件使用onchange时ie会有问题
//	titleCheckboxId : null,   //表格头部id
	/**
	 * 当存在title时创建一个全选的checkbox
	 * @param {Number} index 列索引
	 * @memberOf {TypeName} 
	 */
	_createTitleScelect : function(index){
		var me = this;
		me.titleCheckboxId = me.titleCheckboxId || me.getId("checkboxAll");
		baidu.dom.insertHTML(me.getTitleBody().rows[0].cells[index], "beforeEnd",
			baidu.string.format(me.tplSelect, {
				id : me.titleCheckboxId,
				value : "all",
				handler : me.getCallString("toggleAll")
			})
		);
	},
	
	/**
	 * 在指定的clumnIndex中创建一列带checkbox的选择列
	 * @memberOf {TypeName} 
	 */
	_createSelect : function(){
		var me = this,
			rowCount = me.getRowCount(),
			i = 0,
			index;
		baidu.array.each(me.columns, function(item){//取出列索引
			if(item.hasOwnProperty("type") && item.type.toLowerCase() == "checkbox"){
				me._selectIndex = index = item.index;
				return false;
			}
		});
		if(me.title && baidu.lang.isNumber(index)){//如果存在表格标题,生成全选checkbox
			if(me.getTitleBody()){//这里和$title插件存在文件载入先后关联
				me._createTitleScelect(index);
			}else{
				me.addEventListener("titleload", function(){
					me._createTitleScelect(index);
					me.removeEventListener("titleload", arguments.callee);
				});
			}
		}
		if(baidu.lang.isNumber(index)){
			for(;i < rowCount; i++){//生成各行的checkbox
				me.addCheckbox(me.getRow(i).getId(), index);
			}
		}
	},
	
	/**
	 * 生成单个ceckbox的字符
	 * @param {baidu.ui.table.Row} row 行组件
	 * @memberOf {TypeName} 
	 * @return {string}
	 */
	_getSelectString : function(row){
		var me = this,
			rsid = row.getId("checkbox");
		me._checkboxList[row.getId()] = rsid;
		me._checkboxDomList[row.getId()] = rsid;
		return baidu.string.format(me.tplSelect, {
			id : rsid,
			value : row.id ? row.id : row.guid,
			handler : me.getCallString("toggle", rsid)
		});
	},
	
	/**
	 * 添加单个checkbox到行中
	 * @param {String} rowId 该行的id
	 * @memberOf {TypeName} 
	 */
	addCheckbox : function(rowId, index){
		var me = this, row, cell, checkboxStr;
		if(baidu.lang.isNumber(index)){
			row = baidu.ui.get(baidu.g(rowId)),
			cell = row.getBody().cells[index],
			checkboxStr = me._getSelectString(row);
			baidu.dom.insertHTML(cell, "beforeEnd", checkboxStr);
			baidu.dom.setAttr(cell, "align", "center");
			row.addEventListener("update", function(){
				baidu.dom.insertHTML(cell, "beforeEnd", checkboxStr);
			});
			me._checkboxDomList[rowId] = baidu.dom.g(me._checkboxDomList[rowId]);
		}
	},
	
	/**
	 * 移除一个checkbox
	 * @param {Object} rowId 该行的id
	 * @memberOf {TypeName} 
	 */
	removeCheckbox : function(rowId){
		var me = this;
		delete me._selectedItems[me._checkboxList[rowId]];
		delete me._checkboxList[rowId];
		delete me._checkboxDomList[rowId];
	},
	
	/**
	 * 取得表格标题的全选checkbox
	 * @memberOf {TypeName} 
	 * @return {html-element} 
	 */
	getTitleCheckbox : function(){
		return baidu.dom.g(this.titleCheckboxId);
	},
	
	/**
	 * 设置一个自定义的全选checkbox
	 * @param {String} checkboxId 该checkbox的id
	 * @memberOf {TypeName}
	 */
	setTitleCheckbox : function(checkbox){
		this.titleCheckboxId = checkbox.id || checkbox;
	},
	
	/**
	 * 根据checkbox对象状态来维护选中的MAP
	 * @param {Object} checkboxId
	 * @memberOf {TypeName} 
	 */
	_setSelectItems : function(checkboxId){
		var me = this,
			checkbox = baidu.g(checkboxId),
			row;
		if(checkbox.checked){
			row = baidu.ui.get(baidu.dom.getAncestorByTag(checkboxId, "TR"));
			me._selectedItems[checkbox.id] = row.id || row;
		}else{
			delete me._selectedItems[checkbox.id];
		}
	},
	
	/**
	 * 根据给定的索引设置checkbox的选中或返选状态
	 * @param {Array} indexArr 格式[1, 4],当是null时默认值是_checkboxList
	 * @param {Boolean} val true:选中, false:反选
	 * @memberOf {TypeName}_setCheckboxState
	 */
	_setCheckboxState : function(indexArr, val){
		var me = this,
			indexArr = baidu.lang.isNumber(indexArr) ? [indexArr] : indexArr,	//索引
			rsidList = [],	//checkbox-id array
			checkbox;
		if(indexArr){
			baidu.array.each(indexArr, function(item){
				rsidList.push(me._checkboxDomList[me.getRow(item).getId()]);
			});
		}else{
			rsidList = baidu.object.values(me._checkboxDomList);
		}
		baidu.array.each(rsidList, function(checkbox){
			if(val && !checkbox.checked){
				checkbox.checked = true;
			}else if(!val && checkbox.checked){
				checkbox.checked = false;
			}
			if(indexArr){//单选
				me.toggle(checkbox);
			}else{
				me._setSelectItems(checkbox);
			}
		});
	},
	
	/**
	 * 根据给定的数组索引选中checkbox
	 * @param {Object} indexArr 格式：[1, 3, 8]
	 * @memberOf {TypeName} 
	 */
	select : function(indexArr){
		this._setCheckboxState(indexArr, true);
	},
	
	/**
	 * 根据给定的数组索引反选checkbox
	 * @param {Object} indexArr
	 * @memberOf {TypeName} 
	 */
	unselect : function(indexArr){
		this._setCheckboxState(indexArr, false);
	},
	
	/**
	 * 单项的切换选中或反选
	 * @param {Object} rsid
	 * @memberOf {TypeName} 
	 */
	toggle : function(rsid){
		var me = this,
			titleCheckbox = me.getTitleCheckbox(),
			checkbox = baidu.g(rsid),
			len;
		me._setSelectItems(rsid);//选中反选处理数据
		if(checkbox.checked){
			len = baidu.object.keys(me._selectedItems).length;
			if(titleCheckbox && !titleCheckbox.checked
				&& len == baidu.object.keys(me._checkboxList).length){
					titleCheckbox.checked = true;
			}
		}else{
			if(titleCheckbox && titleCheckbox.checked){
				titleCheckbox.checked = false;
			}
		}
	},
	
	/**
	 * 全部选中checkbox
	 * @memberOf {TypeName} 
	 */
	selectAll : function(){
		this._setCheckboxState(null, true);
	},
	
	/**
	 * 全部反选checkbox
	 * @memberOf {TypeName} 
	 */
	unselectAll : function(){
		this._setCheckboxState(null, false);
	},
	
	/**
	 * 当全选的checkbox存在时才可以切换全选和全反选
	 * @memberOf {TypeName} 
	 */
	toggleAll : function(){
		var me = this, checkbox = me.getTitleCheckbox();
		if(checkbox){
			this._setCheckboxState(null, checkbox.checked);
		}
	},
	
	/**
	 * 取得已经选中的数据，如果该行的row.data中设置id则返回所选中的id数组，否则返回该row的data
	 * @memberOf {TypeName} 
	 * @return {TypeName} 
	 */
	getSelected : function(){
		return baidu.object.values(this._selectedItems);
	}
});
/**
 * 增加列标题
 * @param   {Object} optoins config参数
 * @config  {Object} title 在表格头上增加一个行来说明各个表格列的标题，参数格式：['column-1', 'column-2', 'column-3'...]
 */
baidu.ui.Table.register(function(me){
	if(me.title){
		me.addEventListeners("load, update", function(){
			if(!me.getTitleBody()){
				baidu.dom.insertHTML(me.getTarget(), "afterBegin", me._getTitleString());
				me.dispatchEvent("titleload");//这个事件派发主要是解决select插件
				baidu.dom.setStyles(me.getBody(), {tableLayout : "fixed"});//这一步设置需要在getTitleBody之前，防止宽度提前撑开
				baidu.dom.setStyles(me.getTitleBody(), {width : me.getBody().offsetWidth + "px", tableLayout : "fixed"});//这个地方很奇怪，不能用clientWidth，需要用offsetWidth各浏览器才显示正确
				
			}
			if(me.getTitleBody() && me.columns){
				baidu.array.each(me.columns, function(item){
					if(item.hasOwnProperty("width")){
						baidu.dom.setStyles(me.getTitleBody().rows[0].cells[item.index], {width : item.width});
					}
				});
			}
		});
		//
		me.addEventListener("addrow", function(){
            if(me.getRowCount() == 1){
            	baidu.dom.setStyles(me.getTitleBody(), {width : me.getBody().offsetWidth + "px"});//当是IE6时，当没有row时，offsetWidth会为0
            }
		});
	}
});
//
baidu.object.extend(baidu.ui.Table.prototype, {
	tplTitle : '<div><table id="#{rsid}" class="#{tabClass}" cellspacing="0" cellpadding="0" border="0"><tr class="#{trClass}">#{col}</tr></table></div>',
	
	/**
	 * 取得表格列标题的拼接字符串
	 * @memberOf {TypeName} 
	 * @return {TypeName} 
	 */
	_getTitleString : function(){
		var me = this,
			col = [],
			clazz = "";
		baidu.array.each(me.title, function(item){
			col.push("<td>", item, "</td>");
		});
		return baidu.string.format(me.tplTitle, {
			rsid : me.getId("title"),
			tabClass : me.getClass("title"),
			trClass : me.getClass("title-row"),
			col : col.join("")
		});
	},
	
	/**
	 * 取得表格的table对象
	 * @memberOf {TypeName} 
	 * @return {html-element} 
	 */
	getTitleBody : function(){
		return baidu.g(this.getId("title"));
	}
});
/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */


















/**
 * @class   toolBar基类，建立toolBar实例
 * @param   {Object}    options config参数.
 * @config  {String}    [title=""]  toolbar的title参数，默认为空.
 * @config  {String}    [name="ToolBar_item_xxx"]   name参数，每个toolbar对象都有一个name参数.
 * @config  {String}    [direction="horizontal"]    有效值:"vertical","horizontal" toolbar只能在横向和纵向之间进行选择，默认为横向，及"horizontal".
 * @config  {String}    [position="left" | "top"]   当direction为horizontal时，默认值为left;当direction为vertical时,默认值为top.
 *                                                  align有效值:'left', 'right', 'center', 'justify', 'inherit'
                                                    valign有效值:'top', 'middle', 'bottom', 'baseline'
 * @config  {String|Number} [width]     宽度.
 * @config  {String|Number} [height]    高度.
 * @config  {String|HTMLElement}    [container=document.body]   实例容器.
 * @config  {Array}     [items] Object数组，创建ui的JSON.
 * @config  {String}    [type="button"] ui控件类型
 * @config  {Object}    [config]    创建ui控件所需要的config参数.
 * @author  lixiaopeng
 */
baidu.ui.Toolbar = baidu.ui.createUI(function(options) {
    var me = this,
        positionCheck = false,
        positionPrefix = 'align="';

    me._itemObject = {};
    me.items = me.items || {};
   
    if(me.direction != 'horizontal'){
        me.direction = 'vertical';
        !baidu.array.contains(['top', 'middle', 'bottom', 'baseline'], me.position) && (me.position = 'top'); 
    }
    me._positionStr = positionPrefix + me.position + '"';

}).extend(
    
    /*
     * @lends baidu.ui.Toolbar.prototype
     */
{
    /**
     * title
     */
    title: '',

    /**
     * direction
     */
    direction: 'horizontal',

    /**
     * position
     */
    position: 'left',

    cellIndex: 0,

    /**
     * tplMain
     * @private
     */
    tplMain: '<div id="#{bodyId}" class="#{bodyClass}" onmousedown="javascript:return false;">' +
            '#{title}' +
            '<div id="#{bodyInner}" class="#{bodyInnerClass}">' +
                '<table cellpadding="0" cellspacing="0" style="width:100%; height:100%" id="#{tableId}">' +
                    '<tr><td style="width:100%; height:100%; overflow:hidden;" valign="top">' +
                        '<table cellpadding="0" cellspacing="0" id="#{tableInnerId}">#{content}</table>' +
                    '</td></tr>' +
                '</table>' +
            '</div>' +
            '</div>',

    /**
     * tplTitle
     * @private
     */
    tplTitle: '<div id="#{titleId}" class="#{titleClass}"><div id="#{titleInnerId}" class="#{titleInnerClass}">#{title}</div></div>',

    /**
     * tplHorizontalCell
     * @private
     */
    tplHorizontalCell: '<td id="#{id}" valign="middle" style="overflow:hidden;"></td>',
    
    /**
     * tplVerticalCell
     * @private
     */
    tplVerticalCell: '<tr><td id="#{id}" valign="middle" style="overflow:hidden;"></td></tr>',

    /**
     * uiType
     * @private
     */
    uiType: 'toolbar',

    /**
     * 返回toolbar的html字符串
     * @private
     * @return {String} HTMLString.
     */
    getString: function() {
        var me = this;

        return baidu.format(me.tplMain, {
            bodyId : me.getId(),
            bodyClass : me.getClass(),
            bodyInner : me.getId('bodyInner'),
            bodyInnerClass : me.getClass('body-inner'),
            title : me.title === '' ? '' : baidu.format(me.tplTitle, {
                                                    titleId : me.getId('title'),
                                                    titleClass : me.getClass('title'),
                                                    titleInnerId : me.getId('titleInner'),
                                                    titleInnerClass : me.getClass('title-inner'),
                                                    title : me.title
                                                }),
            tableId : me.getId('table'),
            position : me._positionStr,
            tableInnerId : me.getId('tableInner'),
            content : me.direction == 'horizontal' 
                            ? '<tr>' + me._createCell(me.items.length, 'str') + '</tr>' 
                            : me._createCell(me.items.length, 'str')
        });
    },

    /**
     * 绘制toolbar
     * @param {String|HTMLElement}  [container=this.container] toolBar容器.
     * @return void
     */
    render: function(container) {
        var me = this, body;
        me.container = container = baidu.g(container || me.container);

        baidu.insertHTML(me.renderMain(container), 'beforeEnd', me.getString());

        body = baidu.g(me.getId());
        me.width && baidu.setStyle(body, 'width', me.width);
        me.height && baidu.setStyle(body, 'height', me.height);

        //创建item
        me._createItems();
    },

    /**
     * 创建item
     * @private
     * @return void
     */
    _createItems: function() {
        var me = this,
            container = baidu.g(me.getId('tableInner')),
            tdCollection = [];

        baidu.each(container.rows, function(tr,tr_index) {
            baidu.each(tr.cells, function(td,td_index) {
                tdCollection.push(td);
            });
        });

        baidu.each(me.items, function(item,i) {
            me.add(item, tdCollection[i]);
        });
    },

    /**
     * 使用传入config的方式添加ui组件到toolBar
     * @param   {Object}    options ui控件的config参数，格式参照构造函数options.items.
     * @param   {HTMLElement}   [container] ui控件的container,若没有container参数，则会自动根据当前toolbar的显示规则在最后创建container.
     * @return  {baidu.ui} uiInstance 创建好的ui对象.
     */
    add: function(options,container) {
        var me = this,
            uiInstance = null,
            defaultOptions = {
                type: 'button',
                config: {}
            },
            uiNS = null, ns;

        if (!options)
            return;

        /*检查默认参数*/
        baidu.object.merge(options, defaultOptions);
        delete(options.config.statable);
        options.type = options.type.toLowerCase();

        uiNS = baidu.ui.getUI(options.type);
        if(uiNS){
            baidu.object.merge(uiNS,{statable:true},{whiteList: ['statable']});
            uiInstance = new uiNS(options.config);
            me.addRaw(uiInstance, container);
        }

        return uiInstance;
    },

    /**
     * 直接向toolbar中添加已经创建好的uiInstance
     * @param {Object} uiInstance
     * @param {HTMLElement} container
     * @return void.
     */
    addRaw: function(uiInstance,container) {
        var me = this;

        if (!uiInstance)
            return;

        baidu.extend(uiInstance, baidu.ui.Toolbar._itemBehavior);
        uiInstance.setName(uiInstance.name);

        if (!container) {
            container = me._createCell(1, 'html')[0];
        }

        uiInstance.render(container);
        me._itemObject[uiInstance.getName()] = [uiInstance, container.id];
    },

    /**
     * 根据当前toolbar规则，创建tableCell
     * @private
     * @param {Number} num 创建cell的数量.
     * @param {String} [type="str"] str|html.
     * @return {String|HTMLElement} uiInstance的容器.
     */
    _createCell: function(num,type) {
        var me = this,
            td,
            cells = [],
            container,
            i;
        type == 'str' || (type = 'html');

        if (type == 'str') {
            if (me.direction == 'horizontal') {
                for (i = 0; i < num; i++) {
                    cells.push(baidu.format(me.tplHorizontalCell,{id:me.getId('cell-' + me.cellIndex++ )}));
                }
            }else {
                for (i = 0; i < num; i++) {
                    cells.push(baidu.format(me.tplVerticalCell,{id:me.getId('cell-' + me.cellIndex++ )}));
                }
            }
            cells = cells.join('');
        }else {
            container = baidu.g(me.getId('tableInner'));
            containerTR = container.rows[0];
            if (me.direction == 'horizontal') {
                for (i = 0; i < num; i++) {
                    td = containerTR.insertCell(containerTR.cells.length);
                    td.id = me.getId('cell-' + me.cellIndex++ );
                    td.valign = 'middle';
                    cells.push(td);
                }
            }else {
                for (i = 0; i < num; i++) {
                    td = container.insertRow(container.rows.length);
                    td = td.insertCell(0);
                    td.id = me.getId('cell-' + me.cellIndex++ );
                    td.valign = 'middle';
                    cells.push(td);
                }
            }
        }

        return cells;
    },

    /**
     * 删除toolbar item
     * @param   {String} name 需要删除的控件的标识符.
     * @return void.
     */
    remove: function(name) {
        var me = this, item;
        if (!name) return;
        if (item = me._itemObject[name]) {
            item[0].dispose();
            baidu.dom.remove(item[1]);
            delete(me._itemObject[name]);
        }else{
            baidu.object.each(me._itemObject, function(item, index){
                item[0].remove && item[0].remove(name);
            });
        }
    },

    /**
     * 删除所有ui控件
     * @return void.
     */
    removeAll: function() {
        var me = this;
        baidu.object.each(me._itemObject, function(item,key) {
            item[0].dispose();
            baidu.dom.remove(item[1]);
        });
        me._itemObject = {};
    },

    /**
     * enable ui组件，当不传入name时，enable所有ui组件到
     * @public
     * @param {String} [name] ui组件唯一标识符.
     */
    enable: function(name) {
        var me = this, item;

        if (!name) {
            me.enableAll();
        }else if (item = me._itemObject[name]) {
            item[0].enable();
        }
    },

    /**
     * disable ui组件，当不传入name时，disable所有ui组建
     * @public
     * @param {String} [name] ui组件唯一标识符.
     */
    disable: function(name) {
        var me = this, item;

        if (!name) {
            me.disableAll();
        }else if (item = me._itemObject[name]) {
            item[0].disable();
        }
    },

    /**
     * 激活toolbar中所有的item
     * @return void.
     */
    enableAll: function() {
        var me = this;
        baidu.object.each(me._itemObject, function(item,key) {
            item[0].enable();
        });
    },

    /**
     * 禁用toolbar中所有的item
     * @return void.
     */
    disableAll: function() {
        var me = this;
        baidu.object.each(me._itemObject, function(item,key) {
            item[0].disable();
        });
    },

    /**
     * 通过name获取ui组件
     * @param {String} name ui组件唯一标识符.
     * @return {baidu.ui.Instance} 返回查找到的item.
     */
    getItemByName: function(name) {
        var me = this, item = me._itemObject[name];
        if (!item) {
            baidu.object.each(me._itemObject, function(i,k) {
                i.getItemByName && (item = i.getItemByName(name));
                if (item) {
                    return false;
                }
            });
        }

        return (item ? item[0] : null);
    },

    dispose: function(){
       var me = this;

       me.removeAll();
       me.dispatchEvent("dispose");
       baidu.dom.remove(me.getMain());
       baidu.lang.Class.prototype.dispose.call(me);
    }
});

/**
 * 全局唯一的toolbar_item id 索引
 * 此对象不对外暴露
 * @private
 */
baidu.ui.Toolbar._itemIndex = 0;

/**
 * @event onhighlight
 * 当item被设置为高亮时触发
 */

/**
 * @event oncancelhighlight
 * 当item被取消高亮时触发
 */

baidu.ui.Toolbar._itemBehavior = {

    /**
     * item唯一标识符
     * @private
     */
    _toolbar_item_name: '',

    /**
     * 为ui组创建自己的唯一的标识
     * @param {String} [name] 若传入了name，则使用传入的name为标识符.
     */
    setName: function(name) {
        var me = this;
        if (baidu.lang.isString(name)) {
            me._toolbar_item_name = name;
        }else {
            me._toolbar_item_name = 'tangram_toolbar_item_' + baidu.ui.Toolbar._itemIndex++;
        }

        //TODO:在更新name之后如自身已经被渲染到toolbar中
        //则更新toolbar中自己的名值对
    },

    /**
     * 返回toolbar item的唯一标识
     * @return {String} name.
     */
    getName: function() {
        var me = this;
        return me._toolbar_item_name;
    },

    /**
     * 设置高亮状态
     * @return void.
     */
    setHighLight: function() {
        var me = this;
        me.setState('highlight');
        me.dispatchEvent('onhighlight');
    },

    /**
     * 取消高亮状态
     * @return void.
     */
    cancelHighLight: function() {
        var me = this;
        me.removeState('highlight');
        me.dispatchEvent('oncancelhighlight');
    }
};

/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */




/**
 * @private
 * @class Toolbar类
 * @param   {Object}    options config参数.
 * @config  {String}    [name="ToolBar_item_xxx"]   ui控件的唯一标识符.
 * @config  {Object}    [options]   创建ui控件所需要的config参数.
 * @author  lixiaopeng
 */
baidu.ui.Toolbar.Separator = baidu.ui.createUI(function(options) {
}).extend(
    /*
     * @lends baidu.ui.Toolbar.Separator.prototype
     */   
{
    /**
     * statable
     */
    statable: false,

    /**
     * uiType
     */
    uiType: 'toolbar-separator',

    /**
     * 模板
     */
    tplMain: '<span id="#{id}" class="#{class}" style="display:block"></span>',

    /**
     * 获取HTML字符串
     * @private
     * @return {String} HTMLString.
     */
    getString: function() {
        var me = this;

        return baidu.format(me.tplMain, {
            id : me.getId(),
            'class' : me.getClass()
        });
    },

    /**
     * 绘制控件
     * @return void.
     */
    render: function(container) {
        var me = this;
        baidu.dom.insertHTML(me.renderMain(container), 'beforeEnd', me.getString());
    }
});

/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */







/**
 * @private
 * @class Spacer类
 * @param   {Object}    options config参数.
 * @config  {String}    [name="ToolBar_item_xxx"]   ui控件的唯一标识符.
 * @config  {Object}    [options]   创建ui控件所需要的config参数.
 * @author  lixiaopeng
 */
baidu.ui.Toolbar.Spacer = baidu.ui.createUI(function(options) {
}).extend(
    
    /*
     * @lends baidu.ui.Toolbar.Spacer.prototype
     */
{
    /**
     * statable
     */
    statable: false,

    /**
     * uiType
     */
    uiType: 'toolbar-spacer',

    /**
     * 默认宽度
     */
    width: '10px',

    /**
     * html 模板
     */
    tplBody: '<div #{style} id="#{id}" class="#{class}"></div>',

    /**
     * 获取html字符串
     * @private
     * @return {String} str HTML字符串.
     */
    getString: function() {
        var me = this;
        return baidu.format(me.tplBody, {
            style : 'style="' + (me.height ? 'height:' + me.height : 'width:' + me.width) + '"',
            id : me.getId(),
            'class' : me.getClass()
        });
    },

    /**
     * 绘制item
     * @param {String|HTMLDom} [container=this.container] Item容器.
     */
    render: function(container) {
        var me = this;
        baidu.dom.insertHTML(me.renderMain(container), 'beforeEnd', me.getString());
    }
});

/**
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */



/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 */




/**
 * 将控件或者指定元素放置到当前鼠标位置
 *
 * @param {HTMLElement|string} element optional 要对齐的元素或元素id，如果不指定，默认为当前控件的主元素.
 * @param {Object} options optional 选项，同setPosition方法.
 */
baidu.ui.behavior.posable.setPositionByMouse = function(element, options) {
    var me = this;
    element = baidu.g(element) || me.getMain();
    me._positionByCoordinate(element, baidu.page.getMousePosition(), options);
};








/* BASE: baidu/lang/toArray.js */






 /**
 * 弹出tip层,类似鼠标划过含title属性元素的效果
 * @class
 * @param       {Object}          options         选项.
 * @config      {String|Array}    target          目标元素或元素id。可直接设置多个目标元素
 * @config      {String}          type            （可选）触发展开的类型，可以为:hover和click。默认为click
 * @config      {Element}         contentElement  （可选）Tooltip元素的内部HTMLElement。
 * @config      {String}          content         （可选）Tooltip元素的内部HTML String。若target存在title，则以title为准
 * @config      {String}          width           （可选）宽度
 * @config      {String}          height          （可选）高度
 * @config      {Array|Object}    offset          （可选）偏移量。若为数组，索引0为x方向，索引1为y方向；若为Object，键x为x方向，键y为y方向。单位：px，默认值：[0,0]。
 * @config      {boolean}         single          （可选）是否全局单例。若该值为true，则全局共用唯一的浮起tooltip元素，默认为true。
 * @config      {Number}          zIndex          （可选）浮起tooltip层的z-index值，默认为3000。
 * @config      {String}          positionBy      （可选）浮起tooltip层的位置参考，取值['mouse','element']，分别对应针对鼠标位置或者element元素计算偏移，默认mouse
 * @config      {Element}         positionElement （可选）定位元素，设置此元素且positionBy为element时，根据改元素计算位置
 * @config      {Boolean}         autoRender       是否自动渲染。
 * @config      {Function}        onopen          （可选）打开tooltip时触发。
 * @config      {Function}        onclose         （可选）关闭tooltip时触发。
 * @config      {Function}        onbeforeopen    （可选）打开tooltip前触发。
 * @config      {Function}        onbeforeclose   （可选）关闭tooltip前触发。
 * @plugin      fx                Tooltip的展现和消失效果支持。
 * @return     {baidu.ui.Tooltip}        Tooltip实例
 */

baidu.ui.Tooltip = baidu.ui.createUI(function(options) {
    
    var me = this;
    me.target = me.getTarget();
    me.offset = options.offset || [0, 0];
    me.positionElement = null;

    baidu.ui.Tooltip.showing[me.guid] = me;

}).extend(
    /**
     *  @lends baidu.ui.Tooltip.prototype
     */
{
    uiType: 'tooltip',

    width: '',
    height: '',
    zIndex: 3000,
    currentTarget: null,

    type: 'click',

    posable: true,
    positionBy: 'element',
	offsetPosition: 'bottomright',

    isShowing: false,

    tplBody: '<div id="#{id}" class="#{class}"></div>',

    /**
     * 获取Tooltip的HTML字符串
     * @private
     * @return {String} TooltipHtml
     */
    getString: function() {
		var me = this;
		return baidu.format(me.tplBody, {
			id: me.getId(),
			'class' : me.getClass()
		});
	},

    /**
	 * 开关函数,返回false时不显示
     * @private
     */
	toggle: function() {return true},
    
    /**
     * 渲染Tooltip到HTML
     * @public 
     */
    render: function() {
        var me = this,
            main,title;

        main = me.renderMain();

        baidu.each(me.target, function(t,index){
            if((title = baidu.getAttr(t, 'title')) && title != ''){
                baidu.setAttr(t, 'tangram-tooltip-title', title);
                baidu.setAttr(t, 'title', '');
            }
        });
        baidu.dom.insertHTML(main,"beforeend",me.getString());
        me._update();
        me._close();
        
        me.dispatchEvent('onload');
    },

	/**
	 * 打开tooltip
	 * @public
     * @param {HTMLElement} [target] 显示tooltip所参照的html元素
	 */
	open: function(target) {
		var me = this,
            showTooltip = baidu.ui.Tooltip.showing,
            isSingleton = baidu.ui.Tooltip.isSingleton,
            target = target || me.target[0],
            currentTarget = me.currentTarget,
            body = me.getBody();

         //判断是否为当前打开tooltip的target
         //若是，则直接返回
        if(currentTarget === target) return;
        
        //若target为本组中之一，则关闭当前current
        me.isShowing && me.close(currentTarget);

        //查看当前tooltip全局设置,若为单例，关闭当前打开的tooltip
        if(isSingleton){
            baidu.object.each(showTooltip,function(tooltip,key){
                if(key != me.guid && tooltip.isShowing){
                    tooltip.close(); 
                } 
            });
        }

        //若toggle函数返回false，则直接返回
        if (typeof me.toggle == 'function' && !me.toggle()) return;

        me.currentTarget = target;

        me._updateBodyByTitle();
        me._setPosition();
        me.isShowing = true;
        
        //若onbeforeopen事件返回值为false，则直接返回
        if (me.dispatchEvent('onbeforeopen')){
            me.dispatchEvent('open');
            return;
        }
	},

    _updateBody: function(options){
        var me = this,
            options = options || {},
            body = me.getBody(),
            title;

        if(me.contentElement && me.contentElement !== body.firstChild){
            
            //若存在me.content 并且该content和content里面的firstChild不一样
            body.innerHTML = '';
            body.appendChild(me.contentElement);
            me.contentElement = body.firstChild;
        
        }else if(typeof options.contentElement != 'undefined'){
            
            //若options.content存在，则认为用户向对content进行更新
            body.innerHTML = '';
            options.contentElement != null && body.appendChild(options.contentElement);
        
        }
        
        if(!options.contentElement){
            if(typeof options.content == 'string'){

                //若存在options.contentText，则认为用户相对contentText进行更新
                body.innerHTML = '';
                body.innerHTML = options.content;

            }else if(typeof me.content == 'string' && baidu.dom.children(body).length == 0 ) {
                //第一次new Tooltip时传入contentText，进行渲染
                body.innerHTML = me.content;
            }
        }
    },
	
    _updateBodyByTitle:function(){
        var me = this,
            body = me.getBody();
        
        if(!me.contentElement && !me.content && me.currentTarget){
            if((title = baidu.getAttr(me.currentTarget, 'tangram-tooltip-title')) && title != ''){
                body.innerHTML = title;
            }else{
                body.innerHTML = '';
            }
        }

    },

    /**
     * 更新tooltip属性值
     * @private
     * @param {Object} options 属性集合
     */
    _update: function(options){
        var me = this,
            options = options || {},
            main = me.getMain(),
            body = me.getBody();

        me._updateBody(options);
        baidu.object.extend(me, options);
        me.contentElement = baidu.dom.children(body).length > 0 ? body.firstChild : null;
        me._updateBodyByTitle();

        //更新寛高数据
        baidu.dom.setStyles(main, {
            zIndex: me.zIndex,
            width: me.width,
            height: me.height,
            // 防止插件更改display属性,比如fx.
            display: ''
        });
    },
    
    /**
     * 更新options
     * @public
     * @param       {Object}          options         选项.
     * @config      {String|Array}    target          目标元素或元素id。可直接设置多个目标元素
     * @config      {String}          type            （可选）触发展开的类型，可以为:hover和click。默认为click
     * @config      {Element}         contentElement  （可选）Tooltip元素的内部HTMLElement。
     * @config      {String}          content         （可选）Tooltip元素的内部HTML String。若target存在title，则以title为准
     * @config      {String}          width           （可选）宽度
     * @config      {String}          height          （可选）高度
     * @config      {Array|Object}    offset          （可选）偏移量。若为数组，索引0为x方向，索引1为y方向；若为Object，键x为x方向，键y为y方向。单位：px，默认值：[0,0]。
     * @config      {boolean}         single          （可选）是否全局单例。若该值为true，则全局共用唯一的浮起tooltip元素，默认为true。
     * @config      {Number}          zIndex          （可选）浮起tooltip层的z-index值，默认为3000。
     * @config      {String}          positionBy      （可选）浮起tooltip层的位置参考，取值['mouse','element']，分别对应针对鼠标位置或者element元素计算偏移，默认mouse。
     * @config      {Element}         positionElement （可选）定位元素，设置此元素且positionBy为element时，根据改元素计算位置
     * @config      {Boolean}         autoRender       是否自动渲染。
     * @config      {Function}        onopen          （可选）打开tooltip时触发。
     * @config      {Function}        onclose         （可选）关闭tooltip时触发。
     * @config      {Function}        onbeforeopen    （可选）打开tooltip前触发。
     * @config      {Function}        onbeforeclose   （可选）关闭tooltip前触发。
     */
    update: function(options){
        var me = this;
        me._update(options);
        me._setPosition();
        me.dispatchEvent('onupdate');
    },

    /**
     * 设置position
     * @private
     */
	_setPosition: function() {
		var me = this,
            insideScreen = typeof me.insideScreen == 'string' ? me.insideScreen : 'surround',
			positionOptions = {
				once: true,
				offset: me.offset,
				position: me.offsetPosition,
				insideScreen: insideScreen 
			};
		switch (me.positionBy) {
			case 'element':
				me.setPositionByElement(me.positionElement || me.currentTarget, me.getMain(), positionOptions);
				break;
			case 'mouse':
				me.setPositionByMouse(me.getMain(), positionOptions);
				break;
			default :
				break;
		}
	},

	/**
	 * 关闭tooltip
	 * @public
	 */
	close: function() {
		var me = this;

        if(!me.isShowing) return;
        
        me.isShowing = false;
        if(me.dispatchEvent('onbeforeclose')){
            me._close();
            me.dispatchEvent('onclose');
        }
        me.currentTarget = null;
    },


    _close: function() {
        var me = this;
                
        me.getMain().style.left = '-100000px';
    },
	/**
	 * 销毁控件
	 * @public
	 */
	dispose: function() {
		var me = this;
		me.dispatchEvent('ondispose');
		if (me.getMain()) {
			baidu.dom.remove(me.getMain());
		}
        delete(baidu.ui.Tooltip.showing[me.guid]);
		baidu.lang.Class.prototype.dispose.call(me);
	},
    /**
     * 获取target元素
	 * @private
	 */
    getTarget: function() {
        var me = this,
            target = [];
            
        baidu.each(baidu.lang.toArray(me.target),function(item){
            target.push(baidu.G(item));
        });

        return target;
    }
});

baidu.ui.Tooltip.isSingleton = false;
baidu.ui.Tooltip.showing = {};

baidu.ui.Tooltip.register(function(me) {
    
    if (me.type == 'click') {

        //onload时绑定显示方法
        me.addEventListener("onload",function(){
            baidu.each(me.target,function(target){
                baidu.on(target, 'click', showFn); 
            });
        });

        //dispose时接触事件绑定
        me.addEventListener("ondispose",function(){
            baidu.each(me.target,function(target){
                baidu.un(target, 'click', showFn); 
            });

            baidu.un(document, 'click', hideFn);
        });

        //tooltip打开时，绑定和解除方法
        me.addEventListener('onopen', function(){
            baidu.un(me.currentTarget, 'click', showFn);
            baidu.on(me.currentTarget, 'click', hideFn);
            baidu.on(document, 'click', hideFn);
        });

        //tooltip隐藏时，绑定和解除方法
        me.addEventListener('onclose', function(){
            
            baidu.on(me.currentTarget, 'click', showFn);
            baidu.un(me.currentTarget, 'click', hideFn);
            baidu.un(document, 'click', hideFn);

        });

        //显示tooltip
        function showFn(e){
            me.open(this);
            
            //停止默认事件及事件传播
            baidu.event.stop(e || window.event);
        }

        //隐藏tooltip
        function hideFn(e){
            var target = baidu.event.getTarget(e || window.event),
                judge = function(el){
                    return me.getBody() == el;
                };
            if(judge(target) || baidu.dom.getAncestorBy(target, judge) || baidu.ui.get(target) == me){
                return;
            }

            me.close();
            //停止默认事件及事件传播
            baidu.event.stop(e || window.event);
        }
    }
});

/**
 * 创建关闭按钮
 */
baidu.ui.Tooltip.extend({
    /**
     * 标题内容
     * @param {String} [options.headContent].
     */
    headContent: '',
    tplhead: '<div class="#{headClass}" id="#{id}">#{headContent}</div>'
});

baidu.ui.Tooltip.register(function(me) {
    me.addEventListener('onload', function() {
        var me = this,
            button;
        
        baidu.dom.insertHTML(me.getBody(), 'afterBegin', baidu.format(me.tplhead, {
            headClass: me.getClass('head'),
            id: me.getId('head')
        }));

        button = new baidu.ui.Button({
            content: me.headContent,
            onclick: function(){
                me.close();
            }
        });
        button.render(me.getId('head'));
    });
});

baidu.ui.Tooltip.extend({
	//是否使用效果,默认开启
	enableFx: true,
	//显示效果,默认是fadeIn
	showFx: baidu.fx.fadeIn,
	showFxOptions: {duration: 500},
	//消失效果,默认是fadeOut
	hideFx: baidu.fx.fadeOut,
	hideFxOptions: {duration: 500}
});

/**
 * 为Tooltip添加效果支持
 */
baidu.ui.Tooltip.register(function(me) {
	if (me.enableFx) {
	
        var fxHandle = null;

        //TODO:fx目前不支持事件队列，此处打补丁解决
        //等fx升级后更新
        me.addEventListener('beforeopen', function(e) {
	        me.dispatchEvent('onopen');
            'function' == typeof me.showFx && me.showFx(me.getMain(), me.showFxOptions);
            e.returnValue = false;
	    });
		
        me.addEventListener('beforeclose', function(e) {
	        me.dispatchEvent('onclose');
            
            fxHandle = me.hideFx(me.getMain(), me.hideFxOptions);
            fxHandle.addEventListener('onafterfinish', function() {
	              me._close();
	        });
	        e.returnValue = false;
		});

        me.addEventListener('ondispose', function(){
            fxHandle && fxHandle.end(); 
        });
	}
});

baidu.ui.Tooltip.extend({
    hideDelay: 500
});

baidu.ui.Tooltip.register(function(me) {
    
    if (me.type == 'hover') {

        var hideHandle = null;

        //onload时绑定显示方法
        me.addEventListener("onload",function(){
            baidu.each(me.target,function(target){
                baidu.on(target, 'mouseover', showFn);
            });
        });

        //dispose时接触事件绑定
        me.addEventListener("ondispose",function(){
            baidu.each(me.target,function(target){
                baidu.un(target, 'mouseover', showFn);
                baidu.un(target, 'mouseout', hideFn);
            });
        });

        //tooltip打开时，绑定和解除方法
        me.addEventListener('onopen', function(){
            baidu.on(me.currentTarget, 'mouseout', hideFn);
        });

        //tooltip隐藏时，绑定和解除方法
        me.addEventListener('onclose', function(){
            baidu.on(me.currentTarget, 'mouseover', showFn);
            baidu.un(me.currentTarget, 'mouseout', hideFn);
        });

        //显示tooltip
        function showFn(e){
            hideHandle && clearTimeout(hideHandle);
            me.open(this);

            //停止默认事件及事件传播
            baidu.event.stop(e || window.event);
        }

        //隐藏tooltip
        function hideFn(e){
            hideHandle = setTimeout(function(){
                me.close();
            },me.hideDelay);

            //停止默认事件及事件传播
            baidu.event.stop(e || window.event); 
        }
    }
});


/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * path: ui/tree/Tree.js
 * author: fx
 * version: 1.0.0
 * date: 2010-10-27
 */



/* BASE: baidu/array/remove.js */





/* BASE: baidu/dom/insertAfter.js */







/* BASE: baidu/string/encodeHTML.js */

/**
 * @class  Tree：管理和操作TreeNode
 * @param {Object} options
 * @config {Object} data 节点数据集合 {text: "", children: [{text: ""},{text: ""}]}
 * @config {Boolean} expandable  是否改变trunk的状态到leaf,当一个trunk的子节点数为0时，
 *                                如果为true,那么就变为leaf的状态，否则就不会变
 * @config {Function} onclick  节点被点击后触发。
 * @config {Function} ontoggle  节点被展开或收起后触发。
 * @config {Function} onload  Tree渲染后触发。
 */

//  _rootNode : 根节点,默认值为null,
// _currentNode : 当前节点，默认值为null

baidu.ui.Tree = baidu.ui.createUI(function(options) {
    //树的所有节点的集合 树的ID与实例的键值对
    this._treeNodes = {};
});

//TreeNode类 
/**
 * 树节点类
 * @Class TreeNode
 * @param {Object} options
 * @config {Boolean} isExpand  是否是展开, 默认值为false
 * @config {Array} children 子节点options数组  默认值为null
 * @config {Boolean} isRoot  是否是根节点,默认值为false
 * @config {Boolean} type  节点类型 trunk|leaf, 默认值为'leaf'
 * @config {String} id  节点的唯一标识ID。默认为null
 * @config {String} text  节点显示名称. 默认值为null
 * @config {String} href 节点的链接href. 默认值为null
 * @config {String} target 节点链接的target,有href的时候才生效。默认值为null
 * @config {String} icon 节点图标的路径. 默认值为null
 * @config {String} skin 节点样式选择符. 默认值为null
 * @config {Boolean} isToggle 是否支持节点展开或收起 默认值为true
 */
//此类做了以下优化。
//1. TreeNode通过字符串拼装HTML来代替模板format,因为多次使用
//   format是非常耗性能的。
//2. 弃用了baidu.ui.createUI的方法，在多次使用createUI有性能瓶颈。
//3. 增加了分步渲染机制。
//4. 优化了_getId,_getClass,_getCallRef等调用次数较多的方法。
//5. 减少函数调用的次数。比如_getId(),在初始化时，是通过字符串拼接来实现，因为一个函数多次调用
//   也对性能有影响。
//6. 用数组push再join代替字符串拼装。
//   如果字符串的叠加次数小于3至5，建议还是用字符串叠加，因为多次实例化一个Array，并且再join(''),
//   也挺消耗性能的。
//7. 去掉了不必要的HTML与样式，这些都会耗损渲染性能。


baidu.ui.Tree.TreeNode = function(options) {
    var me = this;
    baidu.object.extend(me, options);
    //这里只所以需要判断是因为_getId()的实现已经调用到了me.id,而me.id是对外开放的属性。
    me.id = me.id || baidu.lang.guid();
    me.childNodes = [];
    me._children = [];
    window['$BAIDU$']._instances[me.id] = me;
    me._tree = {};
    me._stringArray = [];
    
};



baidu.ui.Tree.TreeNode.prototype =  {
    //ui控件的类型 **必须**
    uiType: 'tree-node',
    //节点的文本属性
    text: '' ,
    //节点类型：root trunk leaf
    type: 'leaf',
    //是否支持toggle
    isToggle: true,
    /**
     * 用来为HTML元素的ID属性生成唯一值。
     * @param {String} key
     * @return {String} id.
     */
    _getId: function(key) {
       return this.id + '-' +key;
    },
    /**
     * 用来为HTML元素的class属性生成唯一值。
     * @param {String} key
     * @return {String} class.
     */
    _getClass: function(key) {
        var me = this,
            className = 'tangram-tree-node-' + key;
        if( me.skin){
            className += ' '+me.skin+'-'+key;
        }
        return className;
    },
    /**
     * 生成当前实例所对应的字符串
     * @return {String} stringRef.
     */
    _getCallRef: function() {
        return "window['$BAIDU$']._instances['" + this.id + "']";
    },
    /**
     * @private
     * 获得TreeNode dom的html string
     * @return {String} htmlstring.
     */
    getString: function() {
        var me = this,
            stringArray = me._stringArray,
            style='';
        stringArray.push('<dl id="',me.id,'">');
        me._createBodyStringArray();
        style = me.isExpand ? "display:''" : 'display:none';
        stringArray.push('<dd  style="'+style+'" id="',me.id,'-subNodeId"></dd></dl>');
        return stringArray.join('');
    },
    /**
     * 取得节点的父节点
     * @return {TreeNode} treeNode.
     */
    getParentNode: function() {
        return this.parentNode;
    },
    /**
     * 设置节点的父节点
     * @param {TreeNode} treeNode
     */
    setParentNode: function(parentNode) {
        var me = this;
        me.parentNode = parentNode;
        me._level = parentNode._level + 1;
    },
    /**
     * 取得节点的子节点数组
     * @return {Array} treeNodes.
     */
    getChildNodes: function() {
        return this.childNodes;
    },
    /**
     * 设置节点的对应的Tree
     * @param {Tree} tree
     */
    setTree: function(tree) {
        var me = this;
        me._tree = tree;
        me._tree._treeNodes[me.id] = me;
    },
    /**
     * 取得节点的对应的Tree
     * @return {Tree} tree.
     */
    getTree: function() {
        return this._tree;
    },
    /**
     * 增加一组children数据。数据格式:[{text:"",href:"",children:[{text:"",href:""}
     * ,{text:"",href:""}]},{text:""},{text:""}]
     * 可以数组里面嵌套数组
     * @param {Array} array
     */
    appendData: function(childrenData) {
        var me = this;
        baidu.dom.insertHTML(me._getSubNodesContainer(), 'beforeEnd'
        , me._getSubNodeString(childrenData));
        me._isRenderChildren = true;
    },
    /**
     * 取得所有子节点返回的HTMLString
     * @param {Array } array
     * @return {String} string.
     */
    _getSubNodeString: function(childrenData) {
        var me = this,
            treeNode,
            len,
            stringArray = [],
            ii = 0,
            item,
            len = childrenData.length;
        for (; ii < len; ii++) {
            item = childrenData[ii];
            treeNode = new baidu.ui.Tree.TreeNode(item);
            if (ii == (len - 1)) {
                treeNode._isLast = true;
            }
            me._appendChildData(treeNode, len - 1);
            stringArray.push(treeNode.getString());
        }
        return stringArray.join('');
    },

    /**
     * 递归判断本节点是否是传进来treeNode的父节点
     * @param {TreeNode} treeNode 节点.
     */
    isParent: function(treeNode) {
        var me = this,
            parent = treeNode;
        while (!parent.isRoot && (parent = parent.getParentNode()) ) {
            if (parent == me) {
                return true;
            }
        }
        return false;
    },
    /**
     * 将已有节点添加到目标节点中，成为这个目标节点的子节点。
     * @param : parentNode
     */
    appendTo: function(parentNode) {
        var me = this;
        me.getParentNode()._removeChildData(me);
        parentNode.appendChild(me);
        me.dispatchEvent('appendto');
    },
    /**
     * 将此节点移动至一个目标节点,成为这个目标节点的next节点
     * @Param {TreeNode} 移动至目标节点
     */
    moveTo: function(treeNode) {
        var me = this,
            oldParent = me.getParentNode(),
            newParent,
            index;
        if (oldParent == null) {
            return false;
        }
        //当treeNode是展开并且treeNode有子节点的时候。
        if (treeNode.isExpand && treeNode.getChildNodes().length > 0) {
            newParent = treeNode;
        }
        else {
            newParent = treeNode.getParentNode();
        }
        oldParent._removeChildData(me);
        index = (newParent == treeNode) ? -1 : treeNode.getIndex();
        newParent.appendChild(me, index);
        me.dispatchEvent('moveto');
    },
    /**
     * 新增一个子节点 只是单一的管理数据结构，没有渲染元素的职责。
     * @param {TreeNode} treeNode 需要加入的节点.
     * @param {TreeNode} index 索引，用来定位将节点加到索引对应的节点下.
     * @param {Boolean} isDynamic 是否是动态新增 用来区分动态新增节点和初始化json。
     * 初始化的json里面的children是有数据的，而动态新增节点的children是需要手动加的，
     * 所以如果初始化json就不需要对children进行维护，反之亦然.
     */
    _appendChildData: function(treeNode,index,isDynamic) {
        var me = this,
            nodes = me.getChildNodes();
        treeNode.parentNode = me;
        treeNode.setTree(me.getTree());

        if (isDynamic) {
            nodes.splice(index+1 , 0, treeNode);
            //me.children = me.children || [];
            me._children.splice(index+1 , 0, treeNode.json);
        }
        else {
            nodes.push(treeNode);
            me._children.push(treeNode.json);
            //me.children.push(treeNode.json);
        }
    },

    /**
     * 新增一个子节点
     * 1.先判断子节点是否被渲染过，如果渲染过，就将子节点append到自己subNodes容器里
     *   否则就inertHTML的子节点的getString
     * 2.对parentNode与childNodes进行变更。
     * 3.更新treeNode与tree的update
     * @param {TreeNode} 需要加入的节点(分为已经渲染的节点和为被渲染的节点)
     *                  通过treeNode._getContainer()返回值来判断是否被渲染.
     * @param {index}  此节点做为 节点集合的[index+1]的值
     * @return {TreeNode} treeNode 返回被新增的child
    */
    appendChild: function(treeNode,index) {
        var me = this,
            oldParent,
            string,
            childNodes,
            treeNodeContainer = treeNode._getContainer(),
            subNodeContainer = me._getSubNodesContainer();
        if (index == null) {
            index = me.getChildNodes().length - 1;
        }
        me._appendChildData(treeNode, index, true);
        childNodes = me.getChildNodes();
        oldParent = treeNode.getParentNode();
        string = treeNode.getString();
        //如果是已经被渲染过的节点
        if (treeNodeContainer) {
            //当本节点为展开的trunk节点
            if (index == -1) {
                //当本节点在treeNode加入之前的childNode的length为0时
                if (childNodes.length == 1) {
                    subNodeContainer.appendChild(treeNodeContainer);
                }
                else {
                    baidu.dom.insertBefore(treeNodeContainer, childNodes[1]._getContainer());
                }
            }
            else {
                baidu.dom.insertAfter(treeNodeContainer, childNodes[index]._getContainer());
            }
        }
        else {
            //console.log('-----appendData--------'+index);
            //当本节点为展开的trunk节点
            if (index == -1) {
                //当本节点在treeNode加入之前的childNode的length为0时
                if (childNodes.length == 1) {
                    baidu.dom.insertHTML(subNodeContainer, 'beforeEnd', string);
                }
                else {
                    baidu.dom.insertHTML(childNodes[1]._getContainer(), 'beforeBegin', string);
                }
            }
            else {
                baidu.dom.insertHTML(childNodes[index]._getContainer(), 'afterEnd', string);
            }
        }
        treeNode._updateAll();
        treeNode._updateOldParent(oldParent);
        if (me.type == 'leaf') {
            me.type = 'trunk';
            me._getIconElement().className = me._getClass('trunk');
        }
        me._getSpanElement().innerHTML = me._getImagesString();
        return treeNode;
    },
    /**
     * @private
     * @param {TreeNode} oldParentNode 节点之前的父节点
     * 修改节点原来父节点的状态.
     */
    _updateOldParent: function(oldParent) {
        var me = this;
        if (!oldParent) {
            return false;
        }
        if (oldParent.getLastChild()) {
            oldParent.getLastChild()._update();
        }
        else {
            if (me.getTree().expandable) {
                oldParent._getIconElement().className = me._getClass('leaf');
                oldParent.type = 'leaf';
            }
            oldParent._update();
        }
    },
    /**
     * 内部方法
     * @private
     * 只删除此节点的数据结构关系，而不删除dom元素对象。这个方法被用于appendTo
     * @param {TreeNode} treeNode
     * @param {Boolean} recursion  如果为true,那么就递归删除子节点
     * 主要是在将有子节点的节点做排序的时候会用到。.
     */
    _removeChildData: function(treeNode,recursion) {
        var me = this;
        baidu.array.remove(me._children, treeNode.json);
        baidu.array.remove(me.childNodes, treeNode);
        delete me.getTree().getTreeNodes()[treeNode.id];
        if (recursion) {
            while (treeNode.childNodes[0]) {
                treeNode._removeChildData(treeNode.childNodes[0]);
            }
        }
    },
    /**
     * 批量删除一个节点下的所有子节点
    */
    removeAllChildren: function() {
        var me = this,
            childNodes = me.getChildNodes();
        while (childNodes[0]) {
            me.removeChild(childNodes[0], true);
        }
    },
    /**
    *删除一个子节点
    *1.删除此节点对象的数据结构
    *2.删除此节点所对应的dom元素对象
    *@param {TreeNode} treeNode
    */
    removeChild: function(treeNode) {
        if (treeNode.getParentNode() == null) {
            return false;
        }
        var me = this,
            nodes = me.getChildNodes();
        me._removeChildData(treeNode, true);
        delete me.getTree().getTreeNodes()[treeNode.id];
        baidu.dom.remove(treeNode._getContainer());
        me.getTree().setCurrentNode(null);
        if (nodes.length <= 0 && !me.isRoot) {
            me._getSubNodesContainer().style.display = 'none';
            if (me.getTree().expandable) {
                me._getIconElement().className = me._getClass('leaf');
                me.type = 'leaf';
            }
        }
        me._updateAll();
    },
    /**
    *除了更新节点的缩进图标状态外，还更新privious的状态
    */
    _updateAll: function() {
        var me = this,
            previous = me.getPrevious();
        previous && previous._update();
        me._update();
    },
    /**
    *更新节点的缩进，以及图标状态
    */
    _update: function() {
        var me = this;
        me._getSpanElement().innerHTML = me._getImagesString();
        baidu.array.each(me.childNodes, function(item) {
            item._update();
        });
    },
    /**
    *更新节点的一系列属性
    *1.如有text,就更新text.
    *2.如有icon
    *@param {Object} options
    */
    update: function(options) {
        var me = this,
            hrefElement = me._getHrefElement(),
            textElement = me._getTextElement();
        baidu.extend(me, options);
        (hrefElement ? hrefElement : textElement).innerHTML = me.text;
    },
    /**
    *切换toggle状态
    *@param {String} "block" or "none"
    *@param {String} "Lminus" or "Lplus"
    *@param {String} "Tminus" or "Tplus"
    *@param {Boolean} true or false
    */
    _switchToggleState: function(display,lastClassName,className,flag) {
        var me = this,
            toggleElement = me._getToggleElement();
        if (me.type == 'leaf') {
            return false;
        }
        me.isExpand = flag;
        if (toggleElement) {
            toggleElement.className = me._getClass(me.isLastNode() ? lastClassName : className);
        }
        if (me.getChildNodes() && me.getChildNodes().length > 0) {
            me._getSubNodesContainer().style.display = display;
        }
    },
    /**
     * 展开节点
     * 分步渲染。第一次expand会渲染节点
     */
    expand: function() {
        var me = this;
        if (!me._isRenderChildren) {
            me.appendData(me.children);
        }
        me._switchToggleState('block', 'Lminus', 'Tminus', true);
    },
    /**
    *收起节点
    */
    collapse: function() {
        this._switchToggleState('none', 'Lplus', 'Tplus', false);
    },
    /**
     * 切换，收起或者展开
     */
    toggle: function() {
        var me = this;
        if (me.type == 'leaf') {
            return false;
        }
        me.isExpand ? me.collapse() : me.expand();
    },

    /**
     * 切换focus的状态
     * @param {String className} className
     * @param {Bollean flag} flag
     * @param {String methodName} 方法名.
     */
    _switchFocusState: function(className,flag,methodName) {
        var me = this;
        baidu.dom[methodName](me._getNodeElement() , me._getClass('current'));
        if (me.type != 'leaf') {
            me._getIconElement().className = me._getClass(className);
            me.isOpen = flag;
        }
    },
    /**
     * 失去焦点,让当前节点取消高亮。
     */
    blur: function() {
        var me = this;
        me._switchFocusState('trunk', false, 'removeClass');
        me.getTree().setCurrentNode(null);
    },
    /**
    *取得焦点,并且让当前节点高亮，让上一节点取消高亮。
    */
    focus: function() {
        var me = this,
            oldNode = me.getTree().getCurrentNode();
        if (oldNode != null) {
            oldNode.blur();
        }
        me._switchFocusState('open-trunk', true, 'addClass');
        me.getTree().setCurrentNode(me);
        baidu.dom.removeClass(me._getNodeElement(), me._getClass('over'));
    },
    /**
     * 鼠标放上去的效果
     */
    _onMouseOver: function(event) {
        var me = this;
        if (me != me.getTree().getCurrentNode()) {
            baidu.dom.addClass(me._getNodeElement(), me._getClass('over'));
        }
        me.dispatchEvent('draghover', {event: event});
        me.dispatchEvent('sorthover', {event: event});
    },
    /**
     * 鼠标离开的效果
     */
    _onMouseOut: function() {
        var me = this;
        baidu.dom.removeClass(me._getNodeElement(), me._getClass('over'));
        me.getTree().dispatchEvent('mouseout', {treeNode: me});
    },
    /**
    *点击节点时候的效果
    */
    _onClick: function(eve) {
        var me = this;
        me.focus();
        me.getTree().dispatchEvent('click', {treeNode: me});
    },
    /**
    *mousedown节点时候的效果
    */
    _onMouseDown: function(event) {
        var me = this;
        me.dispatchEvent('dragdown', {event: event});
    },
    /**
    *当鼠标双击节点时的效果
    */
    _onDblClick: function(event) {
        var me = this;
        me.focus();
        me.isToggle && me.toggle();
        me.getTree().dispatchEvent('dblclick', {
            treeNode: me,
            event: event
        });
    },
    /**
    *当鼠标右击节点时的效果
    */
    _onContextmenu: function(event) {
        var me = this;
        return me.getTree().dispatchEvent('contextmenu', {
            treeNode: me,
            event: event
        });

    },
    /**
    *点击toggle图标时候的效果
    */
    _onToggleClick: function(event) {
        var me = this;
        me.isToggle && me.toggle();
        me.getTree().dispatchEvent('toggle', {treeNode: me});
        baidu.event.stopPropagation(event);
    },
    /**
     * 获得TreeNode  body的html string
     * @return {String} htmlstring.
     */
    _createBodyStringArray: function() {
        var me = this,
            stringArray = me._stringArray;
        stringArray.push('<dt id="',me.id,'-node" class="tangram-tree-node-node"');
        if(me.skin){
            stringArray.push(' ',me.skin,'-node');
        }
        stringArray.push(' onclick="',me._getCallRef() + ('._onClick(event)'),'"> <span id="',
            me.id,'-span">',me._getImagesString(true),'</span>');
        me._createIconStringArray();
        me._createTextStringArray();
        stringArray.push('</dt>');
    },
    /**
     * 获得TreeNode  Images的html string
     * @param {Array} stringArray.
     * @param {isInit} 是否是初始化节点.
     * @return {Array} stringArray.
     */
    _getImagesString: function(isInit) {
        var me = this,
            string = '';
        string += me._getIdentString(isInit);
        if (me.type == 'leaf') {
            string += me._getTLString(isInit);
        }
        else if (me.type == 'trunk') {
            if (me.children && me.children.length > 0) {
                string += me._getToggleString(isInit);
            } else {
                string += me._getTLString(isInit);
            }
        }
        return string;
    },
    /**
     * 获得TreeNode 缩进线条的String
     * @param {isInit} 是否是初始化节点.
     * @return {string} htmlstring.
     */
    _getIdentString: function(isInit) {
        var me = this,
            string = '',
            prifix;
        while (me.getParentNode() && me.getParentNode().type != 'root') {
            me = me.getParentNode();
            prifix =( me.isLastNode(isInit) ? 'blank' : 'I');
            className = 'tangram-tree-node-' + prifix;
            if(me.skin){
                className += ' '+me.skin+ '-'+prifix;
            }
            string = '<span   class="'+className+'"></span>' + string;
        }
        return string;
    },
    /**
     * 获得TreeNode T线条或者L线条的String
     * @param {Array} stringArray.
     * @param {isInit} 是否是初始化节点.
     */
    _getTLString: function(isInit) {
        var me = this,
            prifix = (me.isLastNode(isInit) ? 'L' : 'T');
            className = 'tangram-tree-node-' + prifix;
        if(me.skin){
            className += ' '+me.skin+'-'+prifix; 
        }
        return '<span   class="' + className + '" ></span>';
    },
    /**
     * 组建TreeNode  Toggle string
     * @param {Array} stringArray.
     * @param {isInit} 是否是初始化节点.
     */
    _getToggleString: function(isInit) {
        var me = this,
            type = me.isExpand ? 'minus' : 'plus',
            prifix =  (me.isLastNode(isInit) ? 'L' : 'T') + type,
            className = 'tangram-tree-node-' + prifix;
        if(me.skin){
            className += ' '+me.skin+'-'+prifix;
        }
        return ['<span onclick="', me._getCallRef(),
                '._onToggleClick(event)" class="',className,
                '" id="',me.id,'-toggle"></span>'].join('');
    },
    /**
     * 组建TreeNode  Toggle string
     */
    _createIconStringArray: function() {
        var me = this,
            className = (me.type == 'leaf' ? 'leaf' : 'trunk'),
            stringArray = me._stringArray;
        if (me.isOpen) {
            className = 'open-trunk';
        }
        stringArray.push('<span  class="tangram-tree-node-',className);
        if(me.skin) {
            stringArray.push(' ',me.skin,'-',className);
        }
        stringArray.push('" style="',me.icon ? 'background-image:url(' + me.icon + ')' : '',
            '" id="', me.id,'-icon"></span>');
    },
    /**
     * 获得TreeNode  text string
     * @return {String} htmlstring.
     */
    _createTextStringArray: function() {

        var me = this,
            text = (me.href ? me._createHrefStringArray() : me.text),
            stringArray = me._stringArray;
        stringArray.push('<span title="',me.title || me.text,'" id="',
            me.id,'-text" >',text,'</span></span>');
    },
    /**
     * 获得TreeNode  href string
     * @return {String} htmlstring.
     */
    _createHrefStringArray: function() {
        var me = this,
            stringArray = me._stringArray;
        stringArray.push('<a id="',me.id,'-link',
            (me.target ? "target='" + me.target + "'" : ''),' hidefocus="on" " href="',
            me.href,'" >',me.text,'</a>');
    },
    /**
     * 取得图标(线或者blank)的容器
     * @return {HTMLObject} span.
     */
    _getSpanElement: function() {
        return baidu.g(this._getId('span'));
    },
    /**
     * 取得节点图标的HTMLObject
     * @return {HTMLObject}
     */
    _getIconElement: function() {
        return baidu.g(this._getId('icon'));
    },
    /**
     * 取得文本父容器的HTMLObject
     * @return {HTMLObject}
    */
    _getTextContainer: function() {
        return baidu.g(this._getId('textContainer'));
    },
    /**
     * 取得文本容器的HTMLObject
     * @return {HTMLObject}
     */
    _getTextElement: function() {
        return baidu.g(this._getId('text'));
    },
    /**
     * 取得切换展开或收起的image HTMLObject
     * @return {HTMLObject}
     */
    _getToggleElement: function() {
        return baidu.g(this._getId('toggle'));
    },
    /**
     * 取得装子节点的父容器 HTMLObject
     * @return {HTMLObject}
     */
    _getSubNodesContainer: function() {
        return baidu.g(this._getId('subNodeId'));
    },
    /**
     * 取得href的容器 HTMLObject
     * @return {HTMLObject}
     */
    _getHrefElement: function() {
        return baidu.g(this._getId('link'));
    },
    /**
     * 取得node(不包括子节点)的 HTMLObject
     * @return {HTMLObject}
     */
    _getNodeElement: function() {
        return baidu.g(this._getId('node'));
    },
    /**
     * 取得node(包括子节点的dom)的容器 HTMLObject
     * @return {HTMLObject}
     */
    _getContainer: function() {
        return baidu.g(this.id);
    },
    /**
     * 隐藏节点，但不包括它的子节点。
     */
    hide: function() {
        baidu.dom.hide(this._getNodeElement());
    },
    /**
     * 显示节点。
     */
    show: function() {
        baidu.dom.show(this._getNodeElement());
    },
    /**
     * 递归展开所有子节点
     */
    expandAll: function() {
        var me = this;
        if(me.children) {
            me.expand();
        }
        baidu.array.each(me.getChildNodes(), function(item) {
            item.expandAll();
        });
    },
    /**
     * 递归收起所有子节点
     */
    collapseAll: function() {
        var me = this;
        if (me.getChildNodes().length > 0) {
            me.collapse();
        }
        baidu.array.each(me.getChildNodes(), function(item) {
            item.collapseAll();
        });
    },
    /**
     * 取得本节点所对应父节点的索引
     * @return {int} index.
     */
    getIndex: function() {
        var me = this,
            nodes = me.isRoot ? [] : me.getParentNode().getChildNodes(),
            index = -1;
        for (var i = 0, len = nodes.length; i < len; i++) {
            if (nodes[i] == me) {
                return i;
            }
        }
        return index;
    },
    /**
     * 取得本节点的下一个节点
     * 如果没有就返回自己
     * @return {TreeNode} next.
     */
    getNext: function() {
        var me = this, 
            index = me.getIndex(),
            nodes;
        if(me.isRoot) {
            return me;
        }
        nodes = me.getParentNode().getChildNodes();
        return (index + 1 >= nodes.length) ? me : nodes[index + 1];
    },
    /**
     * 取得本节点的上一个节点
     * 如果没有就返回自己
     * @return {TreeNode} previous.
     */
    getPrevious: function() {
        var me = this, 
            index = me.getIndex(),
            nodes ;
        if(me.isRoot) {
            return me;
        }
        nodes = me.getParentNode().getChildNodes();
        return (index - 1 < 0) ? me : nodes[index - 1];
    },
    /**
     * 取得本节点的第一个子节点
     * 如果没有就返回null
     * @return {TreeNode} previous.
     */
    getFirstChild: function() {
        var me = this,
            nodes = me.getChildNodes();
        return (nodes.length <= 0) ? null : nodes[0];
    },
    /**
     * 取得本节点的最后一个子节点
     * 如果没有就返回null
     * @return {TreeNode} previous.
     */
    getLastChild: function() {
        var me = this,
            nodes = me.getChildNodes();
        return nodes.length <= 0 ? null : nodes[nodes.length - 1];
    },
    /**
     * 是否是最后一个节点
     * 在初始渲染节点的时候，自己维护了一个_isLast,就不用去动态算是否是最后一个子节点。
     * 而在动态新增，删除节点时，动态的处理是否是最后一个节点能方便代码实现，
     * 这样做的目的既能保证初始化时的性能，也能够方便动态功能的实现。.
     * @return {Boolean} true | false.
     */
     //isInit不作为参数做文档描述，是一个内部参数。
    isLastNode: function(isInit) {
        var me = this;
        if (isInit) {
            return me._isLast;
        }
        if(me.isRoot) {
            return true;
        }
            
        return me.getIndex() == (me.parentNode.childNodes.length - 1);
    }
    

};

baidu.object.extend(baidu.ui.Tree.TreeNode.prototype, baidu.lang.Class.prototype);

baidu.ui.Tree.extend(
    /**
     *  @lends baidu.ui.Tree.prototype
     */
    {
    //ui类型
    uiType: 'tree',
    //模板
    tplDOM: "<div class='#{class}'>#{body}</div>",
    /**
     * 取得html string
	 * @private
     * @return tree的htmlstring,
     */
    getString: function() {
        var me = this;
        return baidu.format(me.tplDOM, {
            'class' : me.getClass(),
            body: me._getBodyString()
        });
    },
    /**
     * 渲染树
     * @param {HTMLElement|String} main
     */
    render: function(main) {
        var me = this;
        me.renderMain(main).innerHTML = me.getString();
        me.dispatchEvent('onload');
    },
    /**
     * 内部方法,取得树的HTML的内容
     * @return {String} string.
     */
    _getBodyString: function() {
        var string = '',
            me = this;
        if (me.data) {
            me._rootNode = new baidu.ui.Tree.TreeNode(me.data);
            me._rootNode.isRoot = true;
            me._rootNode.type = 'root';
            me._rootNode._level = 0;
            me._rootNode.setTree(me);
            //初始化树形结构
            string = me._rootNode.getString();
        }
        return string;
        
    },
    /**
     * 取得树的节点的集合map,treeNode的id与treeNode的键值对。
     * @return {Object} map.
     */
    getTreeNodes: function() {
        return this._treeNodes;
    },
    /**
     * 取得树的最根节点
     * @return {TreeNode} treeNode.
     */
    getRootNode: function() {
        return this._rootNode;
    },
    /**
     * 通过id属性来取得treeNode
     * @param {String} id       节点id
     * @return {TreeNode} treeNode.
     */
    getTreeNodeById: function(id) {
        return this.getTreeNodes()[id];
    },
    /**
     * 取得树的当前节点
     * @return {TreeNode} treeNode.
     */
    getCurrentNode: function() {
        return this._currentNode;
    },
    /**
     * 设置节点为树的当前节点
     * @return {TreeNode} treeNode.
     */
    setCurrentNode: function(treeNode) {
        this._currentNode = treeNode;
    },
    /**
     *销毁Tree对象
     */
    dispose: function() {
        var me = this;
        me.dispatchEvent('dispose');
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});



/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/behavior/decorator.js
 * author: berg
 * version: 1.1.0
 * date: 2010/11/1
 */







/**
 * 为ui控件添加装饰器
 */
(function(){
    var Decorator = baidu.ui.behavior.decorator = function(){
        this.addEventListener("onload", function(){
            var me = this,
                opt;
            baidu.each(me.decorator, function(decoratorName, i){
                opt = { ui : me , skin : me.skin };
                if(baidu.lang.isString(decoratorName)){
                    opt['type'] = decoratorName;
                }else{
                    baidu.extend(opt, decoratorName);
                }
                me._decoratorInstance[i] = new baidu.ui.Decorator(opt);
                me._decoratorInstance[i].render();
            });
        });

        this.addEventListener("ondispose", function(){
            this._decoratorInstance = [];
            baidu.each(this._decoratorInstance, function(decorator){
                decorator.dispose();
            });
        });
    };

    /**
     * 存放装饰器控件实例
     */
    Decorator._decoratorInstance = [];

    /**
     * 获取所有装饰器控件实例
     * @return {array|Decorator} 所有装饰器的数组或者单个装饰器
     */
    Decorator.getDecorator = function(){
        var instance = this._decoratorInstance;
        return instance.length > 0 ? instance : instance[0];
    };
})();


/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/behavior/droppable.js
 * author: rocy
 * version: 1.0.0
 * date: 2010/09/16
 */

/* BASE: baidu/dom/droppable.js */

/**
 *
 * 为ui控件添加容纳拖拽控件的行为
 * ui控件初始化参数增加如下:
 * {
 * 	droppable  : 是否有drop行为
 *  dropHandler: 用于drop的DOM元素,
 *  dropOptions: 与baidu.dom.droppable的参数一致,
 *  
 * }
 */
(function(){
	var Droppable = baidu.ui.behavior.droppable = function(){
		var me = this;
		//默认仅发送事件
		me.dropOptions = baidu.extend({
            ondropover : function(event){
                me.dispatchEvent("ondropover",event);
            },
            ondropout : function(event){
                me.dispatchEvent("ondropout", event);
            },
            ondrop : function(event){
                me.dispatchEvent("ondrop", event);
            }
        },me.dropOptions);
        
		me.addEventListener("onload",function(){
			me.dropHandler = me.dropHandler || me.getBody();
			me.dropUpdate(me);
		});
	};
	
	Droppable.dropUpdate = function(options){
		var me = this;
		options && baidu.extend(me, options);
		//使已有drop失效,必须在droppable判定之前,使droppable支持动态修改
		me._theDroppable && me._theDroppable.cancel();
		if(!(me.droppable)){
			return;
		}
		me._theDroppable = baidu.dom.droppable(me.dropHandler, me.dropOptions);
	};
})();




/**
 * Tangram UI
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/behavior/sortable.js
 * author: fx
 * version: 1.0.0
 * date: 2010-12-21
 *
 */














//2011-2-23做了以下优化，在初始化的时候生成一个坐标与对象的键值对集合。
//再判断拖拽元素的坐标是否在键值对范围内，如果是就做排序操作。
(function() {

    var Sortable = baidu.ui.behavior.sortable = function() {
        this.addEventListener("dispose", function(){
            baidu.event.un(me.element, 'onmousedown', handlerMouseDown);
        });
    };

    /**
     * sortable : 组件公共行为，用来完成dom元素位置的交换.
     * 可以用于树的节点的排序，列表的排序等等.
     *
     *
     * @param {Array}  sortElements 被排序的元素数组.
     * @param {Array}  sortParentElement 被排序的元素的父元素，用来做事件代理的。.
     * @param {Object} options 可子定义参数.
     * sortHandlers {Array} 默认值[]  拖拽手柄数组，这个需要与elements一一对应.
     *                  如果handlers为空,那么整个sortElement都是可以进行拖拽。.
     *
     * sortDisabled {Boolean} 默认值
     *
     * sortRangeElement {HTMLElement} 默认值 null  定义拖拽的边界元素，就能在这个元素范围内进行拖拽
     *
     * sortRange {Array}    默认值[0,0,0,0] 鼠标的样式 排序的范围,排序的元素只能在这个范围进行拖拽
     *
     * onsortstart {Function}  排序开始的时候的事件
     *
     * onsort {Function}  正在排序时候的事件
     *
     * onsortend {Function}  排序结束时候的事件
     *
     */
     // TODO axis {String}   默认值 null .  坐标，当坐标为"x",元素只能水平拖拽，当坐标为"y",元素只能垂直拖拽。
     // TODO  delay {Integer}  默认值 0  当鼠标mousedown的时候延长多长时间才可以执行到onsortstart。
     //                        这个属性可以满足只点击但不排序的用户
     // TODO  useProxy 默认值 false  是否需要代理元素，在拖拽的时候是元素本身还是代理
     // 实现思路
     // 点击一组元素其中一个，在mousedown的时候将这个元素的position设为absolute,在拖动的时候判断
     // 此元素与其他元素是否相交，相交就在相交的元素下面生成一个空的占位符（宽和高与拖动元素一样），dragend的
     // 时候将此拖拽的元素替代占位符.那么排序就完成。
     // 完成此效果可以借助baidu.dom.drag来辅助实现.
     // 规则:
     // 1.这一组元素的style.position应该是一致的.
     // 2.这一组元素应该是同一html标签的元素.

    Sortable.sortUpdate = function(sortElements, sortParentElement, options) {
        var position,
            element,
            handler,
            me = this,
            rangeElementPostion,
            options = options || {};
        if (me.sortDisabled) {
            return false;
        }
        options.sortElements = sortElements;
        baidu.object.extend(me, options);
        me.sortHandlers = me.sortHandlers || me.sortElements;
        me.element = sortParentElement;
        me.sortRangeElement = baidu.g(me.sortRangeElement) || document.body;
        rangeElementPostion = baidu.dom.getPosition(me.sortRangeElement);
        //先将elements的position值存下来.在这里说明一下sortable的规则，对于elements,
        //应该是一组position值相同的元素。
        if (me.sortElements) {
            me._sortPosition = baidu.dom.getStyle(me.sortElements[0], 'position');
        }
        //设置range 上右下左
        if(!me.sortRange){
            me.sortRange = [
                rangeElementPostion.top,
                rangeElementPostion.left + me.sortRangeElement.offsetWidth,
                rangeElementPostion.top + me.sortRangeElement.offsetHeight,
                rangeElementPostion.left
            ];
        }

        baidu.event.on(me.element, 'onmousedown', mouseDownHandler);

    };

    function isInElements(elements, element) {
        var len = elements.length,
            i = 0;
        for (; i < len; i++) {
            if (elements[i] == element) {
                return true;
            }
        }
    }
    
    /*
     * 事件代理，放在sortElement的父元素上
     */
    function mouseDownHandler(event) {
        var element = baidu.event.getTarget(event),
            position = baidu.dom.getPosition(element),
            parent = element.offsetParent,
            parentPosition = (parent.tagName == 'BODY') ? {left: 0, top: 0} : baidu.dom.getPosition(parent);
            if (!isInElements(me.sortElements, element)) {
                return false;
            }
            baidu.dom.setStyles(element, {
                left: (position.left - parentPosition.left) + 'px',
                top: (position.top - parentPosition.top) + 'px',
                //如果position为relative,拖动元素，还会占有位置空间，所以在这里将
                //position设置为'absolute'
                position: 'absolute'
            });
            me._sortBlankDivId = me._sortBlankDivId || _createBlankDiv(element, me).id;
            baidu.dom.drag(element, {range: me.sortRange,
                ondragstart: function(trigger) {
                    me.sortElementsMap = _getElementsPosition(me.sortHandlers);
                    me.dispatchEvent('sortstart', {trigger: trigger});
                },
                ondrag: function(trigger) {
                    var elements = me.sortHandlers,
                        i = 0,
                        len = elements.length,
                        target,
                        position = baidu.dom.getPosition(trigger);
                    target = getTarget(
                            position.left,
                            position.top,
                            trigger.offsetWidth,
                            trigger.offsetHeight,
                            me.sortElementsMap
                        );
                    if (target != null) {
                        me._sortTarget = target;
                        baidu.dom.insertAfter(_getBlankDiv(me), target);
                    }
                    me.dispatchEvent('sort', {trigger: trigger});
                },

                ondragend: function(trigger) {
                    if (me._sortTarget) {
                        baidu.dom.insertAfter(trigger, me._sortTarget);
                        me.dispatchEvent('sortend', {trigger: trigger, reciever: me._sortTarget});
                    }
                    baidu.dom.remove(_getBlankDiv(me));
                    me._sortBlankDivId = null;
                    baidu.dom.setStyles(trigger, {position: me._sortPosition, left: '0px', top: '0px'});

                }
            });

    }

    //通过拖拽的元素的x,y坐标和宽高来定位到目标元素。
    function getTarget(left, top, width, height, map) {
        var i,
            _height,
            _width,
            _left,
            _top,
            array,
            max = Math.max,
            min = Math.min;
        for (i in map) {
            array = i.split('-');
            _left = +array[0];
            _top = +array[1];
            _width = +array[2];
            _height = +array[3];
            if (max(_left, left) <= min(_left + _width, left + width)
               && max(_top, top) <= min(_top + _height, top + height)) {
               return map[i];
            }
        }
        return null;
    }


    //取得一组元素的定位与元素的map
    function _getElementsPosition(elements) {
        var map = {},
            position;
        baidu.each(elements, function(item) {
            position = baidu.dom.getPosition(item);
            map[position.left + '-' + position.top + '-' + item.offsetWidth + '-' + item.offsetHeight] = item;
        });
        return map;
    }



    //取得空占位符的dom元素
    function _getBlankDiv(me) {
        return baidu.g(me.getId('sortBlankDiv'));
    }

    //创建一个空占位符的层
    function _createBlankDiv(trigger, me) {
        var div = baidu.dom.create('div', {
            id: me.getId('sortBlankDiv'),
            className: trigger.className
        });
        baidu.dom.setStyles(div, {
            width: trigger.offsetWidth + 'px',
            height: trigger.offsetHeight + 'px',
            borderWidth: '0px'
        });
        baidu.dom.insertBefore(div, trigger);
        return div;
    }

})();






/* BASE: baidu/browser/firefox.js */





/* BASE: baidu/page/createStyleSheet.js */


/**
 * 创建一个 Popup 层
 * 
 * @author: meizz
 * @namespace: baidu.ui.createPopup
 * @version: 2010-06-08
 *
 * @param   {JSON}      options     配置信息
 */
baidu.ui.createPopup = function(options) {
    var popup = baidu.lang.createSingle({isOpen : false});
    popup.eid = "baidupopup_"+ popup.guid;

    // IE 浏览器使用系统的 window.createPopup()
    var POPUP, IFRAME,
        bodyStyle = "font-size:12px; margin:0;";
    try {baidu.browser.ie && (POPUP = window.createPopup());}catch(ex){}

    // 非 IE 浏览器使用 <iframe> 作为 popup 的载体
    if (!POPUP) {
        var str = "<iframe id='"+ popup.eid +"' scrolling='no'"+
            " frameborder='0' style='position:absolute; z-index:1001; "+
            " width:0px; height:0px; background-color:#0FFFFF'></iframe>";
        if (!document.body) {document.write(str);} else {
            baidu.dom.insertHTML(document.body, "afterbegin", str);
        }
    }

    /**
     * 启动 popup 的初始化程序
     */
    popup.render = function() {
        var me = this;
        if (POPUP) {   // window.createPopup()
            me.window = POPUP;
            me.document = POPUP.document;
            var s = me.styleSheet = me.createStyleSheet();
            s.addRule("body", bodyStyle);
            me.dispatchEvent("onready");
        } else {
            // 初始化 iframe
            initIframe();
        }
        baidu.event.on(window, "onblur", function(){
            me.focusme = false;
            if (!me.isOpen) return;
            setTimeout(function(){if(!me.focusme) me.hide()}, 100);
        });
        baidu.event.on(window, "onresize", function(){me.hide()});
        baidu.event.on(document, "onmousedown", function(){me.hide()});
    };

    function initIframe(delay) {
        IFRAME = baidu.dom.g(popup.eid);

        // 修正Firefox的一个BUG
        // Firefox 对于刚刚动态创建的 <iframe> 写入的时候无法渲染内容
        if ((!delay && baidu.browser.firefox) || !IFRAME) {
            setTimeout(function(){initIframe(true)}, 10);
            return;
        }
        popup.window = IFRAME.contentWindow;
        var d = popup.document = popup.window.document;
        var s = "<html><head><style type='text/css'>"+
            "body{"+ bodyStyle +" background-color:#FFFFFF;}\n"+
            "</style></head><body onfocus='parent[\""+ baidu.guid +"\"]._instances[\""+
            popup.guid +"\"].focusme=true'></body></html>";
        d.open(); d.write(s); d.close();
        popup.styleSheet = popup.createStyleSheet();
        popup.dispatchEvent("onready");
    }

    /**
     * 创建 popup 层里的 style sheet 对象
     */
    popup.createStyleSheet = function(op) {
        op = op || {};
        op.document = this.document;
        return baidu.page.createStyleSheet(op);
    };

    /**
     * 显示 popup 层
     */
    popup.show = function(left, top, width, height, trigger, position) {
        if (POPUP) {
            if (position == "top") top = -height;
            else top = trigger.offsetHeight;

            POPUP.show(0, top, width, height, trigger || document.body);

            this.isOpen = POPUP.isOpen;
        } else if (IFRAME) {
            baidu.dom.show(this.eid);

            if (position == "top") top -= height;
            else top = top + trigger.offsetHeight;

            this.isOpen = true;
            var s = IFRAME.style;
            s.width = width +"px";
            s.height = height +"px";
            s.top = top +"px";
            s.left = left +"px";
        }
        this.dispatchEvent("onshow");
    };

    /**
     * 显示 popup 层
     */
    popup.bind = function(trigger, width, height, position) {
        var pos = baidu.dom.getPosition(trigger);
        this.show(pos.left, pos.top, width, height, trigger, position);
    };

    /**
     * 隐藏 popup 层
     */
    popup.hide = function() {
        if (this.isOpen) {
            if (POPUP) {
                POPUP.hide();
                this.isOpen = POPUP.isOpen;
            } else if (IFRAME) {    // iframe mode
                this.isOpen = false;

                var s = IFRAME.style;
                s.width = "0px";
                s.height = "0px";
                baidu.dom.hide(this.eid);
            }
            this.dispatchEvent("onhide");
        }
    };

    /**
     * 向 popup 层写入内容
     */
    popup.write = function(str) {
        var me = this;
        this.document.body.innerHTML = str;
        //this.document.close();
    };

    return popup;
};



/* BASE: baidu/string/trim.js */
/* BASE: baidu/string/toCamelCase.js */

/**
 *  从指定的dom元素中获取ui控件的属性值
 *
 *  todo: &datasource支持
 */

baidu.ui.getAttribute = function(element){
    var attributeName = "data-tangram",
        attrs = element.getAttribute(attributeName),
        params = {},
        len,
        trim = baidu.string.trim;

    if (attrs) {
        //element.removeAttribute(attributeName);
        attrs = attrs.split(';');
        len = attrs.length;

        for (; len--; ) {
            var s = attrs[len],
                pos = s.indexOf(':'),
                name = trim(pos >= 0 ? s.substring(0, pos) : s),
                value = pos >= 0 ? trim(s.substring(pos + 1)) || 'true' : 'true';

            params[baidu.string.toCamelCase(trim(name))] =
                /^\d+(\.\d+)?$/.test(value)
                    ? value - 0
                    : value == 'true' ? true : value == 'false' ? false : value;
        }
    }

    return params;
};



/**
 * 应用实现 confirm
 * @function
 * @param  {String|DOMElement}  content               内容或者内容对应的元素
 * @param  {Object}             [options]             选项参数
 * @config {DOMElement}         content               要放到dialog中的元素，如果传此参数时同时传contentText，则忽略contentText。
 * @config {String}             contentText           dialog中的内容
 * @config {String|Number}      width                 内容区域的宽度，注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
 * @config {String|Number}      height                内容区域的高度
 * @config {String|Number}      top                   dialog距离页面上方的距离
 * @config {String|Number}      left                  dialog距离页面左方的距离
 * @config {String}             titleText             dialog标题文字
 * @config {String}             classPrefix           dialog样式的前缀
 * @config {Number}             zIndex                dialog的zIndex值
 * @config {Object}             buttons               配置button选项。
 * @config {Function}           onopen                dialog打开时触发
 * @config {Function}           onclose               dialog关闭时触发
 * @config {Function}           onbeforeclose         dialog关闭前触发，如果此函数返回false，则组织dialog关闭。
 * @config {Function}           onupdate              dialog更新内容时触发
 * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭dialog。
 * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的title。
 * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
 * @config {String}             modalColor            modal模块支持，遮罩的颜色
 * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
 * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
 * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
 * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
 * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
 * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
 * @config {Boolean}            [autoOpen]            是否一开始就打开，默认为true
 * @config {Boolean}            submitOnEnter         是否监听回车键
 */

baidu.ui.Dialog.confirm = function(content,options){
    var options,
        dialogInstance; 

    options = baidu.extend({autoRender:true,type:'confirm'},options);

    if (baidu.isString(content)) {
        options.contentText = content;
    } else {
        options.content = content;
    }

    dialogInstance = new baidu.ui.Dialog(options);
    return dialogInstance;
}

/**
 * 应用实现 alert
 * @function
 * @param  {String|DOMElement}  content               内容或者内容对应的元素
 * @param  {Object}             [options]             选项参数
 * @config {DOMElement}         content               要放到dialog中的元素，如果传此参数时同时传contentText，则忽略contentText。
 * @config {String}             contentText           dialog中的内容
 * @config {String|Number}      width                 内容区域的宽度，注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
 * @config {String|Number}      height                内容区域的高度
 * @config {String|Number}      top                   dialog距离页面上方的距离
 * @config {String|Number}      left                  dialog距离页面左方的距离
 * @config {String}             titleText             dialog标题文字
 * @config {String}             classPrefix           dialog样式的前缀
 * @config {Number}             zIndex                dialog的zIndex值
 * @config {Object}             buttons               配置button选项。
 * @config {Function}           onopen                dialog打开时触发
 * @config {Function}           onclose               dialog关闭时触发
 * @config {Function}           onbeforeclose         dialog关闭前触发，如果此函数返回false，则组织dialog关闭。
 * @config {Function}           onupdate              dialog更新内容时触发
 * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭dialog。
 * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的title。
 * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
 * @config {String}             modalColor            modal模块支持，遮罩的颜色
 * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
 * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
 * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
 * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
 * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
 * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
 * @config {Boolean}            [autoOpen]            是否一开始就打开，默认为true
 * @config {Boolean}            submitOnEnter         是否监听回车键
 */

baidu.ui.Dialog.alert = function(content,options){
    var options,
        dialogInstance; 

    options = baidu.extend({autoRender:true,type:'alert'},options);

    if (baidu.isString(content)) {
        options.contentText = content;
    } else {
        options.content = content;
    }

    dialogInstance = new baidu.ui.Dialog(options);
    return dialogInstance;
}

/**
 * 应用实现 iframe
 * @function
 * @param  {String}             iframeSrc             iframe的url
 * @param  {Object}             options optional      选项参数
 * @config {DOMElement}         content               要放到dialog中的元素，如果传此参数时同时传contentText，则忽略contentText。
 * @config {String}             contentText           dialog中的内容
 * @config {String|Number}      width                 内容区域的宽度，注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
 * @config {String|Number}      height                内容区域的高度
 * @config {String|Number}      top                   dialog距离页面上方的距离
 * @config {String|Number}      left                  dialog距离页面左方的距离
 * @config {String}             titleText             dialog标题文字
 * @config {String}             classPrefix           dialog样式的前缀
 * @config {Number}             zIndex                dialog的zIndex值
 * @config {Function}           onopen                dialog打开时触发
 * @config {Function}           onclose               dialog关闭时触发
 * @config {Function}           onbeforeclose         dialog关闭前触发，如果此函数返回false，则组织dialog关闭。
 * @config {Function}           onupdate              dialog更新内容时触发
 * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭dialog。
 * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的title。
 * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
 * @config {String}             modalColor            modal模块支持，遮罩的颜色
 * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
 * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
 * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
 * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
 * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
 * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
 * @config {Boolean}            [autoOpen]            是否一开始就打开，默认为true
 */

baidu.ui.Dialog.iframe = function(iframeSrc, options) {
    options = baidu.extend({
        iframeSrc:iframeSrc,
        type:"iframe"
    },options || {});
    var dialog = new baidu.ui.Dialog(options);
    return dialog;
};

/* BASE: baidu/dom/getParent.js */

/**
 * 从当前页面批量setup所有控件（DOM - 控件）
 *
 * @param {DOMElement} element 渲染查找的根元素
 */
baidu.ui.setup = function(element){
    var i = 0,
        len = 0,
        o = element.getElementsByTagName('*'),
        elements = [element],
        instance,
        type,
        uiPackage;

    for (; element = o[i]; ) {
        elements[++i] = element;
    }

    for (i = 0; element = elements[i++]; ) {
        if (baidu.dom.getParent(element)) { 
            o = baidu.ui.getAttribute(element);
            if (type = o.ui) { //0907修改此处为ui，berg
                uiPackage = baidu.ui[type];
                if(typeof uiPackage.setup == 'function'){
                    //如果有setup静态方法，直接调用
                    uiPackage.setup(element, o);
                }
            }
        }
    }
};

/**
 * @namespace baidu.widget widget机制, 用于模块化开发.
 * @remark
 *     widget是指一个包含它依赖信息的完整功能块. 
 * widget机制是通过一些api封装,解决widget的依赖管理,通信机制以及部署支持.
 * 依赖管理通过声明方式配置, 详见 baidu.widget.create方法.
 * 通信机制是指widget对其他widget的调用,对于所依赖widget,可以直接调用; 与非依赖widget的通信则通过事件机制实现.详见 baidu.widget.create方法.
 * 开发状态下,可以通过默认的路径配置规则对应代码,部署时可以工具配置baidu.widget._pathInfo.详见 baidu.widget.getPath方法.
 * @author rocy 
 * @see baidu.widget.create, baidu.widget.getPath
 */
baidu.widget = baidu.widget || {
    _pathInfo : {},
    /**
     * widget url查找的根路径, 相对根路径或绝对根路径皆可.
     */
    _basePath : '',
    _widgetInUse : {},
    _widgetLoading : {},
    _defaultContext : {}
};

/**
 * 检查传入对象是否为widget
 * @name baidu.widget._isWidget
 * @author rocy
 * @function
 * @private
 * @grammar baidu.widget._isWidget(widget)
 * @param {Object} widget 待检测widget.
 *
 * @return {Boolean} 是否为widget.
 */
baidu.widget._isWidget = function(widget) {
    if (!widget ||
        !baidu.lang.isString(widget.id) ||
        !baidu.lang.isObject(widget.exports) ||
        !baidu.lang.isFunction(widget.main)) {
        return false;
    }
    return true;
};

/**
 * 获取已加载的widget.
 * @name baidu.widget.get
 * @function
 * @grammar baidu.widget.get(name)
 * @param {String} name widget名.
 * @remark
 *   get方法仅获取已加载的widget,并不做加载. 。
 *
 * @return {Object} widget
 * @author rocy
 */
baidu.widget.get = function(name) {
    return baidu.widget._widgetInUse[name] || null;
};

/* BASE: baidu/page/load.js */


/**
 * 获取widget的url路径. <br/> 优先查找baidu.widget._pathInfo下的配置, 默认会将"pkg1.pkg2.widget" 映射成"pkg1/pkg2/widget.js"
 * @name baidu.widget.getPath
 * @function
 * @grammar baidu.widget.getPath(name)
 * @param {String} name widget名.
 * @remark
 *     可以根据实际情况重写
 *
 * @return {String} widget路径.
 * @author rocy
 */
baidu.widget.getPath = function(name) {
    return baidu.widget._basePath + 
    	(baidu.widget._pathInfo[name] || (name.replace(/\./g, '/') + '.js'));
};

/* BASE: baidu/lang/module.js */


/**
 * 加载widget, 并在widget加载完成后执行传入的方法.
 * @name baidu.widget.load
 * @function
 * @grammar baidu.widget.load(widgets, executer)
 * @param {Array<String>|String} widgets widget名称数组.
 * @param {Function} executer widget加载完成时执行,第一个参数为获取widget API的方法(require).
 * @author rocy
 */
baidu.widget.load = function(widgets, executer) {
    var files = [],
        executer = executer || baidu.fn.blank,
        makeRequire = function(context){
            var ret = function (id){
                var widget = ret.context[id];
                if(!baidu.widget._isWidget(widget)){
                    throw "NO DEPENDS declare for: " + id;
                }
                return widget.exports;
            };
            ret.context = context;
            return ret;
        },
        realCallback = function() {
            var i = 0,
                length = widgets.length,
                context = baidu.object.extend({}, baidu.widget._defaultContext),
                widgetName,
                widget, widgetLoading;
            for (; i < length; ++i) {
                widgetName = widgets[i],
                widget = baidu.widget.get(widgetName),
                widgetLoading = baidu.widget._widgetLoading[widgetName];
                //避免重复加载.若widget正在加载中,则等待加载完成后再触发.否则清空加载状态.
                if (!widget && widgetLoading && widgetLoading.depends) {
                    window.setTimeout(function() {
                        baidu.widget.load(widgetLoading.depends, realCallback);
                    }, 20);
                    return;
                } else {
                    baidu.widget._widgetLoading[widgetName] = undefined;
                }
                if (baidu.widget._isWidget(widget)) {
                    //累加依赖模块的context,并将依赖模块置于context中.
                    baidu.extend(context, widget.context);
                    //baidu.extend(context, widget.exports);
                    //无需注入到相应的名字空间 context.xx.yy
                    //baidu.lang.module(widgetName, widget, context);
                    context[widgetName] = widget;
                }
            }
            executer(makeRequire(context));
        };
    if (!widgets) {
        executer(makeRequire(baidu.widget._defaultContext));
    }
    //widget列表支持逗号分隔的字符串描述
    if (baidu.lang.isString(widgets)) {
        widgets = widgets.split(',');
    }
    baidu.each(widgets, function(widget) {
        if (baidu.widget._isWidget(baidu.widget.get(widget))) {//已加载
            return;
        }
        files.push({url: baidu.widget.getPath(widget)});
    });
    files.length ?
        baidu.page.load(files, {onload: realCallback}) :
        realCallback();
};


/**
 * 根据传入的widget名, 初始化方法等,创建widget.
 * @id baidu.widget.create
 * @class
 * @grammar baidu.widget.create(id, main, [options])
 * @param {String} id widget名.
 * @param {Function} main widget的初始化方法,第一个参数为获取依赖widget API的方法(require), 第二个参数为API挂载点(exports).
 * @param {Object} [options] 配置参数.
 * @param {Array<String>|String} [options.depends] 依赖列表, 支持逗号分隔的字符串描述.
 * @param {Function} [options.dispose] 析构函数,在dispose时调用.
 * @param {Boolean} [options.lazyLoad] 延迟加载.该参数为true时不加载依赖模块,也不执行初始化方法,需显示调用 baidu.widget.load方法.
 * @remark
 * 该方法是commonjs中module部分的一个异步实现.
 * 该规范以及 require, exports 的定义等, 参考 http://wiki.commonjs.org/wiki/Modules/1.1.1
 * 若存在同名widget,将直接覆盖.
 * @see baidu.widget
 * @author rocy
 */
baidu.widget.create = function(id, main, options) {
    options = options || {};
    var widget = {
        id: id,
        main: main,
        depends: options.depends || [],
        dispose: options.dispose
    };
    baidu.widget._widgetLoading[id] = widget;
    widget.load = function() {
        var widget = this;
        baidu.widget.load(widget.depends, function(require) {
            baidu.widget._widgetInUse[widget.id] = widget;
            widget.context = require.context || baidu.widget._defaultContext;
            widget.exports = {};
            widget.main.call(widget, require, widget.exports);
        });
    };
    if (!options.lazyLoad) {
        widget.load();
    }
    return widget;
};


/**
 * 析构widget. 如果widget有dispose方法,则执行.
 * @name baidu.widget.dispose
 * @function
 * @grammar baidu.widget.dispose(widget)
 * @param {String} name widget名.
 * @author rocy
 */
baidu.widget.dispose = function(name) {
    var widget = baidu.widget.get(name);
    if (!baidu.widget._isWidget(widget)) {
        return;
    }
    //执行widget的dispose方法
    if (baidu.lang.isFunction(widget.dispose)) {
        widget.dispose();
    }
    delete baidu.widget._widgetInUse[name];
};



/* BASE: baidu/flash.js */
/* BASE: baidu/flash/_Base.js */
/* BASE: baidu/flash/imageUploader.js */
/* BASE: baidu/form.js */
/* BASE: baidu/form/ValidRule.js */
/* BASE: baidu/form/Validator.js */
/* BASE: baidu/form/Validator/Validator$message.js */
/* BASE: baidu/ajax.js */
/* BASE: baidu/ajax/form.js */
/* BASE: baidu/ajax/get.js */
/* BASE: baidu/ajax/post.js */

/* BASE: baidu/array.js */


/* BASE: baidu/array/empty.js */
/* BASE: baidu/array/every.js */
/* BASE: baidu/array/filter.js */



/* BASE: baidu/array/lastIndexOf.js */
/* BASE: baidu/array/map.js */
/* BASE: baidu/array/reduce.js */



/* BASE: baidu/array/unique.js */

/* BASE: baidu/browser/chrome.js */





/* BASE: baidu/browser/maxthon.js */
/* BASE: baidu/browser/opera.js */
/* BASE: baidu/browser/safari.js */
/* BASE: baidu/cookie.js */
/* BASE: baidu/cookie/_isValidKey.js */

/* BASE: baidu/cookie/getRaw.js */


/* BASE: baidu/cookie/setRaw.js */
/* BASE: baidu/date.js */

/* BASE: baidu/date/parse.js */

/* BASE: baidu/dom/_NAME_ATTRS.js */
/* BASE: baidu/dom/_g.js */
/* BASE: baidu/dom/_matchNode.js */
/* BASE: baidu/dom/_styleFilter.js */
/* BASE: baidu/dom/_styleFilter/color.js */
/* BASE: baidu/dom/_styleFilter/filter.js */

/* BASE: baidu/dom/_styleFixer.js */
/* BASE: baidu/dom/_styleFixer/display.js */


/* BASE: baidu/dom/_styleFixer/textOverflow.js */




/* BASE: baidu/dom/ddManager.js */



/* BASE: baidu/dom/empty.js */
/* BASE: baidu/dom/first.js */


/* BASE: baidu/dom/getAncestorByClass.js */


/* BASE: baidu/dom/getComputedStyle.js */
/* BASE: baidu/dom/getDocument.js */



/* BASE: baidu/dom/getText.js */

/* BASE: baidu/dom/hasAttr.js */





/* BASE: baidu/dom/intersect.js */
/* BASE: baidu/dom/last.js */
/* BASE: baidu/dom/next.js */
/* BASE: baidu/dom/prev.js */
/* BASE: baidu/dom/q.js */
/* BASE: baidu/dom/query.js */



/* BASE: baidu/dom/removeStyle.js */










/* BASE: baidu/dom/toggle.js */
/* BASE: baidu/dom/toggleClass.js */

/* BASE: baidu/element.js */
/* BASE: baidu/element/extend.js */
/* BASE: baidu/event.js */
/* BASE: baidu/event/EventArg.js */
/* BASE: baidu/event/_eventFilter.js */
/* BASE: baidu/event/_eventFilter/_crossElementBoundary.js */
/* BASE: baidu/event/_eventFilter/mouseenter.js */
/* BASE: baidu/event/_eventFilter/mouseleave.js */
/* BASE: baidu/event/_listeners.js */
/* BASE: baidu/event/_unload.js */
/* BASE: baidu/event/fire.js */

/* BASE: baidu/event/getKeyCode.js */




/* BASE: baidu/event/once.js */




/* BASE: baidu/fn.js */


/* BASE: baidu/fn/methodize.js */
/* BASE: baidu/fn/multize.js */
/* BASE: baidu/fn/wrapReturnValue.js */
/* BASE: baidu/fn/abstractMethod.js */
/* BASE: baidu/json.js */
/* BASE: baidu/json/decode.js */
/* BASE: baidu/json/encode.js */
/* BASE: baidu/json/parse.js */

/* BASE: baidu/lang.js */



/* BASE: baidu/lang/_instances.js */


/* BASE: baidu/lang/decontrol.js */
/* BASE: baidu/lang/eventCenter.js */

/* BASE: baidu/lang/inherits.js */




/* BASE: baidu/lang/isElement.js */






/* BASE: baidu/lang/getModule.js */
/* BASE: baidu/number.js */
/* BASE: baidu/number/comma.js */
/* BASE: baidu/number/pad.js */
/* BASE: baidu/number/randomInt.js */
/* BASE: baidu/object.js */
/* BASE: baidu/object/clone.js */


/* BASE: baidu/object/isPlain.js */

/* BASE: baidu/object/map.js */


/* BASE: baidu/object/isEmpty.js */
/* BASE: baidu/page.js */








/* BASE: baidu/page/lazyLoadImage.js */

/* BASE: baidu/page/loadCssFile.js */
/* BASE: baidu/page/loadJsFile.js */
/* BASE: baidu/platform.js */
/* BASE: baidu/platform/isAndroid.js */
/* BASE: baidu/platform/isIpad.js */
/* BASE: baidu/platform/isIphone.js */
/* BASE: baidu/platform/isMacintosh.js */
/* BASE: baidu/platform/isWindows.js */
/* BASE: baidu/platform/isX11.js */
/* BASE: baidu/sio.js */
/* BASE: baidu/sio/_createScriptTag.js */
/* BASE: baidu/sio/_removeScriptTag.js */


/* BASE: baidu/sio/log.js */
/* BASE: baidu/string.js */
/* BASE: baidu/string/decodeHTML.js */

/* BASE: baidu/string/escapeReg.js */
/* BASE: baidu/string/filterFormat.js */
/* BASE: baidu/string/filterFormat/escapeJs.js */
/* BASE: baidu/string/filterFormat/escapeString.js */
/* BASE: baidu/string/filterFormat/toInt.js */


/* BASE: baidu/string/getByteLength.js */
/* BASE: baidu/string/subByte.js */

/* BASE: baidu/string/toHalfWidth.js */

/* BASE: baidu/string/wbr.js */
/* BASE: baidu/string/stripTags.js */
/* BASE: baidu/swf.js */
/* BASE: baidu/swf/Proxy.js */
/* BASE: baidu/swf/create.js */
/* BASE: baidu/swf/createHTML.js */
/* BASE: baidu/swf/getMovie.js */
/* BASE: baidu/swf/version.js */
/* BASE: baidu/url.js */
/* BASE: baidu/url/escapeSymbol.js */
/* BASE: baidu/url/getQueryValue.js */
/* BASE: baidu/url/jsonToQuery.js */
/* BASE: baidu/url/queryToJson.js */
/* BASE: baidu/async.js */
/* BASE: baidu/async/Deferred.js */
/* BASE: baidu/async/_isDeferred.js */
/* BASE: baidu/async/get.js */
/* BASE: baidu/async/post.js */
/* BASE: baidu/async/when.js */
