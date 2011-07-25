@echo off

set crrnt=%~dp0
set bin=%crrnt%\bin
set source=%crrnt%\..\..\src
set building=%crrnt%\..\..\building
set output=%crrnt%\..\..\www

if exist "%building%\" (rmdir /s /q "%building%\")
if exist "%output%\" (rmdir /s /q "%output%\")

xcopy "%source%" "%building%\" /h /e /r /y

echo ============================ includer ============================
"%bin%\includer" "%building%\" "%output%\"

rmdir /s /q "%building%\"