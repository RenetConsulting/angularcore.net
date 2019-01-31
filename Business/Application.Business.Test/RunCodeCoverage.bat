@echo off
SET dotnet="C:/Program Files/dotnet/dotnet.exe"
SET opencover=%USERPROFILE%\.nuget\packages\OpenCover\4.6.519\tools\OpenCover.Console.exe
SET reportgenerator=%USERPROFILE%\.nuget\packages\reportgenerator\3.1.1\tools\ReportGenerator.exe

SET targetargs="test"
SET filter="+[*]Application.Business* -[*.Test]* -[xunit.*]* -[FluentValidation]*"
SET coveragefile=Coverage.xml
SET coveragedir=Coverage

REM Run code coverage analysis
"%opencover%"  -register:user -target:%dotnet% -output:%coveragefile% -targetargs:%targetargs% -filter:%filter% -skipautoprops -hideskipped:All -oldstyle 

REM Generate the report
"%reportgenerator%" -targetdir:%coveragedir% -reporttypes:Html;Badges -reports:%coveragefile% -verbosity:Error

REM Open the report
start "report" "%coveragedir%\index.htm"