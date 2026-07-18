import { execFileSync, spawnSync } from 'node:child_process';

const account = process.env.USER || 'nikigo';
const tokenService = 'nikigo.telegram.bot-token';
const chatService = 'nikigo.telegram.chat-id';
const promptScript = `
tell application "System Events"
  activate
  display dialog "请粘贴 @BotFather 提供的 Telegram Bot Token。\nToken 只会保存到 macOS 钥匙串，不会写入项目文件。" default answer "" with title "Nikigo Telegram 通知" with hidden answer buttons {"取消", "保存并测试"} default button "保存并测试" cancel button "取消"
  return text returned of result
end tell
`;

function saveSecret(service, value) {
  const result = spawnSync('security', [
    'add-generic-password',
    '-U',
    '-a', account,
    '-s', service,
    '-w', value
  ], { stdio: 'ignore' });
  if (result.status !== 0) throw new Error('无法写入 macOS 钥匙串。');
}

async function telegramRequest(token, method, body) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' } : undefined,
    body: body ? new URLSearchParams(body) : undefined,
    signal: AbortSignal.timeout(15000)
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.description || `Telegram API 请求失败（HTTP ${response.status}）。`);
  }
  return payload.result;
}

let token = '';
try {
  token = execFileSync('osascript', ['-e', promptScript], { encoding: 'utf8' }).trim();
} catch {
  process.exit(2);
}

if (!/^\d+:[A-Za-z0-9_-]{20,}$/.test(token)) {
  throw new Error('Bot Token 格式不正确，请重新运行配置。');
}

const updates = await telegramRequest(token, 'getUpdates');
const privateChats = updates
  .map(update => update.message?.chat || update.edited_message?.chat || null)
  .filter(chat => chat?.type === 'private');
const chat = privateChats.at(-1);

if (!chat) {
  throw new Error('没有找到你的私聊。请先打开新 Bot，发送 /start，然后重新运行配置。');
}

const chatId = String(chat.id);
await telegramRequest(token, 'sendMessage', {
  chat_id: chatId,
  text: '✅ Nikigo Telegram 通知配置成功。之后任务完成时，我会在这里通知你。'
});

saveSecret(tokenService, token);
saveSecret(chatService, chatId);

console.log(`Telegram 通知已启用：${chat.first_name || chat.username || 'private chat'}（Chat ID 尾号 ${chatId.slice(-4)}）`);
