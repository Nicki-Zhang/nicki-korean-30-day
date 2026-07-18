# Nikigo course audio

Nikigo uses pre-generated Korean MP3 files first and the device voice only as a fallback.

## Provider

- OpenAI Text-to-Speech API
- Model: `gpt-4o-mini-tts`
- Voice: `marin`, with a consistent Korean feminine-presenting teaching style
- Output: MP3

## One-time GitHub setup

Create a new secret key in the OpenAI API dashboard. Then add it to this repository under **Settings → Secrets and variables → Actions → Secrets → New repository secret**:

- Name: `OPENAI_API_KEY`
- Secret: the complete OpenAI secret key beginning with `sk-`

Do not create an Actions variable: API keys must be stored as a repository secret. Do not paste the value into source code, issues, commits, or chat. An existing masked key cannot be revealed again; create a new one if its full value was not saved.

The OpenAI API project must have available API billing or credits. A ChatGPT subscription does not automatically include API usage.

## Generate audio

Open **Actions → Generate lesson audio → Run workflow**, then select `lesson-01`, `lesson-02`, or `lesson-03`. The workflow generates the files listed in that lesson's manifest and commits the MP3 files to the repository.

Before release, a Korean native speaker should check every generated file, especially full words and phrases affected by liaison, nasalization, tensification, or other sound changes.

The app must clearly disclose that the lesson voice is AI-generated.
