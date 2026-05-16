# Claude-to-IM Sync Tool

在 Claude Code CLI 中获取 Telegram Bot (claude-to-im) 的对话内容。

## 功能特性

- 📋 列出所有 Telegram bot 会话
- 🔍 查看最近的对话内容
- 📝 查看指定会话的详细内容
- 💾 导出会话到 JSON 文件
- 🎯 支持限制显示消息数量或查看完整对话

## 安装

### 方法一：添加到 PATH（推荐）

```bash
# 创建软链接到 /usr/local/bin
sudo ln -s /Users/kidcvs/Documents/GitHub/aigc_ip/claude-im-sync /usr/local/bin/claude-im-sync

# 验证安装
claude-im-sync help
```

### 方法二：添加别名

在 `~/.zshrc` 或 `~/.bashrc` 中添加：

```bash
alias claude-im-sync='/Users/kidcvs/Documents/GitHub/aigc_ip/claude-im-sync'
```

然后重新加载配置：

```bash
source ~/.zshrc  # 或 source ~/.bashrc
```

### 方法三：直接使用

```bash
node /Users/kidcvs/Documents/GitHub/aigc_ip/claude-im-sync.js <command>
```

## 使用方法

### 1. 列出所有会话

```bash
claude-im-sync list
# 或
claude-im-sync ls
```

输出示例：
```
=== Claude-to-IM 会话列表 ===

共找到 10 个会话

1. 会话 ID: 434263bb-dc43-4245-927a-1bec9a0a630e
   最后更新: 2026/05/16 15:15:27
   消息数量: 7
   首条消息: 当前工作目录是什么...
```

### 2. 查看最近的会话

```bash
# 显示最后 10 条消息（默认）
claude-im-sync latest

# 显示最后 20 条消息
claude-im-sync latest 20

# 显示完整对话
claude-im-sync latest --full
```

### 3. 查看指定会话

```bash
# 显示指定会话的最后 10 条消息
claude-im-sync show 434263bb-dc43-4245-927a-1bec9a0a630e

# 显示指定会话的最后 30 条消息
claude-im-sync show 434263bb-dc43-4245-927a-1bec9a0a630e 30

# 显示指定会话的完整对话
claude-im-sync show 434263bb-dc43-4245-927a-1bec9a0a630e --full
```

### 4. 导出会话

```bash
# 导出最近的会话到默认文件
claude-im-sync export

# 导出最近的会话到指定文件
claude-im-sync export latest ./my-telegram-session.json

# 导出指定会话
claude-im-sync export 434263bb-dc43-4245-927a-1bec9a0a630e ./session.json
```

导出的 JSON 格式：
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
      "content": "当前工作目录是：\n\n```\n/Users/kidcvs\n```"
    }
  ]
}
```

## 命令速查表

| 命令 | 说明 | 示例 |
|------|------|------|
| `list`, `ls` | 列出所有会话 | `claude-im-sync list` |
| `latest [n]` | 显示最近会话 | `claude-im-sync latest 20` |
| `show <id> [n]` | 显示指定会话 | `claude-im-sync show abc123 30` |
| `export [id] [path]` | 导出会话 | `claude-im-sync export latest ./out.json` |
| `help` | 显示帮助 | `claude-im-sync help` |

## 高级用法

### 结合 Claude Code CLI 使用

在 Claude Code CLI 中，你可以直接运行这个工具来查看 Telegram bot 的对话：

```bash
# 在 Claude Code CLI 中执行
claude-im-sync latest 5

# 导出后在 Claude Code CLI 中分析
claude-im-sync export latest ./telegram-session.json
# 然后让 Claude 分析这个文件
```

### 在 Claude Code 中读取导出的会话

```javascript
// 在 Claude Code CLI 中，可以让 Claude 读取导出的文件
// 例如：请读取 ./telegram-session.json 并总结对话内容
```

### 监控最新对话

创建一个简单的监控脚本：

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

## 数据存储位置

- **会话数据**: `~/.claude-to-im/data/messages/`
- **会话元数据**: `~/.claude-to-im/data/sessions.json`
- **每个会话**: 独立的 JSON 文件，以会话 ID 命名

## 故障排除

### 找不到会话数据

确保 claude-to-im 已正确安装并运行过：

```bash
ls -la ~/.claude-to-im/data/messages/
```

### 权限问题

确保脚本有执行权限：

```bash
chmod +x /Users/kidcvs/Documents/GitHub/aigc_ip/claude-im-sync
chmod +x /Users/kidcvs/Documents/GitHub/aigc_ip/claude-im-sync.js
```

### Node.js 未安装

确保系统已安装 Node.js：

```bash
node --version
```

## 工作原理

1. **数据读取**: 从 `~/.claude-to-im/data/messages/` 读取会话 JSON 文件
2. **内容解析**: 解析 assistant 的响应（可能包含工具调用的 JSON）
3. **格式化输出**: 以易读的格式显示对话内容
4. **导出功能**: 将会话转换为标准 JSON 格式供其他工具使用

## 未来改进

- [ ] 支持搜索对话内容
- [ ] 支持按日期范围筛选
- [ ] 支持导出为 Markdown 格式
- [ ] 支持将 Telegram 对话导入到 Claude Code CLI 的上下文中
- [ ] 支持实时监听新消息
- [ ] 支持双向同步（Claude Code CLI → Telegram）

## 许可证

MIT

## 作者

kidcvs

## 更新日志

### v1.0.0 (2026-05-16)
- 初始版本
- 支持列出会话、查看对话、导出功能
