github_update.sh说明
1.当存在第一参数为nogithub时，表示不需要从github上更新，
2.当用github更新时会在当前目录新建github目录，并在该github目录下生成三个文件夹分别是master, dev-0.2, mobile
3.该脚本的主要功能是完成以下些事情：
	<a 从github上拿碎片文件
	<b 执行QA的release生成大文件
	<c 拷背碎片文件到www/js/fragment目录下给codesearch使用
	<d 生成版本号和md5和文件大小的文件md5.properties放在和github同级的目录下