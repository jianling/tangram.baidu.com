[{
	name : 'T.ui.Accordion',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.Accordion.getString',
		desc : '获得accordion的html string',
		shortcut : ''
	}, {
		name : 'T.ui.Accordion.insertItemHTML',
		desc : '插入item html',
		shortcut : ''
	}, {
		name : 'T.ui.Accordion.collapse',
		desc : '关闭当前打开的项',
		shortcut : ''
	}, {
		name : 'T.ui.Accordion.dispose',
		desc : '销毁实例的析构',
		shortcut : ''
	}]
}, {
	name : 'T.ui.Button',
	desc : 'button基类，创建一个button实例',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.Button.render',
		desc : '将button绘制到DOM树中。',
		shortcut : ''
	}, {
		name : 'T.ui.Button.isDisabled',
		desc : '判断按钮是否处于失效状态。',
		shortcut : ''
	}, {
		name : 'T.ui.Button.dispose',
		desc : '销毁实例。',
		shortcut : ''
	}, {
		name : 'T.ui.Button.disable',
		desc : '设置disabled属性',
		shortcut : ''
	}, {
		name : 'T.ui.Button.enable',
		desc : '删除disabled属性',
		shortcut : ''
	}, {
		name : 'T.ui.Button.fire',
		desc : '触发button事件',
		shortcut : ''
	}, {
		name : 'T.ui.Button.update',
		desc : '更新button的属性',
		shortcut : ''
	}]
}, {
	name : 'T.ui.Calendar',
	desc : '创建一个简单的日历对象',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.Calendar.renderTitle',
		desc : '渲染日历表的标题说明，如果对标题说明有特列要求，可以覆盖方法来实现',
		shortcut : ''
	}, {
		name : 'T.ui.Calendar.render',
		desc : '渲染日期组件到参数指定的容器中',
		shortcut : ''
	}, {
		name : 'T.ui.Calendar.update',
		desc : '更新日期的参数',
		shortcut : ''
	}, {
		name : 'T.ui.Calendar.gotoDate',
		desc : '跳转到某一天',
		shortcut : ''
	}, {
		name : 'T.ui.Calendar.gotoYear',
		desc : '跳转到某一年',
		shortcut : ''
	}, {
		name : 'T.ui.Calendar.gotoMonth',
		desc : '跳转到当前年份的某个月份',
		shortcut : ''
	}, {
		name : 'T.ui.Calendar.getToday',
		desc : '取得一个本地化的当天的日期',
		shortcut : ''
	}, {
		name : 'T.ui.Calendar.getDate',
		desc : '返回一个当前选中的当地日期对象',
		shortcut : ''
	}, {
		name : 'T.ui.Calendar.setDate',
		desc : '用一个本地化的日期设置当前的显示日期',
		shortcut : ''
	}, {
		name : 'T.ui.Calendar.prevMonth',
		desc : '翻页到上一个月份，当在年初时会翻到上一年的最后一个月份',
		shortcut : ''
	}, {
		name : 'T.ui.Calendar.nextMonth',
		desc : '翻页到下一个月份，当在年末时会翻到下一年的第一个月份',
		shortcut : ''
	}, {
		name : 'T.ui.Calendar.dispose',
		desc : '析构函数',
		shortcut : ''
	}]
}, {
	name : 'T.ui.Carousel',
	desc : '创建一个简单的滚动组件',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.Carousel.render',
		desc : '渲染滚动组件到参数指定的容器中',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getCurrentIndex',
		desc : '取得当前得到焦点项在所有数据项中的索引值',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getTotalCount',
		desc : '取得数据项的总数目',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getItem',
		desc : '根据数据的索引值取得对应在页面的DOM节点，当节点不存时返回null',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.scrollTo',
		desc : '从当前项滚动到index指定的项，并将该项放在scrollOffset的位置',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.prev',
		desc : '翻到上一项或是翻到上一页',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.next',
		desc : '翻到下一项或是翻到下一页',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.isFirst',
		desc : '是否已经处在第一项或第一页',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.isLast',
		desc : '是否已经处在末项或是末页',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.focus',
		desc : '使某一项得到焦点',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getScrollContainer',
		desc : '取得存放所有项的上层容器',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.dispose',
		desc : '析构函数',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.startAutoScroll',
		desc : '从停止状态开始自动滚动',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.stopAutoScroll',
		desc : '停止当前自动滚动状态',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.addText',
		desc : '将一个字符串的内容插入到索引指定的位置',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.addItem',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.removeItem',
		desc : '移除索引指定的某一项',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.addTableItem',
		desc : '在指定索引处插入一个新的多行多列表格',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.removeTableItem',
		desc : '移除由索引指定的项',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getTable',
		desc : '根据索引取得表格',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getString',
		desc : '生成ColorPalette的html字符串',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getSliderBody',
		desc : '获取滑动条容器对象',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getSliderDot',
		desc : '获取滑动块对象',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getPad',
		desc : '获取调色板对象',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getPadDot',
		desc : '获取调色块对象',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.setSliderDot',
		desc : '设置滑动块位置',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.setPadDot',
		desc : '设置调色块位置',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getColor',
		desc : '获取当前颜色值',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.update',
		desc : '更新colorPicker',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.open',
		desc : '打开 colorPicker',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.close',
		desc : '关闭 colorPicker',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getTarget',
		desc : '获取target元素',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.bodyClick',
		desc : 'body点击事件，点击body关闭菜单',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getInner',
		desc : '获得装饰器内部ui的body元素',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getBox',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.createButton',
		desc : '创建底部按钮',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.removeButton',
		desc : '删除底部按钮',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.hideModal',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getHeads',
		desc : '获得所有item head元素',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getBodies',
		desc : '获得所有item body元素',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getCurrentHead',
		desc : '取得当前展开的head',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.setCurrentHead',
		desc : '设置当前的head',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getBodyByHead',
		desc : '获得指定body对应的head',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getBodyByIndex',
		desc : '根据索引取得对应的body',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.switchByHead',
		desc : '切换到由参数指定的项',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.switchByIndex',
		desc : '根据索引切换到指定的项',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.onLoginSuccess',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.onLoginFailure',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.renderLogin',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.onRegisterSuccess',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.onRegisterFailure',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.changeTab',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.renderReg',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.targetHover',
		desc : '鼠标浮动到target上显示菜单',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.targetMouseOut',
		desc : '鼠标移出target关闭菜单',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.clearHideHandler',
		desc : '清除hideHandler',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.updateIcons',
		desc : '更新item图标',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getValue',
		desc : '获得当前的value',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.disable',
		desc : '禁用进度条',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.enable',
		desc : '启用进度条',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getBar',
		desc : '获取进度条元素',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getContainer',
		desc : '取得用户传入的需要被滚动条管理的对象',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getThumb',
		desc : '获取滑块元素',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getProgressBarString',
		desc : '根据tplProgressbar生成一个容器用来存入progressBar组件',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.setData',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getWindowResizeHandler',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.adjustPosition',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.beforedeactivateHandler',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getTargetKeydownHandler',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getRow',
		desc : '获得指定行控件',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getRowCount',
		desc : '获得表格中的行数',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.removeRow',
		desc : '删除行',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getMain',
		desc : '重写默认的getMain方法在Row控件中，main元素就是getId获得的元素',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.insertTo',
		desc : '使用dom的方式在指定的索引位置插入一行',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.select',
		desc : '选中当前行',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.unselect',
		desc : '去掉当前行的选中状态',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.remove',
		desc : '移除当前行',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.toggle',
		desc : '如果指定行处于选中状态，让其取消选中状态，否则反之',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getCell',
		desc : '根据索引取得单元格对象',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getParent',
		desc : '取得T.ui.table.Row对象',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.setParent',
		desc : '设置父对象',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getHTML',
		desc : '取得单元格的字符串内容',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.setHTML',
		desc : '设置单元格的字符串内容',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getPagerContainer',
		desc : '取得存放pager的容器',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.resize',
		desc : '重设pager容器的大小',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.attachEdit',
		desc : '绑定一行中的某列拥有双击事件',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.gotoPage',
		desc : '直接翻到索引指定的页数',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.prevPage',
		desc : '翻到上一页',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.nextPage',
		desc : '翻到下一页',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getTotalPage',
		desc : '取得总页数',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getCurrentPage',
		desc : '取得当前页数',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.addRow',
		desc : '新增一个行，',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.addCheckbox',
		desc : '添加单个checkbox到行中',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.removeCheckbox',
		desc : '移除一个checkbox',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getTitleCheckbox',
		desc : '取得表格标题的全选checkbox',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.setTitleCheckbox',
		desc : '设置一个自定义的全选checkbox',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.selectAll',
		desc : '全部选中checkbox',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.unselectAll',
		desc : '全部反选checkbox',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.toggleAll',
		desc : '当全选的checkbox存在时才可以切换全选和全反选',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getSelected',
		desc : '取得已经选中的数据，如果该行的row.data中设置id则返回所选中的id数组，否则返回该row的data',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getTitleBody',
		desc : '取得表格的table对象',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.add',
		desc : '使用传入config的方式添加ui组件到toolBar',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.addRaw',
		desc : '直接向toolbar中添加已经创建好的uiInstance',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.removeAll',
		desc : '删除所有ui控件',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.enableAll',
		desc : '激活toolbar中所有的item',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.disableAll',
		desc : '禁用toolbar中所有的item',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.getItemByName',
		desc : '通过name获取ui组件',
		shortcut : ''
	}, {
		name : 'T.ui.Carousel.setStateHandler',
		desc : '使用dom的形式为该节点增加事件',
		shortcut : ''
	}]
}, {
	name : 'T.ui.ColorPalette',
	desc : '复杂颜色拾取器',
	link : 'tangram',
	interfaces : []
}, {
	name : 'T.ui.ColorPicker',
	desc : '颜色拾取器',
	link : 'tangram',
	interfaces : []
}, {
	name : 'T.ui.Combox',
	desc : 'combox类',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.Combox.filter',
		desc : '过滤方法',
		shortcut : ''
	}, {
		name : 'T.ui.Combox.render',
		desc : '渲染控件',
		shortcut : ''
	}, {
		name : 'T.ui.Combox.getInput',
		desc : '获取input元素',
		shortcut : ''
	}, {
		name : 'T.ui.Combox.getArrow',
		desc : '获取下拉箭头元素',
		shortcut : ''
	}, {
		name : 'T.ui.Combox.chooseItem',
		desc : '响应条目被选择,并发出 onitemclick 事件',
		shortcut : ''
	}, {
		name : 'T.ui.Combox.setValue',
		desc : '设置input的值',
		shortcut : ''
	}, {
		name : 'T.ui.Combox.dispose',
		desc : '销毁Combox',
		shortcut : ''
	}]
}, {
	name : 'T.ui.DatePicker',
	desc : '创建一个日历对象绑定于一个input输入域',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.DatePicker.render',
		desc : '渲染日期组件到body中并绑定input',
		shortcut : ''
	}, {
		name : 'T.ui.DatePicker.pick',
		desc : '当点击某个日期时执行pick方法来向input写入日期',
		shortcut : ''
	}, {
		name : 'T.ui.DatePicker.show',
		desc : '显示日历',
		shortcut : ''
	}, {
		name : 'T.ui.DatePicker.hide',
		desc : '隐藏日历',
		shortcut : ''
	}, {
		name : 'T.ui.DatePicker.dispose',
		desc : '',
		shortcut : ''
	}]
}, {
	name : 'T.ui.Decorator',
	desc : '装饰器控件基类',
	link : 'tangram',
	interfaces : []
}, {
	name : 'T.ui.Dialog',
	desc : 'Dialog基类，建立一个dialog实例',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.Dialog.isShown',
		desc : '查询当前窗口是否处于显示状态',
		shortcut : ''
	}, {
		name : 'T.ui.Dialog.render',
		desc : '绘制dialog到页面',
		shortcut : ''
	}, {
		name : 'T.ui.Dialog.open',
		desc : '显示当前dialog',
		shortcut : ''
	}, {
		name : 'T.ui.Dialog.close',
		desc : '隐藏当前dialog',
		shortcut : ''
	}, {
		name : 'T.ui.Dialog.update',
		desc : '更新dialog状态',
		shortcut : ''
	}, {
		name : 'T.ui.Dialog.getTitle',
		desc : '获得title对应的dom元素',
		shortcut : ''
	}, {
		name : 'T.ui.Dialog.getTitleInner',
		desc : '获得title文字对应的dom元素',
		shortcut : ''
	}, {
		name : 'T.ui.Dialog.getContent',
		desc : '获得content对应的dom元素',
		shortcut : ''
	}, {
		name : 'T.ui.Dialog.getFooter',
		desc : '获得footer对应的dom元素',
		shortcut : ''
	}, {
		name : 'T.ui.Dialog.dispose',
		desc : '销毁dialog实例',
		shortcut : ''
	}]
}, {
	name : 'T.ui.Input',
	desc : 'Input基类，创建一个input实例。',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.Input.render',
		desc : '将input绘制到DOM树中。target参数不可省，否则无法渲染。',
		shortcut : ''
	}, {
		name : 'T.ui.Input.isDisabled',
		desc : '判断input是否处于失效状态。',
		shortcut : ''
	}, {
		name : 'T.ui.Input.getText',
		desc : '获得input文字。',
		shortcut : ''
	}, {
		name : 'T.ui.Input.enable',
		desc : '使input控件有效。',
		shortcut : ''
	}, {
		name : 'T.ui.Input.disable',
		desc : '使input控件失效。',
		shortcut : ''
	}, {
		name : 'T.ui.Input.dispose',
		desc : '销毁实例。',
		shortcut : ''
	}]
}, {
	name : 'T.ui.Login',
	desc : '应用实现 login 备注：涉及passport的API接口参数可以参见http://fe.baidu.com/doc/zhengxin/passport/openapi_help.text',
	link : 'tangram',
	interfaces : []
}, {
	name : 'T.ui.Menubar',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.Menubar.render',
		desc : '渲染menubar',
		shortcut : ''
	}, {
		name : 'T.ui.Menubar.itemClick',
		desc : '单个条目被点击时触发',
		shortcut : ''
	}, {
		name : 'T.ui.Menubar.getItemEventData',
		desc : '事件触发数据',
		shortcut : ''
	}, {
		name : 'T.ui.Menubar.itemMouseOver',
		desc : '单个条目mouseover的响应',
		shortcut : ''
	}, {
		name : 'T.ui.Menubar.itemMouseOut',
		desc : '单个条目mouseout的响应',
		shortcut : ''
	}, {
		name : 'T.ui.Menubar.update',
		desc : '更新menubar',
		shortcut : ''
	}, {
		name : 'T.ui.Menubar.getItemId',
		desc : '获取条目的元素id',
		shortcut : ''
	}, {
		name : 'T.ui.Menubar.getBranchId',
		desc : '获取子菜单容器id',
		shortcut : ''
	}, {
		name : 'T.ui.Menubar.getItem',
		desc : '获取指定索引值的页面元素',
		shortcut : ''
	}, {
		name : 'T.ui.Menubar.getItemData',
		desc : '获取条目数据',
		shortcut : ''
	}, {
		name : 'T.ui.Menubar.open',
		desc : '打开menubar',
		shortcut : ''
	}, {
		name : 'T.ui.Menubar.close',
		desc : '关闭menubar',
		shortcut : ''
	}, {
		name : 'T.ui.Menubar.dispose',
		desc : '销毁Menubar',
		shortcut : ''
	}, {
		name : 'T.ui.Menubar.getTarget',
		desc : '获取target元素',
		shortcut : ''
	}]
}, {
	name : 'T.ui.Modal',
	desc : '为控件增加遮罩。',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.Modal.getContainer',
		desc : '获取modal的Container',
		shortcut : ''
	}, {
		name : 'T.ui.Modal.render',
		desc : '渲染遮罩层',
		shortcut : ''
	}, {
		name : 'T.ui.Modal.show',
		desc : '显示遮罩层',
		shortcut : ''
	}, {
		name : 'T.ui.Modal.hide',
		desc : '隐藏遮罩层',
		shortcut : ''
	}, {
		name : 'T.ui.Modal.getWindowHandle',
		desc : 'window.resize & window.scroll 事件调用的function',
		shortcut : ''
	}, {
		name : 'T.ui.Modal.update',
		desc : '更新遮罩层',
		shortcut : ''
	}, {
		name : 'T.ui.Modal.dispose',
		desc : '销毁',
		shortcut : ''
	}]
}, {
	name : 'T.ui.Pager',
	desc : '生成分页功能，默认会有一个横向的页面跳转链接列表，其两端有首页，尾页，上一页，下一页。若要自定义样式（如隐藏某些部件），请使用css（注：控件中各部件的css类名都有控件的tangram类名前缀）首页：first，尾页：last，上一页：previous，下一页：next，当前页：current。若要自定义控件生成的HTML，请参考源代码中以tpl开头的模板属性，类中的属性和方法都可以通过options动态覆盖。',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.Pager.update',
		desc : '更新设置',
		shortcut : ''
	}, {
		name : 'T.ui.Pager.render',
		desc : '将控件渲染到目标元素',
		shortcut : ''
	}, {
		name : 'T.ui.Pager.dispose',
		desc : '销毁控件',
		shortcut : ''
	}]
}, {
	name : 'T.ui.Popup',
	desc : 'popup基类，建立一个popup实例',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.Popup.isShown',
		desc : '查询当前窗口是否处于显示状态',
		shortcut : ''
	}, {
		name : 'T.ui.Popup.open',
		desc : '显示当前popup',
		shortcut : ''
	}, {
		name : 'T.ui.Popup.close',
		desc : '隐藏当前popup',
		shortcut : ''
	}, {
		name : 'T.ui.Popup.update',
		desc : '更新popup状态',
		shortcut : ''
	}, {
		name : 'T.ui.Popup.dispose',
		desc : '销毁控件',
		shortcut : ''
	}]
}, {
	name : 'T.ui.ScrollBar',
	desc : '创建一个简单的滚动条',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.ScrollBar.render',
		desc : '将scrollBar的body渲染到用户给出的target',
		shortcut : ''
	}, {
		name : 'T.ui.ScrollBar.flushUI',
		desc : '更新组件的外观，通过传入的value来使滚动滑块滚动到指定的百分比位置，通过dimension来更新滑块所占整个内容的百分比宽度',
		shortcut : ''
	}, {
		name : 'T.ui.ScrollBar.scrollTo',
		desc : '滚动内容到参数指定的百分比位置',
		shortcut : ''
	}, {
		name : 'T.ui.ScrollBar.setVisible',
		desc : '设置滚动条的隐藏或显示',
		shortcut : ''
	}, {
		name : 'T.ui.ScrollBar.isVisible',
		desc : '取得当前是隐藏或是显示状态',
		shortcut : ''
	}, {
		name : 'T.ui.ScrollBar.getSize',
		desc : '取得滚动条的宽度和高度',
		shortcut : ''
	}, {
		name : 'T.ui.ScrollBar.update',
		desc : '更新滚动条的外观',
		shortcut : ''
	}, {
		name : 'T.ui.ScrollBar.dispose',
		desc : '销毁对象',
		shortcut : ''
	}]
}, {
	name : 'T.ui.ScrollPanel',
	desc : '创建一个panel来作为滚动条的容器',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.ScrollPanel.render',
		desc : '渲染ScrollPanel到页面中',
		shortcut : ''
	}, {
		name : 'T.ui.ScrollPanel.setVisible',
		desc : '设置滚动条的隐藏或是显示状态',
		shortcut : ''
	}, {
		name : 'T.ui.ScrollPanel.isVisible',
		desc : '取得滚动条的隐藏或显示状态',
		shortcut : ''
	}, {
		name : 'T.ui.ScrollPanel.getScrollBar',
		desc : '取得滚动条对象',
		shortcut : ''
	}, {
		name : 'T.ui.ScrollPanel.update',
		desc : '更新所有滚动条的外观',
		shortcut : ''
	}, {
		name : 'T.ui.ScrollPanel.getPanel',
		desc : '取得panel的dom节点',
		shortcut : ''
	}, {
		name : 'T.ui.ScrollPanel.getTarget',
		desc : '取得用户传入的目标对象',
		shortcut : ''
	}, {
		name : 'T.ui.ScrollPanel.getContainer',
		desc : '取得用户传入的container对象',
		shortcut : ''
	}, {
		name : 'T.ui.ScrollPanel.dispose',
		desc : '销毁对象',
		shortcut : ''
	}]
}, {
	name : 'T.ui.Slider',
	desc : '拖动条控件，可用作音乐播放进度。',
	link : 'tangram',
	interfaces : []
}, {
	name : 'T.ui.StarRate',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.StarRate.render',
		desc : '渲染控件',
		shortcut : ''
	}, {
		name : 'T.ui.StarRate.starAt',
		desc : '指定高亮几个星星',
		shortcut : ''
	}, {
		name : 'T.ui.StarRate.hoverAt',
		desc : '鼠标悬停指定高亮几个星星',
		shortcut : ''
	}, {
		name : 'T.ui.StarRate.clickAt',
		desc : '鼠标点击指定高亮几个星星',
		shortcut : ''
	}, {
		name : 'T.ui.StarRate.disable',
		desc : '值不可更改,即不响应鼠标事件',
		shortcut : ''
	}, {
		name : 'T.ui.StarRate.enable',
		desc : 'disable之后的恢复',
		shortcut : ''
	}, {
		name : 'T.ui.StarRate.dispose',
		desc : '销毁控件',
		shortcut : ''
	}]
}, {
	name : 'T.ui.Suggestion',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.Suggestion.render',
		desc : '将suggestion渲染到dom树中',
		shortcut : ''
	}, {
		name : 'T.ui.Suggestion.pick',
		desc : '把某个词放到input框中',
		shortcut : ''
	}, {
		name : 'T.ui.Suggestion.show',
		desc : '绘制suggestion',
		shortcut : ''
	}, {
		name : 'T.ui.Suggestion.hide',
		desc : '隐藏suggestion',
		shortcut : ''
	}, {
		name : 'T.ui.Suggestion.highLight',
		desc : '高亮某个条目',
		shortcut : ''
	}, {
		name : 'T.ui.Suggestion.clearHighLight',
		desc : '清除item高亮状态',
		shortcut : ''
	}, {
		name : 'T.ui.Suggestion.confirm',
		desc : 'confirm指定的条目',
		shortcut : ''
	}, {
		name : 'T.ui.Suggestion.getTargetValue',
		desc : '获得target的值',
		shortcut : ''
	}, {
		name : 'T.ui.Suggestion.getTarget',
		desc : '获得input框元素',
		shortcut : ''
	}, {
		name : 'T.ui.Suggestion.dispose',
		desc : '销毁suggesiton',
		shortcut : ''
	}]
}, {
	name : 'T.ui.Tab',
	desc : 'Tab标签组',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.Tab.insertItemHTML',
		desc : '插入item html',
		shortcut : ''
	}, {
		name : 'T.ui.Tab.dispose',
		desc : '销毁实例的析构',
		shortcut : ''
	}]
}, {
	name : 'T.ui.Table',
	desc : 'Table表格组件。',
	link : 'tangram',
	interfaces : []
}, {
	name : 'T.ui.Toolbar',
	desc : '',
	link : 'tangram',
	interfaces : []
}, {
	name : 'T.ui.Tooltip',
	desc : '弹出tip层,类似鼠标划过含title属性元素的效果',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.Tooltip.render',
		desc : '渲染Tooltip到HTML',
		shortcut : ''
	}, {
		name : 'T.ui.Tooltip.open',
		desc : '打开tooltip',
		shortcut : ''
	}, {
		name : 'T.ui.Tooltip.update',
		desc : '更新options',
		shortcut : ''
	}, {
		name : 'T.ui.Tooltip.close',
		desc : '关闭tooltip',
		shortcut : ''
	}, {
		name : 'T.ui.Tooltip.dispose',
		desc : '销毁控件',
		shortcut : ''
	}]
}, {
	name : 'T.ui.Tree',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.Tree.TreeNode',
		desc : '树节点类',
		shortcut : ''
	}, {
		name : 'T.ui.Tree.render',
		desc : '渲染树',
		shortcut : ''
	}, {
		name : 'T.ui.Tree.getTreeNodes',
		desc : '取得树的节点的集合map,treeNode的id与treeNode的键值对。',
		shortcut : ''
	}, {
		name : 'T.ui.Tree.getRootNode',
		desc : '取得树的最根节点',
		shortcut : ''
	}, {
		name : 'T.ui.Tree.getTreeNodeById',
		desc : '通过id属性来取得treeNode',
		shortcut : ''
	}, {
		name : 'T.ui.Tree.getCurrentNode',
		desc : '取得树的当前节点',
		shortcut : ''
	}, {
		name : 'T.ui.Tree.setCurrentNode',
		desc : '设置节点为树的当前节点',
		shortcut : ''
	}, {
		name : 'T.ui.Tree.dispose',
		desc : '销毁Tree对象',
		shortcut : ''
	}]
}, {
	name : 'T.ui.behavior',
	desc : '为各个控件增加装饰器。',
	link : 'tangram',
	interfaces : [{
		name : 'T.ui.behavior.coverable',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.behavior.decorator',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.behavior.draggable',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.behavior.droppable',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.behavior.posable',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.behavior.resizable',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.behavior.sortable',
		desc : '',
		shortcut : ''
	}, {
		name : 'T.ui.behavior.statable',
		desc : '',
		shortcut : ''
	}]
}, {
	name : 'T.ajax',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.ajax.form',
		desc : '将一个表单用ajax方式提交',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.ajax.get',
		desc : '发送一个get请求',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.ajax.post',
		desc : '发送一个post请求',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.ajax.request',
		desc : '发送一个ajax请求',
		meta : 'standard',
		shortcut : ''
	}]
}, {
	name : 'T.array',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.array.contains',
		desc : '判断一个数组中是否包含给定元素',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.array.each',
		desc : '遍历数组中所有元素',
		meta : 'standard',
		shortcut : 'each'
	}, {
		name : 'T.array.empty',
		desc : '清空一个数组',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.array.every',
		desc : '判断一个数组中是否所有元素都满足给定条件',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.array.filter',
		desc : '从数组中筛选符合条件的元素',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.array.find',
		desc : '从数组中寻找符合条件的第一个元素',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.array.hash',
		desc : '将两个数组参数合并成一个类似hashMap结构的对象，这个对象使用第一个数组做为key，使用第二个数组做为值，如果第二个参数未指定，则把对象的所有值置为true。',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.array.indexOf',
		desc : '查询数组中指定元素的索引位置',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.array.lastIndexOf',
		desc : '从后往前，查询数组中指定元素的索引位置',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.array.map',
		desc : '遍历数组中所有元素，将每一个元素应用方法进行转换，并返回转换后的新数组。',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.array.reduce',
		desc : '遍历数组中所有元素，将每一个元素应用方法进行合并，并返回合并后的结果。',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.array.remove',
		desc : '移除数组中的项',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.array.removeAt',
		desc : '移除数组中的项',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.array.some',
		desc : '判断一个数组中是否有部分元素满足给定条件',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.array.unique',
		desc : '过滤数组中的相同项。如果两个元素相同，会删除后一个元素。',
		meta : '',
		shortcut : ''
	}]
}, {
	name : 'T.async',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.async.get',
		desc : '支持异步的ajax.get封装.',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.async.post',
		desc : '支持异步的ajax.post封装.',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.async.when',
		desc : '保证onResolve或onReject可以按序执行. 若第一个参数为deferred,则deferred完成后执行.否则立即执行onResolve,并传入第一个参数.',
		meta : '',
		shortcut : ''
	}]
}, {
	name : 'T.browser',
	desc : '',
	link : 'tangram',
	interfaces : []
}, {
	name : 'T.cookie',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.cookie.get',
		desc : '获取cookie的值，用decodeURIComponent进行解码',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.cookie.getRaw',
		desc : '获取cookie的值，不对值进行解码',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.cookie.remove',
		desc : '删除cookie的值',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.cookie.set',
		desc : '设置cookie的值，用encodeURIComponent进行编码',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.cookie.setRaw',
		desc : '设置cookie的值，不对值进行编码',
		meta : 'standard',
		shortcut : ''
	}]
}, {
	name : 'T.date',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.date.format',
		desc : '对目标日期对象进行格式化',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.date.parse',
		desc : '将目标字符串转换成日期对象',
		meta : '',
		shortcut : ''
	}]
}, {
	name : 'T.dom',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.dom.addClass',
		desc : '为目标元素添加className',
		meta : 'standard',
		shortcut : 'addClass'
	}, {
		name : 'T.dom.children',
		desc : '获取目标元素的直接子元素列表',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.dom.contains',
		desc : '判断一个元素是否包含另一个元素',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.dom.create',
		desc : '创建 Element 对象。',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.dom.ddManager',
		desc : '拖曳管理器',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.drag',
		desc : '拖动指定的DOM元素',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.draggable',
		desc : '让一个DOM元素可拖拽',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.droppable',
		desc : '让一个DOM元素可以容纳被拖拽的DOM元素',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.empty',
		desc : '删除一个节点下面的所有子节点。',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.first',
		desc : '获取目标元素的第一个元素节点',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.dom.fixable',
		desc : '使目标元素拥有可进行与页面可见区域相对位置保持不变的移动的能力',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.g',
		desc : '从文档中获取指定的DOM元素',
		meta : 'standard',
		shortcut : 'g,T.G'
	}, {
		name : 'T.dom.getAncestorBy',
		desc : '获取目标元素符合条件的最近的祖先元素',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.getAncestorByClass',
		desc : '获取目标元素指定元素className最近的祖先元素',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.getAncestorByTag',
		desc : '获取目标元素指定标签的最近的祖先元素',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.getAttr',
		desc : '获取目标元素的属性值',
		meta : 'standard',
		shortcut : 'getAttr'
	}, {
		name : 'T.dom.getComputedStyle',
		desc : '获取目标元素的computed style值。如果元素的样式值不能被浏览器计算，则会返回空字符串（IE）',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.getDocument',
		desc : '获取目标元素所属的document对象',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.dom.getParent',
		desc : '获得元素的父节点',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.getPosition',
		desc : '获取目标元素相对于整个文档左上角的位置',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.dom.getStyle',
		desc : '获取目标元素的样式值',
		meta : 'standard',
		shortcut : 'getStyle'
	}, {
		name : 'T.dom.getText',
		desc : '获得元素中的文本内容。',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.getWindow',
		desc : '获取目标元素所属的window对象',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.hasAttr',
		desc : '查询一个元素是否包含指定的属性',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.hasClass',
		desc : '判断元素是否拥有指定的className',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.dom.hide',
		desc : '隐藏目标元素',
		meta : 'standard',
		shortcut : 'hide'
	}, {
		name : 'T.dom.insertAfter',
		desc : '将目标元素添加到基准元素之后',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.dom.insertBefore',
		desc : '将目标元素添加到基准元素之前',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.dom.insertHTML',
		desc : '在目标元素的指定位置插入HTML代码',
		meta : 'standard',
		shortcut : 'insertHTML'
	}, {
		name : 'T.dom.intersect',
		desc : '检查两个元素是否相交',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.last',
		desc : '获取目标元素的最后一个元素节点',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.next',
		desc : '获取目标元素的下一个兄弟元素节点',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.dom.prev',
		desc : '获取目标元素的上一个兄弟元素节点',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.q',
		desc : '通过className获取元素',
		meta : 'standard',
		shortcut : 'q,T.Q'
	}, {
		name : 'T.dom.query',
		desc : '提供css选择器功能   选择器支持所有的<a href="http://www.w3.org/TR/css3-selectors/">css3选择器</a> ，核心实现采用sizzle。T.dom.query.matches 请参考<a href="http://wiki.github.com/jeresig/sizzle/" target="_blank">sizzle 文档</a>',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.ready',
		desc : '使函数在页面dom节点加载完毕时调用',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.dom.remove',
		desc : '从DOM树上移除目标元素',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.dom.removeClass',
		desc : '移除目标元素的className',
		meta : 'standard',
		shortcut : 'removeClass'
	}, {
		name : 'T.dom.removeStyle',
		desc : '删除元素的某个样式',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.resizable',
		desc : '绘制可以根据鼠标行为改变HTMLElement大小的resize handle',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.setAttr',
		desc : '设置目标元素的attribute值',
		meta : 'standard',
		shortcut : 'setAttr'
	}, {
		name : 'T.dom.setAttrs',
		desc : '批量设置目标元素的attribute值',
		meta : 'standard',
		shortcut : 'setAttrs'
	}, {
		name : 'T.dom.setBorderBoxHeight',
		desc : '按照border-box模型设置元素的height值',
		meta : '',
		shortcut : 'dom.setOuterHeight'
	}, {
		name : 'T.dom.setBorderBoxSize',
		desc : '按照border-box模型设置元素的height和width值。只支持元素的padding/border/height/width使用同一种计量单位的情况。<br/> 不支持：<br/> 1. 非数字值(medium)<br/> 2. em/px在不同的属性中混用',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.setBorderBoxWidth',
		desc : '按照border-box模型设置元素的width值',
		meta : '',
		shortcut : 'dom.setOuterWidth'
	}, {
		name : 'T.dom.setPosition',
		desc : '设置目标元素的top和left值到用户指定的位置',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.dom.setStyle',
		desc : '设置目标元素的style样式值',
		meta : 'standard',
		shortcut : 'setStyle'
	}, {
		name : 'T.dom.setStyles',
		desc : '批量设置目标元素的style样式值',
		meta : 'standard',
		shortcut : 'setStyles'
	}, {
		name : 'T.dom.show',
		desc : '显示目标元素，即将目标元素的display属性还原成默认值。默认值可能在stylesheet中定义，或者是继承了浏览器的默认样式值',
		meta : 'standard',
		shortcut : 'show'
	}, {
		name : 'T.dom.toggle',
		desc : '改变目标元素的显示/隐藏状态',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.dom.toggleClass',
		desc : '添加或者删除一个节点中的指定class，如果已经有就删除，否则添加',
		meta : '',
		shortcut : ''
	}]
}, {
	name : 'T.element',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.element.each',
		desc : '以每一个匹配的元素作为上下文执行传递进来的函数，方便用户自行遍历dom。',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.element.events',
		desc : '方法提供了事件绑定的快捷方式，事件发生时会触发传递进来的函数。events代指事件方法的总和。',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.element.extend',
		desc : '为element对象扩展一个方法。',
		meta : '',
		shortcut : 'e'
	}]
}, {
	name : 'T.event',
	desc : '键盘事件的键值',
	link : 'tangram',
	interfaces : [{
		name : 'T.event.EventArg',
		desc : '事件对象构造器，屏蔽浏览器差异的事件类',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.event.fire',
		desc : '触发已经注册的事件。注：在ie下不支持load和unload事件',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.event.get',
		desc : '获取扩展的EventArg对象',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.event.getKeyCode',
		desc : '获取键盘事件的键值',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.event.getPageX',
		desc : '获取鼠标事件的鼠标x坐标',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.event.getPageY',
		desc : '获取鼠标事件的鼠标y坐标',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.event.getTarget',
		desc : '获取事件的触发元素',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.event.on',
		desc : '为目标元素添加事件监听器',
		meta : 'standard',
		shortcut : 'on'
	}, {
		name : 'T.event.once',
		desc : '为目标元素添加一次事件绑定',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.event.preventDefault',
		desc : '阻止事件的默认行为',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.event.stop',
		desc : '停止事件',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.event.stopPropagation',
		desc : '阻止事件传播',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.event.un',
		desc : '为目标元素移除事件监听器',
		meta : 'standard',
		shortcut : 'un'
	}]
}, {
	name : 'T.fn',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.fn.abstractMethod',
		desc : '定义一个抽象方法',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.fn.bind',
		desc : '为对象绑定方法和作用域',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.fn.blank',
		desc : '这是一个空函数，用于需要排除函数作用域链干扰的情况.',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.fn.methodize',
		desc : '将一个静态函数变换成一个对象的方法，使其的第一个参数为this，或this[attr]',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.fn.multize',
		desc : '对函数进行集化，使其在第一个参数为array时，结果也返回一个数组',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.fn.wrapReturnValue',
		desc : '包装函数的返回值，使其在能按照index指定的方式返回。<br/>如果其值为-1，直接返回返回值。 <br/>如果其值为0，返回"返回值"的包装结果。<br/> 如果其值大于0，返回第i个位置的参数的包装结果（从1开始计数）',
		meta : '',
		shortcut : ''
	}]
}, {
	name : 'T.json',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.json.decode',
		desc : '将字符串解析成json对象，为过时接口，今后会被T.json.parse代替',
		meta : 'out',
		shortcut : ''
	}, {
		name : 'T.json.encode',
		desc : '将json对象序列化，为过时接口，今后会被T.json.stringify代替',
		meta : 'out',
		shortcut : ''
	}, {
		name : 'T.json.parse',
		desc : '将字符串解析成json对象。注：不会自动祛除空格',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.json.stringify',
		desc : '将json对象序列化',
		meta : 'standard',
		shortcut : ''
	}]
}, {
	name : 'T.lang',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.lang.createClass',
		desc : '创建一个类，包括创造类的构造器、继承基类Class',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.lang.createSingle',
		desc : '创建一个T.lang.Class的单例实例',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.lang.decontrol',
		desc : '解除instance中对指定类实例的引用关系。',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.lang.getModule',
		desc : '根据变量名或者命名空间来查找对象',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.lang.guid',
		desc : '返回一个当前页面的唯一标识字符串。',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.lang.inherits',
		desc : '为类型构造器建立继承关系',
		meta : 'standard',
		shortcut : 'inherits'
	}, {
		name : 'T.lang.instance',
		desc : '根据参数(guid)的指定，返回对应的实例对象引用',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.lang.isArray',
		desc : '判断目标参数是否Array对象',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.lang.isBoolean',
		desc : '判断目标参数是否Boolean对象',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.lang.isDate',
		desc : '判断目标参数是否为Date对象',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.lang.isElement',
		desc : '判断目标参数是否为Element对象',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.lang.isFunction',
		desc : '判断目标参数是否为function或Function实例',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.lang.isNumber',
		desc : '判断目标参数是否number类型或Number对象',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.lang.isObject',
		desc : '判断目标参数是否为Object对象',
		meta : 'standard',
		shortcut : 'isObject'
	}, {
		name : 'T.lang.isString',
		desc : '判断目标参数是否string类型或String对象',
		meta : 'standard',
		shortcut : 'isString'
	}, {
		name : 'T.lang.module',
		desc : '增加自定义模块扩展,默认创建在当前作用域',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.lang.toArray',
		desc : '将一个变量转换成array',
		meta : 'standard',
		shortcut : ''
	}]
}, {
	name : 'T.number',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.number.comma',
		desc : '为目标数字添加逗号分隔',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.number.pad',
		desc : '对目标数字进行0补齐处理',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.number.randomInt',
		desc : '生成随机整数，范围是[min, max]',
		meta : '',
		shortcut : ''
	}]
}, {
	name : 'T.object',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.object.clone',
		desc : '对一个object进行深度拷贝',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.object.each',
		desc : '遍历Object中所有元素，1.1.1增加',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.object.extend',
		desc : '将源对象的所有属性拷贝到目标对象中',
		meta : 'standard',
		shortcut : 'extend'
	}, {
		name : 'T.object.isEmpty',
		desc : '检测一个对象是否是空的.需要注意的是：如果污染了Object.prototype或者Array.prototype，那么T.object.isEmpty({})或者T.object.isEmpty([])可能返回的就是false.',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.object.isPlain',
		desc : '判断一个对象是不是字面量对象，即判断这个对象是不是由{}或者new Object类似方式创建',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.object.keys',
		desc : '获取目标对象的键名列表',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.object.map',
		desc : '遍历object中所有元素，将每一个元素应用方法进行转换，返回转换后的新object。',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.object.merge',
		desc : '合并源对象的属性到目标对象。',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.object.values',
		desc : '获取目标对象的值列表',
		meta : '',
		shortcut : ''
	}]
}, {
	name : 'T.page',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.page.createStyleSheet',
		desc : '在页面中创建样式表对象',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.page.getHeight',
		desc : '获取页面高度',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.page.getMousePosition',
		desc : '获得页面里的目前鼠标所在的坐标',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.page.getScrollLeft',
		desc : '获取横向滚动量',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.page.getScrollTop',
		desc : '获取纵向滚动量',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.page.getViewHeight',
		desc : '获取页面视觉区域高度',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.page.getViewWidth',
		desc : '获取页面视觉区域宽度',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.page.getWidth',
		desc : '获取页面宽度',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.page.lazyLoadImage',
		desc : '延迟加载图片. 默认只加载可见高度以上的图片, 随着窗口滚动加载剩余图片.注意: 仅支持垂直方向.',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.page.load',
		desc : '加载一组资源，支持多种格式资源的串/并行加载，支持每个文件有单独回调函数。',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.page.loadCssFile',
		desc : '动态在页面上加载一个外部css文件',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.page.loadJsFile',
		desc : '动态在页面上加载一个外部js文件',
		meta : '',
		shortcut : ''
	}]
}, {
	name : 'T.platform',
	desc : '',
	link : 'tangram',
	interfaces : []
}, {
	name : 'T.sio',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.sio.callByBrowser',
		desc : '通过script标签加载数据，加载完成由浏览器端触发回调',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.sio.callByServer',
		desc : '通过script标签加载数据，加载完成由服务器端触发回调',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.sio.log',
		desc : '通过请求一个图片的方式令服务器存储一条日志author: int08h,leeight',
		meta : '',
		shortcut : ''
	}]
}, {
	name : 'T.string',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.string.decodeHTML',
		desc : '对目标字符串进行html解码',
		meta : 'standard',
		shortcut : 'decodeHTML'
	}, {
		name : 'T.string.encodeHTML',
		desc : '对目标字符串进行html编码',
		meta : 'standard',
		shortcut : 'encodeHTML'
	}, {
		name : 'T.string.escapeReg',
		desc : '将目标字符串中可能会影响正则表达式构造的字符串进行转义。',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.string.filterFormat',
		desc : '对目标字符串进行格式化,支持过滤',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.string.format',
		desc : '对目标字符串进行格式化',
		meta : 'standard',
		shortcut : 'format'
	}, {
		name : 'T.string.formatColor',
		desc : '将各种浏览器里的颜色值转换成 #RRGGBB 的格式',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.string.getByteLength',
		desc : '获取目标字符串在gbk编码下的字节长度',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.string.stripTags',
		desc : '去掉字符串中的html标签',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.string.subByte',
		desc : '对目标字符串按gbk编码截取字节长度',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.string.toCamelCase',
		desc : '将目标字符串进行驼峰化处理',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.string.toHalfWidth',
		desc : '将目标字符串中常见全角字符转换成半角字符',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.string.trim',
		desc : '删除目标字符串两端的空白字符',
		meta : 'standard',
		shortcut : 'trim'
	}, {
		name : 'T.string.wbr',
		desc : '为目标字符串添加wbr软换行',
		meta : '',
		shortcut : ''
	}]
}, {
	name : 'T.swf',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.swf.Proxy',
		desc : 'Js 调用 Flash方法的代理类.',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.swf.create',
		desc : '在页面中创建一个flash对象',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.swf.createHTML',
		desc : '创建flash对象的html字符串',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.swf.getMovie',
		desc : '获得flash对象的实例',
		meta : 'standard',
		shortcut : ''
	}]
}, {
	name : 'T.url',
	desc : '',
	link : 'tangram',
	interfaces : [{
		name : 'T.url.escapeSymbol',
		desc : '对字符串进行%&+/#=和空格七个字符进行url转义',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.url.getQueryValue',
		desc : '根据参数名从目标URL中获取参数值',
		meta : 'standard',
		shortcut : ''
	}, {
		name : 'T.url.jsonToQuery',
		desc : '将json对象解析成query字符串',
		meta : '',
		shortcut : ''
	}, {
		name : 'T.url.queryToJson',
		desc : '解析目标URL中的参数成json对象',
		meta : '',
		shortcut : ''
	}]
}, {
	name : 'T.form',
	desc : '',
	link : 'tangram',
	interfaces : []
}]