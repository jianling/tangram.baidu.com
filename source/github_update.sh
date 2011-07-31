#!/bin/bash

#和github有关的变量
rootPath=$(pwd)
basePath=$rootPath"/github" #根目录
masterPath=$basePath"/master" #存放tangram master版本的目录
dev02Path=$basePath"/dev-0.2" #存放tangram dev-0.2版本的目录
mobilePath=$basePath"/mobile" #存放tangram mobile版本的目录

#和文件复制有关的变量
copyFilePath=$rootPath"/../src/js" #文件复制的目录
fragmentFolder="fragment" #存放碎片文件夹的名称
downloadFolder="download" #存放供用户下载的大文件的目录

#和md5生成文件有关的变量
md5Path=$rootPath

#根据一个目录是否是git目录来运算出git是clone还是pull
function getGitType(){
	gitFolder="clone"
	[ -d $1 ] && [ -d $1"/.git" ] && gitFolder="pull"
}

function githubUpdate(){
	if [ ! -d $basePath ]; then
		mkdir $basePath
		[ ! -d $masterPath ] && mkdir $masterPath
		[ ! -d $dev02Path ] && mkdir $dev02Path
		[ ! -d $mobilePath ] && mkdir $mobilePath
	fi
	cd $masterPath
	getGitType $masterPath"Tangram-base"
	if [ "$gitFolder" == "clone" ]; then
		git clone http://github.com/BaiduFE/Tangram-base.git
	else
		git pull http://github.com/BaiduFE/Tangram-base.git master master
	fi
	getGitType $masterPath"Tangram-component"
	if [ "$gitFolder" == "clone" ]; then
		git clone http://github.com/BaiduFE/Tangram-component.git
	else
		git pull http://github.com/BaiduFE/Tangram-component.git master master
	fi
	cd -
	echo "----------tangram master complete----------"
	cd $dev02Path
	getGitType $dev02Path"Tangram-component"
	if [ "$gitFolder" == "clone" ]; then
		git clone -b 0.2 http://github.com/BaiduFE/Tangram-component.git
	else
		git pull http://github.com/BaiduFE/Tangram-component.git 0.2 0.2
	fi
	echo "----------tangram 0.2 complete----------"
}

function getVersion(){
	cd $masterPath"/Tangram-base/release"
	tangramVersion=$(grep "\{version:\"[0-9\.]*\"\}" all_release.js -o|grep -o "[0-9\.]*")
	cd -
}

function createMD5(){
	cd $masterPath"/Tangram-base/release"
	fileName=("all_release.js" "all_release_src.js" "core_release.js" "core_release_src.js")
#tangramMD5[0]=$(md5sum all_release.js|awk '{print $1}')
#	tangramMD5[1]=$(md5sum all_release_src.js|awk '{print $1}')

#tangramMD5[2]=$(md5sum core_release.js|awk '{print $1}')
#	tangramMD5[3]=$(md5sum core_release_src.js|awk '{print $1}')
	getVersion
	echo "version="$tangramVersion";">$md5Path"/md5.properties"
	for item in ${fileName[*]}; do
		echo ${item}"="$(md5sum $item|awk '{print $1}')","$(du -b $item|awk '{print $1}')";">>$md5Path"/md5.properties"
	done
}


function copyFiles(){
	#复制碎片文件
	cd $copyFilePath
	[ -d "${fragmentFolder}" ] && rm -rf $fragmentFolder
	cp -rf $basePath $fragmentFolder
	#复制大文件
	getVersion
	[ -d "${downloadFolder}" ] && rm -rf $downloadFolder
	mkdir $downloadFolder
	cp $masterPath"/Tangram-base/release/all_release.js" $downloadFolder"/tangram-"$tangramVersion".js"
	cp $masterPath"/Tangram-base/release/all_release_src.js" $downloadFolder"/tangram-"$tangramVersion".source.js"
	cp $masterPath"/Tangram-base/release/core_release_src.js" $downloadFolder"/tangram-"$tangramVersion".core.source.js"
	cp $masterPath"/Tangram-base/release/core_release.js" $downloadFolder"/tangram-"$tangramVersion".core.js"
	cp $masterPath"/Tangram-base/release/tangram_all.js" $downloadFolder"/tangram-all.js"
	cd -
}

[ ! -n "$1" ] && githubUpdate
cd $masterPath"/Tangram-base/release"
ant -f build_release.xml  release-all > /dev/null
cd -
copyFiles
createMD5
echo "----------All done----------"
exit
