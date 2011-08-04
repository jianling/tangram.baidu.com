<?php
define("MY_DIR", realpath("../js/fragment"));
define("REC_DIR", realpath("../../source/github/"));

class MergeSource {
    private $patten = "/\/\/\/\s*import\s+([^;]+);*/";
    private $pattenRec = "/\/\/\/\s*resource\s+([^;]+);*/";
    private $mergedCode = array();

    public $version;
    public $src;
    public $nobase;
    
    public function __construct(){
		$this->VERDIR['tangram-component_stable'] = 'nightly/Tangram-component/resources';
    }
    
    public function merge($version, $src, $nobase,$nouibase = false,$isResource = false) {
	
        $this->version = $version;
        $this->nobase = $nobase;
        $this->nouibase = $nouibase;
		$this->mergedFile = array();
		$this->isLite = $_REQUEST["isLite"] ? 1 :0 ;
		$this->allMods = array();
		$this->src = $src;
		
		if( $this->version == 'tangram-mobile' && !$this->isLite  ){
			$this->src = str_replace('$','',$this->src);
		}
		
		$re['code'] = preg_replace_callback($this->patten, array($this, 'mergeCallback'), $src);
		$re['file'] = $this->mergedFile;
		//	如果是mobile则更新其代码

		if( $this->version == 'tangram-mobile' || 0 ){
			$re['code'] = $this->getMobileCode();
		}
		if($isResource){
			return $re;
		}else{
			return $re['code'];
		}
		
    }

    public function mergeCallback($match) {
	
        $module = trim($match[1]);
        # mobile 专用逻辑
		if($this->isLite){
			$liteModule =  preg_replace("/(.+)(\.)(\w+)$/i", '$1$2\$$3',$module);
			$liteFile = $this->filePathJoin(MY_DIR, $this->version, str_replace(".", "/",$liteModule ) . ".js") ;
			if( file_exists( $liteFile ) ){
				$module = $liteModule;
			}
			$this->allMods[] = $module;
		}
		
        if (empty($this->mergedCode[$module])) {
            $this->mergedCode[$module] = true;
            $module = str_replace(".", "/", $module) . ".js";
            # 生成文件路径
            $filePath = $this->filePathJoin(MY_DIR, $this->version.'/src',$module);
            
            
			//@todo 2011-05-10 filter nobase ==>baidu.ui.base.js by XZH
            if ($this->nobase && !preg_match ("/(baidu\/)(ui|fx|widget|data|i18n|tools)(.*)/i", $module) ) {
				return "/* BASE: $module */";
            }
			//@todo 2011-05-23 filter nouibase ==>baidu.ui.base.js by XZH
			//@todo 2011-05-31 filter nouibase ==>baidu.ui.createUI.js by XZH
			if ( $this->nouibase && preg_match ("/(baidu\/)(ui)\/(base|createUI)(.*)/i", $module) ){
				 return "/* UI BASE: $module */";
			}

            $realpath = $this->filePathJoin(MY_DIR, $this->version.'/src',$module);
			//die( $realpath);
			
			
            if (!file_exists($realpath)) {
				if( $GLOBALS['viewSource'] ){
					return $this->indexUpLevelFile($module);
				}else{
					return "//NOT found $module \n";
				}
            }
            
            return $this->mergeFile($realpath);            
        }
    }
    public function indexUpLevelFile($path){
		
		$patharr = explode ('/',$path);
		array_pop( $patharr );
		$pathstr = implode('/',$patharr).'.js';
		
		if( count($patharr)<2 ){
			return "//NOT found $path \n";
		}
		$realpath = $this->filePathJoin(MY_DIR, $this->version, $pathstr);

		return  file_exists( $realpath ) ? $this->mergeFile($realpath) : $this->indexUpLevelFile($pathstr);
	}
	
    public function mergeFile($file) {
		
		//	过滤资源文件
		$con = preg_replace_callback($this->pattenRec, array($this, "getResource"), file_get_contents($file));
        return preg_replace_callback($this->patten, array($this, "mergeCallback"), $con);
		
    }
    
