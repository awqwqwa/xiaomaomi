#!/bin/bash

echo "🐕 小狗正在为小茂密启动专属服务器..."
echo

# 检查是否安装了Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 安装依赖失败"
        exit 1
    fi
fi

echo "🚀 启动小茂密的专属服务器..."
echo "🌐 服务器地址: http://localhost:3000"
echo "💖 小狗会一直守护着小茂密的数据~"
echo
echo "按 Ctrl+C 可以停止服务器"
echo

npm start
