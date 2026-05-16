# Claude-IM-to-CLI

> 🔗 在 Claude Code CLI 中无缝访问 Telegram Bot (claude-to-im) 的对话内容

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)

## 📖 简介

**Claude-IM-to-CLI** 是一个命令行工具，用于在 Claude Code CLI 中查看、导出和分析 Telegram Bot (claude-to-im) 的对话内容。实现跨平台对话上下文共享，让你可以在 Telegram 上开始讨论，然后在 Claude Code CLI 中无缝继续。

### 解决的问题

- ✅ 在命令行中快速查看 Telegram bot 的对话历史
- ✅ 导出 Telegram 对话为标准 JSON 格式
- ✅ 在 Claude Code CLI 中继续 Telegram 上的讨论
- ✅ 跨平台对话上下文共享和备份

## 🚀 快速开始

### 前置要求

- Node.js >= 14.0.0
- 已安装并运行过 [claude-to-im](https://github.com/op7418/Claude-to-IM) Telegram Bot

### 安装

```bash
# 克隆仓库
git clone https://github.com/kidcvs/claude-im-to-cli.git
cd claude-im-to-cli

# 运行安装脚本
./install-claude-im-sync.sh
```

安装脚本会提供三种安装方式：
1. 创建软链接到 `/usr/local/bin`（推荐）
2. 添加别名到 `~/.zshrc`
3. 添加别名到 `~/.bashrc`

### 基本使用

```bash
# 列出所有 Telegram 会话
claude-im-sync list

# 查看最近的对话（默认显示最后 10 条消息）
claude-im-sync latest

# 查看最近的对话（显示最后 20 条消息）
claude-im-sync latest 20

# 查看完整对话
claude-im-sync latest --full

# 导出最近的会话
claude-im-sync export latest ./telegram-session.json
```

## 💡 使用场景

### 场景 1: 在 Claude Code CLI 中继续 Telegram 的讨论

1. 在 Telegram 上与 Claude bot 讨论问题
2. 导出对话：
   ```bash
   claude-im-sync export latest ./telegram-context.json
   ```
3. 在 Claude Code CLI 中：
   ```
   请读取 ./telegram-context.json，了解我们在 Telegram 上的讨论，
   然后继续帮我完成这个任务。
   ```

### 场景 2: 查看历史对话

```bash
# 列出所有会话
claude-im-sync list

# 查看特定会话
claude-im-sync show <session-id> --full
```

更多使用场景请查看 [EXAMPLES-claude-im-sync.md](./EXAMPLES-claude-im-sync.md)

## 📚 命令参考

| 命令 | 说明 | 示例 |
|------|------|------|
| `list`, `ls` | 列出所有会话 | `claude-im-sync list` |
| `latest [n]` | 显示最近会话 | `claude-im-sync latest 20` |
| `show <id> [n]` | 显示指定会话 | `claude-im-sync show abc123 30` |
| `export [id] [path]` | 导出会话 | `claude-im-sync export latest ./out.json` |
| `help` | 显示帮助 | `claude-im-sync help` |

### 输出示例

`claude-im-sync list` 的典型输出：

```
=== Claude-to-IM 会话列表 ===

共找到 10 个会话

1. 会话 ID: 434263bb-dc43-4245-927a-1bec9a0a630e
   最后更新: 2026/05/16 15:15:27
   消息数量: 7
   首条消息: 当前工作目录是什么...
```

`claude-im-sync export` 生成的 JSON 格式：

```json
{
  "session_id": "434263bb-dc43-4245-927a-1bec9a0a630e",
  "exported_at": "2026-05-16T07:15:27.000Z",
  "last_modified": "2026-05-16T07:15:27.000Z",
  "message_count": 7,
  "messages": [
    {
      "role": "user",
      "content": "当前工作目录是什么"
    },
    {
      "role": "assistant",
      "content": "当前工作目录是：\n\n```\n/home/user\n```"
    }
  ]
}
```

## 🧪 高级用法

### 实时监控最新对话

```bash
#!/bin/bash
# watch-telegram.sh
while true; do
    clear
    echo "=== Telegram Bot 最新对话 ==="
    claude-im-sync latest 5
    echo ""
    echo "刷新时间: $(date)"
    sleep 30
done
```

### 与 jq 配合处理导出 JSON

```bash
claude-im-sync export latest ./session.json

# 只提取用户的提问
jq '.messages[] | select(.role == "user") | .content' ./session.json

# 统计消息数量
jq '.messages | length' ./session.json
```

## 🎯 核心功能

- 📋 **会话列表** - 显示所有 Telegram 会话的概览（ID、时间、消息数）
- 🔍 **查看对话** - 以易读格式显示对话内容
- 💾 **导出 JSON** - 导出对话为标准 JSON 格式
- 🎨 **智能解析** - 自动解析 assistant 响应中的工具调用
- ⏰ **时间格式化** - 友好的中文时间显示

## 📂 项目结构

```
claude-im-to-cli/
├── claude-im-sync.js              # 核心 Node.js 脚本
├── claude-im-sync                 # Bash 包装器
├── install-claude-im-sync.sh      # 安装脚本
├── README.md                      # 项目说明（本文件）
└── EXAMPLES-claude-im-sync.md     # 使用示例
```

## 🔍 工作原理

1. **数据读取** - 从 `~/.claude-to-im/data/messages/` 读取会话 JSON 文件
2. **内容解析** - 解析 assistant 的响应（可能包含工具调用的 JSON）
3. **格式化输出** - 以易读的格式显示对话内容
4. **导出功能** - 转换为标准 JSON 格式供其他工具使用

### 数据存储位置

- **会话数据**：`~/.claude-to-im/data/messages/`
- **会话元数据**：`~/.claude-to-im/data/sessions.json`
- **每个会话**：独立的 JSON 文件，以会话 ID 命名

## 🩺 故障排除

### 找不到会话数据

确认 claude-to-im 已经安装并至少运行过一次：

```bash
ls -la ~/.claude-to-im/data/messages/
```

### 权限问题

确保脚本有执行权限：

```bash
chmod +x /path/to/claude-im-to-cli/claude-im-sync
chmod +x /path/to/claude-im-to-cli/claude-im-sync.js
```

### Node.js 未安装

```bash
node --version  # 需要 >= 14.0.0
```

## 📖 更多文档

- [使用示例](./EXAMPLES-claude-im-sync.md) - 实际场景和示例代码

## 🛠️ 手动安装

如果不想使用安装脚本，可以手动安装：

### 方式 1: 创建软链接

```bash
sudo ln -s /path/to/claude-im-to-cli/claude-im-sync /usr/local/bin/claude-im-sync
```

### 方式 2: 添加别名

在 `~/.zshrc` 或 `~/.bashrc` 中添加：

```bash
alias claude-im-sync='/path/to/claude-im-to-cli/claude-im-sync'
```

然后重新加载配置：

```bash
source ~/.zshrc  # 或 source ~/.bashrc
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发

```bash
# 克隆仓库
git clone https://github.com/kidcvs/claude-im-to-cli.git
cd claude-im-to-cli

# 测试
node claude-im-sync.js list
```

## 📄 许可证

[MIT License](LICENSE)

## 👤 作者

**kidcvs**

- GitHub: [@kidcvs](https://github.com/kidcvs)

## 🙏 致谢

- [Anthropic](https://www.anthropic.com/) - Claude AI
- [claude-to-im](https://github.com/op7418/Claude-to-IM) - Telegram Bot 基础

## 📝 更新日志

### v1.0.0 (2026-05-16)

- 🎉 初始版本发布
- ✅ 支持列出会话、查看对话、导出功能
- ✅ 完整的文档和使用示例

## 🔮 Roadmap

- [ ] 支持搜索对话内容（关键词搜索）
- [ ] 支持按日期范围筛选
- [ ] 支持导出为 Markdown 格式
- [ ] 支持将 Telegram 对话直接注入 Claude Code CLI 上下文
- [ ] 支持实时监听新消息
- [ ] 双向同步（Claude Code CLI → Telegram）

---

**如果这个项目对你有帮助，请给个 ⭐️ Star！**