    public function filePathJoin() {
        $arr = func_get_args();
        return implode(DIRECTORY_SEPARATOR, $arr);
    }
	
	
	//	为无线的代码lite单独编写的逻辑
	public function getMobileCode(){
		
		
		$this->srcs = array();
		preg_replace_callback($this->patten, array($this, 'getSrcs'), $this->src);
		
		
		$mods = $this->mergedCode;
		$srcs = $this->srcs;
		$isLite = $this->isLite;
		
		$code = array();
		

		//	lite模式
		if($isLite || 0){
			//	引用的代码
			$code = $this->getImports( $this->allMods,$srcs );
			
			//	过滤所选模块
			foreach($srcs as $k=>$v){
				$toLite = preg_replace("/(.+)(\.)(\w+)$/i", '$1$2\$$3',$k);
				if(	$code[$k] || $code[$toLite]	){
					//$code[$k] = 'abort. import modules is exist!';
				}else{
					//	如果存在精简版文件
					if( file_exists( $this->filePathJoin(MY_DIR, $this->version, str_replace(".", "/", $toLite) . ".js") ) ){
						$code[$toLite] = 'choose normal to lite version file...'				;
					}
					//	否则普通版
					else{
						$code[$k] = 'choose normal file only...';
					}
				}
			}
		}
		//	normal模式
		else{
			foreach($mods as $k=>$v){
				//	勾选的模块
				if( !empty( $srcs[$k] ) ){
					$code[$k] = 'choose module file....' ;
				}
				//	引用的模块
				else{
					$testM = str_replace(".$", ".", $k);
					//	normal版
					if($testM == $k){
						$code[$k] = 'import normal version file must!...' ;
					}
					//	lite版,且当前代码中无normal版
					elseif( $testM != $k && empty( $srcs[$testM] ) ){
						$code[$k] = 'import lite version only.' ;
					}
					//	lite版,且有normal版，放弃
					else{
						//$code[$k] = 'abort. import lite , but normal was had.';
					}
				}
			}
		}

		//	转回结果
		$modules = array();
		foreach ($code as $k=>$v){
			$modules[] = $k;
		}
		sort($modules);
		$code = array();
		foreach($modules as $k=>$v){
			$code[$v] = $this->getCode($v);
		}
		
		
		return join($code);

	}
	
	//	专门为modules取得文件内容
	public function getCode($module){
		$code = "";
		$module = str_replace(".", "/", $module) . ".js";
		$filePath = $this->filePathJoin(MY_DIR, $this->version ,$module);
		
		if (file_exists($filePath)) {
			$con = file_get_contents($filePath);
			$con = preg_replace($this->patten, '',$con);
			$con = preg_replace($this->pattenRec, '',$con);
			$code = $con;
		}else{
			$code = $module.' file is not found!';
		}
		return $code ;
	}
	
	//	过滤返回引用的模块
	public function getImports($all,$choose ){
		$re = array();
		//	筛选引用模块列表
		$choose = array_keys($choose);
		foreach($choose as $k=>$v){
			unset($all[array_search( $v,$all)]);
		}
		//	唯一过滤
		$all =  array_unique($all);
		//	反转下所有的模块
		foreach($all as $k=>$v){
			$allRev[$v] = true;
		}
		//	引用liet->normal过滤
		foreach($allRev as $k=>$v){
			$testM = str_replace(".$", ".", $k);
			//	引用normal版
			if($testM == $k){
				$re[$k] = 'import normal version....';
			}
			//	引用lite版，且无normal版本
			elseif( $testM != $k && empty( $allRev[$testM] ) ){
				$re[$k] = 'import lite version...';
			}
			//	引用lite版，且有normal版，放弃
			else{
				//$re[$k] = 'abort. normal version was had.';
			}
		}
		return $re;
		
	}
	
	
	//	分析传入的src返回$this->srcs
	public function getSrcs($match){
		$this->srcs[$match[1]] = true;
	}
	
	
	//	添加资源文件到返回值
	public function getResource($match){
		$file = split('\.',$match[1]);
		$ext = array_pop($file);
		$fp =  join('/',$file ).'.'.$ext ;
		$path = $this->filePathJoin(REC_DIR, $this->VERDIR[$this->version],$fp);
		if( file_exists($path) ){
			array_push($this->mergedFile,$path);
		}
		return "";
	}
}    
?>
