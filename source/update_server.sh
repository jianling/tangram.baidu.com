#!/bin/bash
###############配置#####################
remotebasepath=/home/g/public_html/doc/source/
#此值默认为当前脚本所在目录,如果设置了localbasepath的值，则使用设定值。
#localbasepath=~/docsearch/ 
#是否将代码发送到fe机器上 0不发|1发。不设置则自动判断,脚本在本地就发
###############配置结束###################
#export http_proxy=210.101.131.234:8080
#export http_proxy=175.119.245.38:8080
#if [ ! -n "http_proxy" ];then 
    #export http_proxy=211.43.158.194:8080
    #export http_proxy=118.97.81.155:8080
#fi
#export http_proxy=172.19.1.2:9218
#export http_proxy=69.10.43.242:80
#export http_proxy=119.161.238.90:80
export http_proxy=''
######设置变量###########
rawpath=`pwd`
basepath=$rawpath"/"

if [ ! -d "${basepath}src" ] ;then
    mkdir  ${basepath}src
fi
######设置变量结束###########

##############封装函数#################

#判断是在本地运行此脚本还是在FE机器上运行此脚本
isLocal ()
{
    hostname="`hostname --fqdn`"
    if [ ${hostname}x = 'db-ts-test02.vm.baidu.com'x ]; then
        bIsLocal=0
        basepath=$remotebasepath
        sendToFeMachine=0 #不发送代码到fe机器上
    else
        bIsLocal=1
        if [ -n "$localbasepath" ]; then
            basepath=$localbasepath
        fi
        sendToFeMachine=1 #发送代码到fe机器上
    fi
    githubDataBasePath=$basepath"github/"
    if [ -n "$send" ];then
        sendToFeMachine=$send
    fi
}

#判断目录是不是包含git版本控制的目录

isGit ()
{
    if [ -n "$1" ];then
        if [ -d $1".git" ];then
            bIsGit=1
        else
            bIsGit=0
        fi
    else
        bIsGit=0
    fi
}

#将生成的代码发送到fe机器上

