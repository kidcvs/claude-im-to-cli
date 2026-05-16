# Claude-to-IM 与 Claude Code CLI 互通方案

## 📋 项目概述

实现 Telegram Bot (claude-to-im) 和 Claude Code CLI 之间的对话互通，让你可以在命令行中查看、导出和分析 Telegram 上的对话内容。

## 🎯 解决的问题

- ✅ 在 Claude Code CLI 中查看 Telegram bot 的对话历史
- ✅ 导出 Telegram 对话为 JSON 格式
- ✅ 在 Claude Code CLI 中继续 Telegram 上的讨论
- ✅ 跨平台对话上下文共享

## 📦 已创建的文件

```
/Users/kidcvs/Documents/GitHub/aigc_ip/
├── claude-im-sync.js              # 核心 Node.js 脚本
├── claude-im-sync                 # Bash 包装器（可执行）
├── install-claude-im-sync.sh      # 安装脚本
├── README-claude-im-sync.md       # 完整文档
└── EXAMPLES-claude-im-sync.md     # 使用示例
```

## 🚀 快速开始

### 1. 安装

运行安装脚本：

```bash
cd /Users/kidcvs/Documents/GitHub/aigc_ip
./install-claude-im-sync.sh
```

或手动创建软链接：

```bash
sudo ln -s /Users/kidcvs/Documents/GitHub/aigc_ip/claude-im-sync /usr/local/bin/claude-im-sync
```

### 2. 基本使用

```bash
# 列出所有会话
claude-im-sync list

# 查看最近的对话
claude-im-sync latest

# 导出最近的对话
claude-im-sync export latest ./telegram-session.json
```

## 💡 核心功能

### 1. 查看会话列表

```bash
claude-im-sync list
```

输出：
- 会话 ID
- 最后更新时间
- 消息数量
- 首条消息预览

### 2. 查看对话内容

```bash
# 最近的对话（默认 10 条）
claude-im-sync latest

# 最近的对话（指定数量）
claude-im-sync latest 20

# 完整对话
claude-im-sync latest --full

# 指定会话
claude-im-sync show <session-id>
```

### 3. 导出对话

```bash
# 导出最近的会话
claude-im-sync export

# 导出到指定文件
claude-im-sync export latest ./my-session.json

# 导出指定会话
claude-im-sync export <session-id> ./output.json
```

导出格式：
```json
{
  "session_id": "...",
  "exported_at": "2026-05-16T07:15:27.000Z",
  "message_count": 7,
  "messages": [
    {
      "role": "user",
      "content": "..."
    },
    {
      "role": "assistant",
      "content": "..."
    }
  ]
}
```

## 🔄 工作流示例

### 场景：在 Claude Code CLI 中继续 Telegram 的讨论

1. **在 Telegram 上与 Claude bot 讨论问题**
   - 例如：讨论如何部署一个服务

2. **导出对话**
   ```bash
   claude-im-sync export latest ./telegram-context.json
   ```

3. **在 Claude Code CLI 中继续**
   ```
   请读取 ./telegram-context.json，了解我们在 Telegram 上的讨论，
   然后帮我继续完成部署任务。
   ```

4. **Claude 会自动读取文件并继续对话**

## 📊 数据存储

### Telegram Bot 数据位置

```
~/.claude-to-im/
├── data/
│   ├── messages/              # 会话消息（JSON 文件）
│   │   ├── <session-id-1>.json
│   │   ├── <session-id-2>.json
│   │   └── ...
│   ├── sessions.json          # 会话元数据
│   ├── audit.json             # 审计日志
│   └── permissions.json       # 权限配置
├── logs/                      # 日志文件
└── runtime/                   # 运行时数据
```

### 会话文件格式

每个会话是一个 JSON 数组，包含对话消息：

```json
[
  {
    "role": "user",
    "content": "当前工作目录是什么"
  },
  {
    "role": "assistant",
    "content": "[{\"type\":\"tool_use\",...},{\"type\":\"text\",\"text\":\"...\"}]"
  }
]
```

## 🛠️ 技术实现

### 核心逻辑

1. **读取会话数据**
   - 从 `~/.claude-to-im/data/messages/` 读取 JSON 文件
   - 解析会话元数据

2. **解析 Assistant 响应**
   - Assistant 的 content 可能是 JSON 字符串（包含工具调用）
   - 提取纯文本内容用于显示

3. **格式化输出**
   - 用户消息：👤 用户
   - 助手消息：🤖 助手
   - 时间戳格式化

4. **导出功能**
   - 转换为标准 JSON 格式
   - 包含元数据（会话 ID、时间戳等）

## 🔮 未来改进方向

### 短期（v1.1）
- [ ] 支持搜索对话内容（关键词搜索）
- [ ] 支持按日期范围筛选
- [ ] 支持导出为 Markdown 格式

### 中期（v1.2）
- [ ] 实时监听新消息（WebSocket）
- [ ] 支持将对话直接导入 Claude Code CLI 上下文
- [ ] 支持对话摘要生成

### 长期（v2.0）
- [ ] 双向同步（Claude Code CLI → Telegram）
- [ ] Web UI 界面
- [ ] 对话分析和统计
- [ ] 多用户支持

## 📚 相关文档

- [完整文档](./README-claude-im-sync.md) - 详细的使用说明
- [使用示例](./EXAMPLES-claude-im-sync.md) - 实际场景示例

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT

---

**创建时间**: 2026-05-16  
**作者**: kidcvs  
**版本**: v1.0.0
