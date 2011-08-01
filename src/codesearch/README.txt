关于源文件路径修改：
打开MergeSource.php
define("MY_DIR", realpath("tangram-code/"));//修改源文件地址
define("REC_DIR", realpath("../rec"));//修改一些对应的资源文件地址，如flash等

[code.php]

作用：根据请求的POST/GET参数，输出（1）高亮后的HTML代码展现的源代码（2）导出资源文件以压缩模式或者源码模式（3）为导出资源模式添加资源文件

参数：所有参数在php中均以 $_REQUEST["参数名"]的方式获得。

版本号			version		必须，以此值确定选择包的实际文件路径；例如：version=Tangram-Base(Tangram-Base需要保持和服务器的文件夹名称一致)
钩选组件			src			必须，以此值确定选择的包；例如：src=///import baidu.ajax.get;///import baidu.dom.g

查看源码模式		viewSource  可选，若此值为0或者未设置，则code.php输出一个文件，而不是一个HTML页
压缩模式			compress	可选，选择压缩模式，仅当viewSource为0或者未设值时启用，决定导出代码的压缩模式，目前可选值为：yui、source

资源包模式		isResource  可选，若选择此项，则覆盖viewSouce的设置为0，为导出文件模式，并且将所有代码中 ///reousrce 目标 中指向的资源文件 与源代码 一起合并打包为一个zip包


不含BASE代码		nobase		可选，若此参数有值，则输出的代码将不包含属于BASE部分的。一般在component版本 的代码中允许启用
不含UIBASE代码	nouibase    可选，若此参数 有值，则输出的代码将不包含属于UIBASE部分的。一般在component版本 的代码中允许启用
