@echo off

set crrnt=%~dp0
set bin=%crrnt%\bin
set YUICmprssr=%bin%\yuicompressor-2.4.2.jar
set source=%crrnt%\..\..\src
set building=%crrnt%\..\..\building
set output=%crrnt%\..\..\www

if exist "%building%\" (rmdir /s /q "%building%\")
if exist "%output%\" (rmdir /s /q "%output%\")

xcopy "%source%" "%building%\" /h /e /r /y

echo ============================ includer ============================
"%bin%\includer" "%building%\" "%output%\"

for /F "usebackq tokens=* delims=" %%i in (`dir /A-D /S /B "%output%\*.inc"`) do (
	echo deleting... %%i
	del /F /Q /S "%%i"
)

rmdir /S /Q %output%\css\base-css

rmdir /s /q "%building%\"

"%bin%\replaz" "%output%\docs\" "{ROOTPATH}" "../"
"%bin%\replaz" "%output%\" "{ROOTPATH}" "./"

if "%1"=="debug" (goto end)

	for /F "usebackq tokens=* delims=" %%i in (`dir /A-D /S /B "%output%\js\*.js"`) do (
		echo compressing... %%i
		java -jar %YUICmprssr% --type js --charset utf-8 -o "%%i" --nomunge "%%i"
	)

	echo.
	echo.

	for /F "usebackq tokens=* delims=" %%i in (`dir /A-D /S /B "%output%\css\*.css"`) do (
		echo compressing... %%i
		java -jar %YUICmprssr% --type css --charset utf-8 -o "%%i" "%%i"
	)

:end