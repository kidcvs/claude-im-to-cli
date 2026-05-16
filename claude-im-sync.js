#!/usr/bin/env node

/**
 * Claude-to-IM Sync Tool
 * 用于在 Claude Code CLI 中获取 Telegram bot 的对话内容
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const CLAUDE_TO_IM_DIR = path.join(os.homedir(), '.claude-to-im');
const MESSAGES_DIR = path.join(CLAUDE_TO_IM_DIR, 'data', 'messages');
const SESSIONS_FILE = path.join(CLAUDE_TO_IM_DIR, 'data', 'sessions.json');

/**
 * 格式化时间戳
 */
function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * 解析 assistant 的 content（可能是 JSON 字符串）
 */
function parseAssistantContent(content) {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      // 提取文本内容
      const textParts = parsed
        .filter(item => item.type === 'text')
        .map(item => item.text);
      return textParts.join('\n') || content;
    }
  } catch (e) {
    // 不是 JSON，直接返回原内容
  }
  return content;
}

/**
 * 获取所有会话列表
 */
function listSessions() {
  try {
    const files = fs.readdirSync(MESSAGES_DIR);
    const sessions = files
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const sessionId = f.replace('.json', '');
        const filePath = path.join(MESSAGES_DIR, f);
        const stat = fs.statSync(filePath);
        const messages = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        return {
          id: sessionId,
          file: f,
          lastModified: stat.mtime,
          messageCount: messages.length,
          firstMessage: messages[0]?.content?.substring(0, 50) || ''
        };
      })
      .sort((a, b) => b.lastModified - a.lastModified);

    return sessions;
  } catch (error) {
    console.error('读取会话列表失败:', error.message);
    return [];
  }
}

/**
 * 获取指定会话的对话内容
 */
function getSession(sessionId) {
  try {
    const filePath = path.join(MESSAGES_DIR, `${sessionId}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`会话不存在: ${sessionId}`);
      return null;
    }

    const messages = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const stat = fs.statSync(filePath);

    return {
      id: sessionId,
      lastModified: stat.mtime,
      messages
    };
  } catch (error) {
    console.error('读取会话失败:', error.message);
    return null;
  }
}

/**
 * 获取最近的会话
 */
function getLatestSession() {
  const sessions = listSessions();
  if (sessions.length === 0) {
    console.error('没有找到任何会话');
    return null;
  }
  return getSession(sessions[0].id);
}

/**
 * 显示会话列表
 */
function displaySessionList() {
  const sessions = listSessions();

  console.log('\n=== Claude-to-IM 会话列表 ===\n');
  console.log(`共找到 ${sessions.length} 个会话\n`);

  sessions.forEach((session, index) => {
    console.log(`${index + 1}. 会话 ID: ${session.id}`);
    console.log(`   最后更新: ${formatDate(session.lastModified)}`);
    console.log(`   消息数量: ${session.messageCount}`);
    console.log(`   首条消息: ${session.firstMessage}...`);
    console.log('');
  });
}

/**
 * 显示会话内容
 */
function displaySession(session, options = {}) {
  if (!session) return;

  const { limit = 10, full = false } = options;

  console.log('\n=== 会话详情 ===\n');
  console.log(`会话 ID: ${session.id}`);
  console.log(`最后更新: ${formatDate(session.lastModified)}`);
  console.log(`消息总数: ${session.messages.length}`);
  console.log('\n--- 对话内容 ---\n');

  const messagesToShow = full
    ? session.messages
    : session.messages.slice(-limit);

  messagesToShow.forEach((msg, index) => {
    const role = msg.role === 'user' ? '👤 用户' : '🤖 助手';
    const content = msg.role === 'assistant'
      ? parseAssistantContent(msg.content)
      : msg.content;

    console.log(`${role}:`);
    console.log(content);
    console.log('\n' + '-'.repeat(60) + '\n');
  });

  if (!full && session.messages.length > limit) {
    console.log(`... 还有 ${session.messages.length - limit} 条历史消息（使用 --full 查看全部）\n`);
  }
}

/**
 * 导出会话到文件
 */
function exportSession(sessionId, outputPath) {
  const session = sessionId === 'latest'
    ? getLatestSession()
    : getSession(sessionId);

  if (!session) return;

  const exportData = {
    session_id: session.id,
    exported_at: new Date().toISOString(),
    last_modified: session.lastModified,
    message_count: session.messages.length,
    messages: session.messages.map(msg => ({
      role: msg.role,
      content: msg.role === 'assistant'
        ? parseAssistantContent(msg.content)
        : msg.content
    }))
  };

  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8');
  console.log(`✅ 会话已导出到: ${outputPath}`);
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!fs.existsSync(MESSAGES_DIR)) {
    console.error('错误: 未找到 claude-to-im 数据目录');
    console.error(`请确保 ${MESSAGES_DIR} 存在`);
    process.exit(1);
  }

  switch (command) {
    case 'list':
    case 'ls':
      displaySessionList();
      break;

    case 'latest':
    case 'last':
      const latestSession = getLatestSession();
      const limit = parseInt(args[1]) || 10;
      const full = args.includes('--full');
      displaySession(latestSession, { limit, full });
      break;

    case 'show':
    case 'get':
      const sessionId = args[1];
      if (!sessionId) {
        console.error('错误: 请提供会话 ID');
        console.error('用法: claude-im-sync show <session-id>');
        process.exit(1);
      }
      const session = getSession(sessionId);
      const showLimit = parseInt(args[2]) || 10;
      const showFull = args.includes('--full');
      displaySession(session, { limit: showLimit, full: showFull });
      break;

    case 'export':
      const exportSessionId = args[1] || 'latest';
      const outputPath = args[2] || `./telegram-session-${Date.now()}.json`;
      exportSession(exportSessionId, outputPath);
      break;

    case 'help':
    case '--help':
    case '-h':
    default:
      console.log(`
Claude-to-IM Sync Tool - 同步 Telegram Bot 对话到 Claude Code CLI

用法:
  claude-im-sync <command> [options]

命令:
  list, ls                    列出所有会话
  latest [n] [--full]         显示最近的会话（默认显示最后 10 条消息）
  show <session-id> [n]       显示指定会话（默认显示最后 10 条消息）
  export [session-id] [path]  导出会话到 JSON 文件（默认导出最近的会话）
  help                        显示帮助信息

选项:
  --full                      显示完整对话（不限制消息数量）
  [n]                         显示最后 n 条消息（默认 10）

示例:
  claude-im-sync list                                    # 列出所有会话
  claude-im-sync latest                                  # 显示最近会话的最后 10 条消息
  claude-im-sync latest 20                               # 显示最近会话的最后 20 条消息
  claude-im-sync latest --full                           # 显示最近会话的全部消息
  claude-im-sync show 434263bb-dc43-4245-927a-1bec9a0a630e  # 显示指定会话
  claude-im-sync export                                  # 导出最近的会话
  claude-im-sync export latest ./my-session.json         # 导出到指定文件
      `);
      break;
  }
}

// 运行主函数
main();
