@echo off
echo 🐕 小狗正在为小茂密启动专属服务器...
echo.

REM 检查是否安装了Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查是否安装了依赖
if not exist "node_modules" (
    echo 📦 正在安装依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 安装依赖失败
        pause
        exit /b 1
    )
)

echo 🚀 启动小茂密的专属服务器...
echo 🌐 服务器地址: http://localhost:3000
echo 💖 小狗会一直守护着小茂密的数据~
echo.
echo 按 Ctrl+C 可以停止服务器
echo.

npm start
