# Claude-to-IM Sync 使用示例

## 场景 1: 快速查看最近的 Telegram 对话

你在 Telegram 上和 Claude bot 讨论了一个技术问题，现在想在 Claude Code CLI 中继续这个话题。

```bash
# 查看最近的对话
claude-im-sync latest 10
```

## 场景 2: 导出 Telegram 对话并在 Claude Code CLI 中分析

```bash
# 1. 导出最近的对话
claude-im-sync export latest ./telegram-session.json

# 2. 在 Claude Code CLI 中
# 直接告诉 Claude: "请读取 ./telegram-session.json 并总结我们在 Telegram 上讨论的内容"
```

## 场景 3: 查找特定的历史对话

```bash
# 1. 列出所有会话
claude-im-sync list

# 2. 找到你想要的会话 ID
# 3. 查看完整对话
claude-im-sync show <session-id> --full
```

## 场景 4: 在 Claude Code CLI 中继续 Telegram 的讨论

### 步骤 1: 导出 Telegram 对话
```bash
claude-im-sync export latest ./telegram-context.json
```

### 步骤 2: 在 Claude Code CLI 中提供上下文
```
我刚才在 Telegram 上和你讨论了一个问题，对话已导出到 ./telegram-context.json。
请读取这个文件，了解我们之前的讨论，然后继续帮我解决这个问题。
```

## 场景 5: 使用 jq 处理导出的 JSON

```bash
# 导出会话
claude-im-sync export latest ./session.json

# 只提取用户的问题
jq '.messages[] | select(.role == "user") | .content' ./session.json

# 统计消息数量
jq '.messages | length' ./session.json
```

## 快捷别名

在 `~/.zshrc` 或 `~/.bashrc` 中添加：

```bash
alias tg-latest='claude-im-sync latest'
alias tg-list='claude-im-sync list'
alias tg-export='claude-im-sync export latest'
```
