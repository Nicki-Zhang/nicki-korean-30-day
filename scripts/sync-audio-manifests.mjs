import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

await import(resolve('audio-catalog.js'));

const catalog = globalThis.NikigoAudio?.lessons;
if (!catalog) throw new Error('audio-catalog.js did not expose NikigoAudio.lessons.');

for (const [lesson, value] of Object.entries(catalog)) {
  const manifest = {
    schemaVersion: 2,
    lesson,
    reviewPolicy: 'New or regenerated audio remains pending until a Korean native-speaker review is recorded.',
    generationDefaults: {
      provider: 'openai',
      model: 'gpt-4o-mini-tts',
      voice: 'marin',
      format: 'mp3',
      instructions: 'Speak only the supplied Korean speechText exactly once in natural standard Seoul Korean. Do not spell Hangul, translate, explain, read punctuation, or add a trailing vowel.'
    },
    rightsFields: {
      voiceTalent: null,
      consentRecord: null,
      commercialUseRecord: null
    },
    items: value.items
  };
  await writeFile(resolve('audio', lesson, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Synced audio/${lesson}/manifest.json`);
}
