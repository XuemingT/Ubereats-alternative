#!/bin/bash

# Java 21 虚拟环境设置脚本
echo "设置Java 21虚拟环境..."

# 设置Java 21环境变量
export JAVA_HOME="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"
export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"

# 验证Java版本
echo "当前Java版本:"
java -version

echo "当前Maven版本:"
mvn -version

echo "Java 21虚拟环境已激活！"
echo "现在可以运行Maven命令了。"
