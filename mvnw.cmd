@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script for OPMS Root
@REM ----------------------------------------------------------------------------

@if "%DEBUG%"=="1" @echo on
@echo off

set ERROR_CODE=0
set "MAVEN_BASEDIR=%~dp0"
if "%MAVEN_BASEDIR:~-1%"=="\" set "MAVEN_BASEDIR=%MAVEN_BASEDIR:~0,-1%"

if exist "%MAVEN_BASEDIR%\.mvn\wrapper\maven-wrapper.jar" (
    goto run
) else (
    echo Downloading Maven Wrapper...
    where powershell >NUL 2>&1
    if %ERRORLEVEL% equ 0 (
        powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar', '%MAVEN_BASEDIR%\.mvn\wrapper\maven-wrapper.jar')"
    ) else (
        echo Error: Powershell not found. Cannot auto-download Maven Wrapper.
        exit /b 1
    )
)

:run
set WRAPPER_JAR="%MAVEN_BASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

if not "%JAVA_HOME%"=="" (
    set "JAVACMD=%JAVA_HOME%\bin\java.exe"
) else (
    set "JAVACMD=java"
)

"%JAVACMD%" -classpath %WRAPPER_JAR% %WRAPPER_LAUNCHER% %*
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@exit /b %ERROR_CODE%