copyDataToRemote ()
{
cd $basepath
tar -cvf  tangramgit.tar ./*
smbclient  //db-ts-test02.vm.baidu.com/g  -U g -N -c "cd dev\;cd source\;put tangramgit.tar tangramgit.tar;"
rm tangramgit.tar
}

##############
#update stable
##############
updateMaster ()
{   
    cd $basepath
    if [ ! -d "$githubDataBasePath" ] ;then
        mkdir $githubDataBasePath
    fi
    stablepath=${githubDataBasePath}"stable/"
    
    if [ ! -d "$stablepath" ] ;then
        mkdir $stablepath
    fi

    cd $stablepath

    #update stable base
    stableBasePath=${stablepath}"Tangram-base/"
    isGit "${stableBasePath}/"
    #如果目标目录的代码不含有git信息，则从github上拉源代码，否则直接更新
    if [ $bIsGit -eq 0 ] ;then
        echo "${stableBasePath}/.git not exists  dir.Now clone a new source."
        if [ -d "$stableBasePath" ] ;then
            mv ${stableBasePath} ${stableBasePath}"-bak"
        fi
        git clone http://github.com/BaiduFE/Tangram-base.git 
        cd ${stableBasePath}
    else
        cd ${stableBasePath}
        git pull http://github.com/BaiduFE/Tangram-base.git master
    fi

    #将源代码拷到codesearch目录
    if [ -d "${basepath}src/tangram_stable" ] ;then
        rm -rf ${basepath}src/tangram_stable
    fi

    cp -rf ${stableBasePath}src ${basepath}src/tangram_stable
    echo "#############base master 处理完毕###############"

    cd $stablepath

    #update stable component
    stableComponentPath=${stablepath}"Tangram-component"
    isGit "${stableComponentPath}/"
    #如果目标目录的代码不含有git信息，则从github上拉源代码，否则直接更新
    if [ $bIsGit -eq 0 ] ;then
        echo "${stableComponentPath}/.git not exists  dir.Now clone a new source."
        if [ -d "$stableComponentPath" ] ;then
            mv ${stableComponentPath} ${stableComponentPath}"-bak"
        fi
        git clone http://github.com/BaiduFE/Tangram-component.git 
        cd Tangram-component
    else
        cd ${stableComponentPath}
		git pull http://github.com/BaiduFE/Tangram-component.git master
        #git checkout -f
        #git pull
    fi
    
    #将源代码拷到codesearch目录

    if [ -d "${basepath}src/tangram-component_stable" ] ;then
        rm -rf ${basepath}src/tangram-component_stable
    fi

    cp -rf src ${basepath}src/tangram-component_stable
    cp -rf ${stableBasePath}/src/* ${basepath}src/tangram-component_stable/
    echo "#############component master 处理完毕###############"
}

###############
#update nightly
###############
updateDev ()
{
    cd $basepath
    if [ ! -d "$githubDataBasePath" ] ;then
        mkdir $githubDataBasePath
    fi

    nightlypath=${githubDataBasePath}"nightly/"
    
    if [ ! -d "$nightlypath" ] ;then
        mkdir $nightlypath
    fi

    cd $nightlypath

    #update nightly base
    nightlyBasePath=${nightlypath}"Tangram-base"
    isGit "${nightlyBasePath}/"
    #如果目标目录的代码不含有git信息，则从github上拉源代码，否则直接更新
    if [ $bIsGit -eq 0 ] ;then
        echo "${nightlyBasePath}/.git not exists  dir.Now clone a new source."
        if [ -d "$nightlyBasePath" ] ;then
            mv ${nightlyBasePath} ${nightlyBasePath}"-bak"
        fi
        git clone -b dev http://github.com/BaiduFE/Tangram-base.git 
        cd Tangram-base
    else
        cd ${nightlyBasePath}
        git checkout -f
        git pull http://github.com/BaiduFE/Tangram-base.git dev
    fi
    

    #将源代码拷到codesearch目录
    if [ -d "${basepath}src/tangram_nightly" ] ;then
        rm -rf ${basepath}src/tangram_nightly
    fi
    cp -rf src ${basepath}src/tangram_nightly
    echo "#############base dev 处理完毕###############"

    cd $nightlypath

    #update nightly component
    nightlyComponentPath=${nightlypath}"Tangram-component"
    isGit "${nightlyComponentPath}/"
    #如果目标目录的代码不含有git信息，则从github上拉源代码，否则直接更新
    if [ $bIsGit -eq 0 ] ;then
        echo "${nightlyComponentPath}/.git not exists  dir.Now clone a new source."
        if [ -d "$nightlyComponentPath" ] ;then
            mv ${nightlyComponentPath} ${nightlyComponentPath}"-bak"
        fi
        git clone -b dev http://github.com/BaiduFE/Tangram-component.git 
        cd Tangram-component
    else
        cd ${nightlyComponentPath}
        git checkout -f
        git pull http://github.com/BaiduFE/Tangram-component.git dev
    fi
    

    #将源代码拷到codesearch目录

    if [ -d "${basepath}src/tangram-component_nightly" ] ;then
        rm -rf ${basepath}src/tangram-component_nightly
    fi

    cp -rf src ${basepath}src/tangram-component_nightly
    cp -rf ${nightlyBasePath}/src/* ${basepath}src/tangram-component_nightly/
    echo "#############component dev 处理完毕###############"
}

#####################
#update 0.2
#base dev
#component 0.2
#####################
updateDev2 ()
{
    cd $basepath
    if [ ! -d "$githubDataBasePath" ] ;then
        mkdir $githubDataBasePath
    fi

    dev02path=${githubDataBasePath}"dev-0.2/"
    
    if [ ! -d "$dev02path" ] ;then
        mkdir $dev02path
    fi

    cd $dev02path

    #update dev-.2 component
    dev02ComponentPath=${dev02path}"Tangram-component"
    isGit "${dev02ComponentPath}/"
    #如果目标目录的代码不含有git信息，则从github上拉源代码，否则直接更新
    if [ $bIsGit -eq 0 ] ;then
        echo "${dev02ComponentPath}/.git not exists  dir.Now clone a new source."
        if [ -d "$dev02ComponentPath" ] ;then
            mv ${dev02ComponentPath} ${dev02ComponentPath}"-bak"
        fi
        git clone -b 0.2 http://github.com/BaiduFE/Tangram-component.git Tangram-component
        cd Tangram-component
    else
        cd ${dev02ComponentPath}
        git checkout -f
        git pull http://github.com/BaiduFE/Tangram-component.git 0.2
    fi
    

    #将源代码拷到codesearch目录

    if [ -d "${basepath}src/tangram-component_dev-0.2" ] ;then
        rm -rf ${basepath}src/tangram-component_dev-0.2
    fi

    cp -rf src ${basepath}src/tangram-component_dev-0.2
    stablepath=${githubDataBasePath}"stable/"
    stableBasePath=${stablepath}"Tangram-base/"
    cp -rf ${stableBasePath}src/* ${basepath}src/tangram-component_dev-0.2/
    echo "#############component dev 0.2 处理完毕###############"
    cd $basepath
}

################执行在服务器上运行的解压等命令###########
runSpecialCmd ()
{
    tar -xvf ${basepath}'tangramgit.tar'
}

##############主程序###################

isLocal

#如果传入第一个参数，第一个参数为's'，则表示执行预定义的服务器上的脚本命令。否则将第一个参数设置为更新源代码的根目录。
if [ -n "$1" ] ;then
    if [ $1x = '-s'x ] ;then
        runSpecialCmd
        exit
    else
        basepath=$1
    fi
fi

#如果根目录不存在，就创建根目录
if [ ! -d "$basepath" ] ;then
    mkdir $basepath
fi
cd $basepath

updateMaster
updateDev
updateDev2

if [ $sendToFeMachine -eq 1 ] ;then
   # copyDataToRemote
    curl http://fe.baidu.com/~g/docbeta/source/update_tangram_source.php
fi

cd $rawpath

echo "done."
