# Lesson 5 Audio Readiness

Lesson 5 resolves exact Korean speech text through the existing catalog and
`canPlayAudio` gate. No catalog or audio file changed in this integration.

| Text | Request mode | Catalog type | Catalog lesson | `canPlayAudio` | Local path | HTTP |
|---|---|---|---|---|---|---:|
| `가` | exact speech text | `initial-example` | `lesson-01` | true | `audio/lesson-01/ga.mp3` | 200 |
| `너` | exact speech text | `syllable` | `lesson-01` | true | `audio/lesson-01/neo-v2.wav` | 200 |
| `미` | exact speech text | `syllable` | `lesson-02` | true | `audio/lesson-02/mi.mp3` | 200 |
| `고` | exact speech text | `syllable` | `lesson-01` | true | `audio/lesson-01/go-v2.wav` | 200 |
| `누` | exact speech text | `syllable` | `lesson-01` | true | `audio/lesson-01/nu-v2.wav` | 200 |
| `그` | exact text + `syllable` + `lesson-05` | `syllable` | `lesson-05` | true | `audio/lesson-05/geu.mp3` | 200 |
| `아` | exact speech text | `vowel` | `lesson-01` | true | `audio/lesson-01/a.mp3` | 200 |
| `어` | exact speech text | `vowel` | `lesson-01` | true | `audio/lesson-01/eo.mp3` | 200 |
| `오` | exact speech text | `vowel` | `lesson-01` | true | `audio/lesson-01/o.mp3` | 200 |
| `나` | exact speech text | `initial-example` | `lesson-01` | true | `audio/lesson-01/na.mp3` | 200 |

Totals:

- requests: 10
- approved: 10
- playable: 10
- pending: 0
- missing: 0
- local resources returning HTTP 200: 10
- completion audio gate: no
- device TTS: 0
- external audio/API requests: 0

The formal engine displays nine audio controls on the three real example
screens. `나` remains part of the formal exact-match audio set but the existing
course does not place a playback control on its Split exercise; this integration
does not invent a new control or change course content.
