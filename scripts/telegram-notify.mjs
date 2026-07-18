import { execFileSync } from 'node:child_process';

const account = process.env.USER || 'nikigo';

function readSecret(service) {
  try {
    return execFileSync('security', [
      'find-generic-password',
      '-a', account,
      '-s', service,
      '-w'
    ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    throw new Error('Telegram 尚未配置。请先运行 npm run telegram:setup。');
  }
}

const token = readSecret('nikigo.telegram.bot-token');
const chatId = readSecret('nikigo.telegram.chat-id');
const message = process.argv.slice(2).join(' ').trim() || '✅ Nikigo 任务已经完成。';

const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
  body: new URLSearchParams({ chat_id: chatId, text: message }),
  signal: AbortSignal.timeout(15000)
});
const payload = await response.json().catch(() => null);

if (!response.ok || !payload?.ok) {
  throw new Error(payload?.description || `Telegram 通知发送失败（HTTP ${response.status}）。`);
}

console.log('Telegram notification sent.');
