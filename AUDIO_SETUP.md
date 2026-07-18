# Nikigo course audio

Nikigo uses pre-generated Korean MP3 files first and the device voice only as a fallback.

## Provider

- NAVER Cloud CLOVA Voice Premium
- Korean female speaker: `nara`
- Output: MP3

## One-time GitHub setup

Create a CLOVA Voice application in NAVER Cloud, then add these repository secrets under **Settings → Secrets and variables → Actions**:

- `NCP_CLOVA_API_KEY_ID`
- `NCP_CLOVA_API_KEY`

Do not paste either value into source code, issues, commits, or chat.

## Generate audio

Open **Actions → Generate lesson audio → Run workflow**. The workflow generates the files listed in `audio/lesson-01/manifest.json` and commits the MP3 files to the repository.

Before release, a Korean native speaker should check every generated file, especially full words and phrases affected by liaison, nasalization, tensification, or other sound changes.
