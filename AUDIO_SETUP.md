# Nikigo course audio

Nikigo only enables exact, pre-generated Korean files after Korean native-speaker approval. Device speech, similar-text substitutions, and answer-text fallback are forbidden.

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

Open **Actions → Generate lesson audio → Run workflow**, then explicitly select the lesson. The manual job reads the secret only in the generation step, validates the repository, and uploads the selected lesson directory as a seven-day Artifact. It does not commit or push generated files. Ordinary pushes only validate schema/mappings and run the full test suite; they do not read the secret or generate audio.

Before release, record `voiceSource`, `model`, `generationDate`, commercial-use basis and a Korean native-speaker review for every generated file, especially words and phrases affected by liaison, nasalization, tensification, or other sound changes. Files remain disabled until `reviewStatus` is `approved`.

The app must clearly disclose that the lesson voice is AI-generated.
