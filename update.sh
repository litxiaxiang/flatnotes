#!/bin/bash
# 这是一个一键更新 Flatnotes 的脚本

echo "==================================="
echo "  开始更新 Flatnotes 笔记系统..."
echo "==================================="

# 1. 确保在正确的目录下执行
cd /var/www/flatnotes || { echo "错误：找不到项目目录 /var/www/flatnotes"; exit 1; }

# 2. 从 GitHub 拉取你在其他地方修改的最新代码
echo ">>> 正在拉取最新代码..."
git pull

# 3. 重新构建 Docker 镜像并启动容器
echo ">>> 正在重新构建并启动容器 (请耐心等待)..."
docker compose up -d --build

# 4. 顺手清理因重新构建产生的废弃镜像，节约服务器空间
echo ">>> 正在清理无用镜像..."
docker image prune -f

echo "==================================="
echo "  🎉 更新顺利完成！"
echo "==================================="