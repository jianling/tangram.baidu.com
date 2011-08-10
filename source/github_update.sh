#!/bin/bash

#和github有关的变量
rootPath=$(pwd)
basePath=$rootPath"/github" #根目录

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
	[ ! -d $basePath ] && mkdir $basePath
	cd $basePath
	getGitType "Tangram-base"
	if [ "$gitFolder" == "clone" ]; then
		git clone http://github.com/BaiduFE/Tangram-base.git
	else
		cd "Tangram-base"
		git pull http://github.com/BaiduFE/Tangram-base.git master master
	fi
	echo "----------tangram base complete----------"
	cd $basePath
    getGitType "Tangram-component"
	if [ "$gitFolder" == "clone" ]; then
		git clone http://github.com/BaiduFE/Tangram-component.git
	else
		cd "Tangram-component"
		git pull http://github.com/BaiduFE/Tangram-component.git master master
	fi
	echo "----------tangram component complete----------"
	cd $basePath
    getGitType "Tangram-component-dev0.2"
	if [ "$gitFolder" == "clone" ]; then
		git clone -b 0.2 http://github.com/BaiduFE/Tangram-component.git Tangram-component-dev0.2
	else
		cd "Tangram-component-dev0.2"
		git pull http://github.com/BaiduFE/Tangram-component.git 0.2 0.2
	fi
	echo "----------tangram component dev0.2 complete----------"
	#mobile start
}

function getVersion(){
	cd $basePath"/Tangram-base/release"
	tangramVersion=$(grep "\{version:\"[0-9\.]*\"\}" all_release.js -o|grep -o "[0-9\.]*")
	cd -
}

function createMD5(){
	cd $basePath"/Tangram-base/release"
	fileName=("all_release.js" "all_release_src.js" "core_release.js" "core_release_src.js")
	echo "version="$tangramVersion";">$md5Path"/md5.properties"
	for item in ${fileName[*]}; do
		gzip -c $item>$item".gz"
		echo ${item}"="$(md5sum $item|awk '{print $1}')","$(du -b $item|awk '{print $1}')","$(du -b $item".gz"|awk '{print $1}')";">>$md5Path"/md5.properties"
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
	cp $basePath"/Tangram-base/release/all_release.js" $downloadFolder"/tangram-"$tangramVersion".js"
	cp $basePath"/Tangram-base/release/all_release_src.js" $downloadFolder"/tangram-"$tangramVersion".source.js"
	cp $basePath"/Tangram-base/release/core_release_src.js" $downloadFolder"/tangram-"$tangramVersion".core.source.js"
	cp $basePath"/Tangram-base/release/core_release.js" $downloadFolder"/tangram-"$tangramVersion".core.js"
	cp $basePath"/Tangram-base/release/tangram_all.js" $downloadFolder"/tangram-all.js"
	cp $basePath"/Tangram-base/release/all_release.js" $downloadFolder"/tangram.js"
	cd -
}

[ ! -n "$1" ] && githubUpdate
cd $basePath"/Tangram-base/release"
ant -f build_release.xml  release-all > /dev/null
cd -
copyFiles
createMD5
echo "----------All done----------"
exit
