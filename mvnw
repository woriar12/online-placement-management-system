#!/bin/sh
# Apache Maven Wrapper startup script for OPMS Root
wrapperUrl="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"
MAVEN_BASEDIR="$(dirname "$0")"
WRAPPER_JAR="$MAVEN_BASEDIR/.mvn/wrapper/maven-wrapper.jar"

if [ ! -f "$WRAPPER_JAR" ]; then
    mkdir -p "$MAVEN_BASEDIR/.mvn/wrapper"
    echo "Downloading Maven Wrapper..."
    if command -v curl >/dev/null 2>&1; then
        curl -sH "User-Agent: Mozilla/5.0" -o "$WRAPPER_JAR" "$wrapperUrl"
    elif command -v wget >/dev/null 2>&1; then
        wget -q -O "$WRAPPER_JAR" "$wrapperUrl"
    fi
fi

exec java -classpath "$WRAPPER_JAR" org.apache.maven.wrapper.MavenWrapperMain "$@"
