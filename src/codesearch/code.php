<?php
include "MergeSource.php";
include "ziplib.php";


/*	合并 请求的方法及引用方法 所有文件	的源代码	
	@return string || array(code:string,file:array )
*/
function do_merge($version, $src, $nobase, $compress, $viewSource,$nouibase,$isResource) {
	
	//	返回合并后的代码
	//	资源模式则返回一个数组，包含所有的资源文件路径
	
	$GLOBALS['viewSource'] = $viewSource;
	$m = new MergeSource();
	$codeR = $m->merge($version, $src, $nobase,$nouibase,$isResource);
	
	//	 资源模式剥离代码
	if($isResource){
		$code = $codeR['code'];
	}else{
		$code = $codeR;
	}
	
	if (!$viewSource) {
		try {
			if ($compress == "yui") {
                if ($_SERVER['SERVER_NAME']=="localhost"){
                    $jarPath = dirname( __FILE__) . DIRECTORY_SEPARATOR . "yuicompressor-2.4.2.jar";
                    $tempFile = dirname( __FILE__) . DIRECTORY_SEPARATOR . time();
                    $file_pointer = fopen($tempFile, "a");
                    fwrite($file_pointer,$code);
                    fclose($file_pointer);
                    $cmd = "java -jar $jarPath $tempFile --charset UTF-8 --type js";
                    exec($cmd . ' 2>&1', $raw_output);
                    $code = implode("\n", $raw_output);
                    unlink($tempFile);
				}else{
                    $post_data = "code=" . urlencode($code);
                    $url = 'http://fe.baidu.com/~g/docbeta/source/script/yuimini.php';
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_POST, 1);
                    curl_setopt($ch, CURLOPT_HEADER, 0);
                    curl_setopt($ch, CURLOPT_URL,$url);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                    $result = curl_exec($ch);
                    $code = $result;
				}
			} else if ($compress == "mini") {
				$code = JSMin::minify($code);
				
			} else if ($compress == "pack") {
				$packer = new JavaScriptPacker($code, 62, true);
				$code = $packer->pack();
			}
		} catch (Exception $e) {
		}
	}
	
	$code = $viewSource ? htmlspecialchars($code) : $code;
	
	if($isResource){
		$re['code'] = $code;
		$re['file'] = $codeR['file'];
	}else{
		$re = $code;
	}
	return $re;
}

/*	打包文件列表，输出文件	*/
function get_zipFile($zipfolder,$zipfile,$codeR){


	$timemark = preg_replace("/(\.)(\d+)\s(\d+)/","$3$2", microtime()."");
	$tempfolder =  $zipfolder.$timemark;
	mkdir($tempfolder, 0777);
	//	js临时文件路径
	$jsreadyfile = realpath($tempfolder).'/tangram.js';
	
	//合并资源文件和脚本文件的路径
	array_push($codeR['file'],$jsreadyfile);
	//	打包的文件、路径
	$zippath = $zipfolder.$timemark.'.zip';
	$componentfiles = join( ' ', $codeR['file'] );
	
	//输出临时脚本文件
	file_put_contents($jsreadyfile,$codeR['code']);
	//打包
	shell_exec("zip -j ".$zippath." ".$componentfiles);
	
	//	清理临时文件
	unlink($jsreadyfile);
	rmdir($tempfolder);
	
	//	输出文件

	$fso = fopen($zippath,"r");
	header("Content-type: application/octet-stream");
	header("Accept-Ranges: bytes");
	header("Accept-Length: ".filesize($zippath)); 
	header("Content-Disposition: attachment; filename=tangram.zip" );
	echo fread($fso,filesize($zippath));
	die();
}



/*	POST传入的值	*/

//版本
$version = $_REQUEST["version"];
//选取的方法列表
$src = $_REQUEST["src"];
//NoBase、NoUIBase
//$nobase = $_REQUEST["nobase"] ? true : false;
$nobase = !isset($_REQUEST["nobase"]) || strtolower($_REQUEST["nobase"]) == "false" ? false : true;
$nouibase = !isset($_REQUEST["nouibase"]) || strtolower($_REQUEST["nouibase"]) == "false" ? false : true;
//压缩类型  yui  mini  pack  其他值为不压缩
$compress = $_REQUEST["compress"];
//是否导出资源包
$isResource = $_REQUEST["resource"]?1:0;
//是否查看源代码
$viewSource = $_REQUEST["viewSource"]-0 ? true :false ; 

// 1.获取源代码
// 2.带有资源文件信息的数组（如果isResource）
$code = do_merge($version, $src, $nobase, $compress, $viewSource,$nouibase,$isResource);

/*	资源包模式	*/
if($isResource){


	$timeMark = preg_replace("/(\.)(\d+)\s(\d+)/","$3$2", microtime()."");
	$jsFile = 'zipFile/'.$timeMark.'/tangram.js';
	$zipFile = 'zipFile/'.$timeMark.'.zip';
	$files = $code['file'];
	$files[] = $jsFile;
	//	将代码保存在临时文件中
	mkdir('zipFile/'.$timeMark);
	file_put_contents($jsFile,$code['code']) ;
	
	$z = new PHPZip();
	$z->Zip($files, $zipFile);
	//	删除代码临时文件
	unlink($jsFile);
	rmdir('zipFile/'.$timeMark);
	//	将zip包输出
	$fso = fopen($zipFile,"r");
	header("Content-type: application/octet-stream");
	header("Accept-Ranges: bytes");
	header("Accept-Length: ".filesize($zipFile)); 
	header("Content-Disposition: attachment; filename=tangram.zip" );
	echo fread($fso,filesize($zipFile));
	//	删除zip包
	unlink($zipFile);
	die();
}

header("Cache-Control: no-cache, no-store, max-age=0, must-revalidate");
header("Pragma: no-cache");

if ($viewSource || $compress == "source") {

	$code = preg_replace("/\/\/ Copy.*?\/\/ limitations under the License\.?/msi", "", $code);
	$code = preg_replace("/\/\*\s*\*\s*Tangram.*?\*\/\n*/msi", "", $code);
	$copyright = 
<<<COPYRIGHT
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

COPYRIGHT;
	$code = $copyright.$code;	
}
if ($viewSource){
	header('Content-Type: text/html; charset=UTF-8');
	echo '<html><head></head><body onload="sh_highlightDocument(\'../js/\', \'.js\');"><pre class="sh_javascript">';
	echo $code;
	echo '</pre><script src="../js/sh_main.min.js"></script><link rel="stylesheet" href="../css/sh_style.css"></body></html>';
} else {
	header('Content-Type: text/javascript; charset=UTF-8');
	header("Content-Disposition: attachment; filename=\"tangram.js\"");
	echo ($compress == "source" ? "" : "/* Copyright (c) 2010 Baidu  Licensed under the BSD License */\n") . $code;
}

?>