#!/bin/bash

# Claude-to-IM Sync 安装脚本

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_DIR="/usr/local/bin"
SCRIPT_NAME="claude-im-sync"

echo "🚀 开始安装 Claude-to-IM Sync Tool..."
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo ""

# 检查脚本文件
if [ ! -f "$SCRIPT_DIR/$SCRIPT_NAME.js" ]; then
    echo "❌ 错误: 找不到 $SCRIPT_DIR/$SCRIPT_NAME.js"
    exit 1
fi

if [ ! -f "$SCRIPT_DIR/$SCRIPT_NAME" ]; then
    echo "❌ 错误: 找不到 $SCRIPT_DIR/$SCRIPT_NAME"
    exit 1
fi

echo "✅ 找到脚本文件"
echo ""

# 设置执行权限
chmod +x "$SCRIPT_DIR/$SCRIPT_NAME"
chmod +x "$SCRIPT_DIR/$SCRIPT_NAME.js"
echo "✅ 已设置执行权限"
echo ""

# 询问安装方式
echo "请选择安装方式:"
echo "1) 创建软链接到 /usr/local/bin (推荐，需要 sudo)"
echo "2) 添加别名到 ~/.zshrc"
echo "3) 添加别名到 ~/.bashrc"
echo "4) 跳过安装，仅测试"
echo ""
read -p "请输入选项 (1-4): " choice

case $choice in
    1)
        echo ""
        echo "正在创建软链接..."
        if [ -L "$INSTALL_DIR/$SCRIPT_NAME" ]; then
            echo "⚠️  软链接已存在，正在删除旧链接..."
            sudo rm "$INSTALL_DIR/$SCRIPT_NAME"
        fi
        sudo ln -s "$SCRIPT_DIR/$SCRIPT_NAME" "$INSTALL_DIR/$SCRIPT_NAME"
        echo "✅ 软链接已创建: $INSTALL_DIR/$SCRIPT_NAME"
        echo ""
        echo "现在你可以在任何地方使用: claude-im-sync"
        ;;
    2)
        echo ""
        ALIAS_LINE="alias claude-im-sync='$SCRIPT_DIR/$SCRIPT_NAME'"
        if grep -q "alias claude-im-sync=" ~/.zshrc 2>/dev/null; then
            echo "⚠️  别名已存在于 ~/.zshrc"
        else
            echo "$ALIAS_LINE" >> ~/.zshrc
            echo "✅ 已添加别名到 ~/.zshrc"
        fi
        echo ""
        echo "请运行以下命令使别名生效:"
        echo "  source ~/.zshrc"
        ;;
    3)
        echo ""
        ALIAS_LINE="alias claude-im-sync='$SCRIPT_DIR/$SCRIPT_NAME'"
        if grep -q "alias claude-im-sync=" ~/.bashrc 2>/dev/null; then
            echo "⚠️  别名已存在于 ~/.bashrc"
        else
            echo "$ALIAS_LINE" >> ~/.bashrc
            echo "✅ 已添加别名到 ~/.bashrc"
        fi
        echo ""
        echo "请运行以下命令使别名生效:"
        echo "  source ~/.bashrc"
        ;;
    4)
        echo ""
        echo "⏭️  跳过安装"
        ;;
    *)
        echo ""
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "🧪 测试安装..."
echo ""

# 测试运行
if [ "$choice" = "1" ]; then
    claude-im-sync list
elif [ "$choice" = "2" ] || [ "$choice" = "3" ]; then
    "$SCRIPT_DIR/$SCRIPT_NAME" list
else
    "$SCRIPT_DIR/$SCRIPT_NAME" list
fi

echo ""
echo "🎉 安装完成！"
echo ""
echo "快速开始:"
echo "  claude-im-sync list          # 列出所有会话"
echo "  claude-im-sync latest        # 查看最近的对话"
echo "  claude-im-sync help          # 查看帮助"
echo ""
echo "详细文档: $SCRIPT_DIR/README-claude-im-sync.md"
