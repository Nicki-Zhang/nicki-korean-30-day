# Nikigo workspace instructions

- Before modifying Nikigo, read `NIKIGO_DEVELOPMENT_RULES.md` completely and inspect the current worktree and existing implementation. Never rebuild blindly.
- Stay within the requested scope. Do not create or expand courses unless the user explicitly requests it.
- A task is complete only when automated tests and real-browser visual acceptance both pass.
- Never use blank, wrong-viewport, stale, redirected, or incompletely rendered screenshots as evidence.
- Never commit API keys, Telegram credentials, chat IDs, `.env` files, personal paths, browser credentials, or private notification configuration.
- When a requested Nikigo task is genuinely complete, send a concise local notification with `node scripts/telegram-notify.mjs "✅ Nikigo 任务完成：<short summary>"`. Notification failure is non-blocking; never include credentials, personal data, source, or long logs.
