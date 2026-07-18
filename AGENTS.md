# Nikigo workspace instructions

- When a user-requested Nikigo development task is genuinely complete, send a concise completion notification with `node scripts/telegram-notify.mjs "✅ Nikigo 任务完成：<short summary>"` before the final response.
- Do not include tokens, credentials, personal data, or long logs in Telegram messages.
- If Telegram credentials are not configured or sending fails, finish the task normally and tell the user that the Telegram notification was not delivered.
