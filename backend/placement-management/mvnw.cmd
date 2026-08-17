@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.3.2
@REM ----------------------------------------------------------------------------

@if "%DEBUG%"=="1" @echo on
@echo off

set ERROR_CODE=0

@REM set %~dp0 to MAVEN_BASEDIR
set "MAVEN_BASEDIR=%~dp0"

@REM Remove trailing slash if present
if "%MAVEN_BASEDIR:~-1%"=="\" set "MAVEN_BASEDIR=%MAVEN_BASEDIR:~0,-1%"

@REM Find maven.config file
set "MAVEN_CONFIG=%MAVEN_BASEDIR%\.mvn"

@REM -- Execute wrapper --
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

"%JAVACMD%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_BASEDIR%" -classpath %WRAPPER_JAR% %WRAPPER_LAUNCHER% %*
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@exit /b %ERROR_CODE%
