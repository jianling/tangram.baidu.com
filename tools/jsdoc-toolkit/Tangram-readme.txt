运行命令:
#java -jar jsrun.jar app/run.js -a -t=templates/tangram -d=../../www/js mycode/empty.js //生成两个大文件(固定格式不要更改任何参数)
#java -jar jsrun.jar app/run.js -a -t=templates/tangram -d=../../www/js mycode/tangram-base.js //生成base
#java -jar jsrun.jar app/run.js -a -t=templates/tangram -d=../../www/js mycode/tangram-component.js //生成component
#java -jar jsrun.jar app/run.js -a -t=templates/tangram -d=../../www/js mycode/tangram-base-mobile.js //生成mobile


说明：-d=是输出目录，mycdoe/tangram-base.js是需要被解析的js文件，程序会根据文件名中带有mobile或是base或是component等字样来判别该次生成是base或是component