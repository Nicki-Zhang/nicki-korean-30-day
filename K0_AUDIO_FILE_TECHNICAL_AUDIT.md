# K0 音频文件技术审计

> 使用 `file` 与 `afinfo` 进行只读检查。技术有效只代表容器可识别/可解码，不代表韩语发音正确。未执行声学内容识别，也未生成或改写文件。

## 汇总

- 物理音频文件：**48**（含 deprecated 2）。
- canonical catalog已声明且存在：**46**。
- canonical catalog已声明但缺失：**27**（对比课14 + 第6课13）。
- 可由 `afinfo` 解码：**48**。
- approved：**0**；pending：**73**。

## 物理文件

| file | bytes | MIME | container/codec evidence | duration(s) | Hz | ch | decode | refs | classification | silence/cutoff conclusion |
|---|---:|---|---|---:|---:|---:|---|---|---|---|
| audio/deprecated/lesson-01-ga-na.mp3 | 25728 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.608000 | 24000 | 1 | true | — | unused | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/deprecated/lesson-02-words.mp3 | 45696 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 2.856000 | 24000 | 1 | true | — | unused | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-01/a.mp3 | 18432 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.152000 | 24000 | 1 | true | lesson-01:a:아 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-01/eo.mp3 | 14592 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 0.912000 | 24000 | 1 | true | lesson-01:eo:어 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-01/ga.mp3 | 11520 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 0.720000 | 24000 | 1 | true | lesson-01:ga:가 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-01/geo-v2.wav | 16512 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.281542 | 22050 | 1 | true | lesson-01:geo:거 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-01/go-v2.wav | 16468 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.280544 | 22050 | 1 | true | lesson-01:go:고 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-01/gu-v2.wav | 16726 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.286395 | 22050 | 1 | true | lesson-01:gu:구 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-01/na.mp3 | 16896 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.056000 | 24000 | 1 | true | lesson-01:na:나 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-01/neo-v2.wav | 16262 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.275873 | 22050 | 1 | true | lesson-01:neo:너 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-01/no-v2.wav | 15242 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.252744 | 22050 | 1 | true | lesson-01:no:노 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-01/nu-v2.wav | 15750 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.264263 | 22050 | 1 | true | lesson-01:nu:누 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-01/o.mp3 | 19200 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.200000 | 24000 | 1 | true | lesson-01:o:오 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-01/u.mp3 | 12288 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 0.768000 | 24000 | 1 | true | lesson-01:u:우 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-02/ae.mp3 | 22656 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.416000 | 24000 | 1 | true | lesson-02:ae:애 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-02/da.mp3 | 16896 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.056000 | 24000 | 1 | true | lesson-02:da:다 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-02/dari.mp3 | 15360 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 0.960000 | 24000 | 1 | true | lesson-02:dari:다리 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-02/di.mp3 | 16128 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.008000 | 24000 | 1 | true | lesson-02:di:디 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-02/e.mp3 | 14592 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 0.912000 | 24000 | 1 | true | lesson-02:e:에 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-02/eu.mp3 | 14592 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 0.912000 | 24000 | 1 | true | lesson-02:eu:으 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-02/i.mp3 | 32256 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 2.016000 | 24000 | 1 | true | lesson-02:i:이 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-02/ma.mp3 | 13824 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 0.864000 | 24000 | 1 | true | lesson-02:ma:마 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-02/meori.mp3 | 12288 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 0.768000 | 24000 | 1 | true | lesson-02:meori:머리 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-02/mi.mp3 | 13056 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 0.816000 | 24000 | 1 | true | lesson-02:mi:미 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-02/namu.mp3 | 15360 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 0.960000 | 24000 | 1 | true | lesson-02:namu:나무 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-02/ra.mp3 | 12288 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 0.768000 | 24000 | 1 | true | lesson-02:ra:라 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-02/ri.mp3 | 6528 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 0.408000 | 24000 | 1 | true | lesson-02:ri:리 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-03/a.mp3 | 18432 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.152000 | 24000 | 1 | true | lesson-03:a:아 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-03/annyeong.mp3 | 21120 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.320000 | 24000 | 1 | true | lesson-03:annyeong:안녕 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-03/annyeonghaseyo.mp3 | 18432 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.152000 | 24000 | 1 | true | lesson-03:annyeonghaseyo:안녕하세요 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-03/ba.mp3 | 16128 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.008000 | 24000 | 1 | true | lesson-03:ba:바 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-03/bada.mp3 | 16896 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.056000 | 24000 | 1 | true | lesson-03:bada:바다 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-03/byeo.mp3 | 14592 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 0.912000 | 24000 | 1 | true | lesson-03:byeo:벼 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-03/sa.mp3 | 21120 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.320000 | 24000 | 1 | true | lesson-03:sa:사 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-03/saram.mp3 | 16128 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.008000 | 24000 | 1 | true | lesson-03:saram:사람 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-03/syeo.mp3 | 15360 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 0.960000 | 24000 | 1 | true | lesson-03:syeo:셔 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-03/ya.mp3 | 21888 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.368000 | 24000 | 1 | true | lesson-03:ya:야 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-03/yeo.mp3 | 24960 | audio/mpeg | MPEG ADTS, layer III, v2, 128 kbps, 24 kHz, Monaural | 1.560000 | 24000 | 1 | true | lesson-03:yeo:여 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-04/ba-v2.wav | 16726 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.286395 | 22050 | 1 | true | lesson-04:ba:바 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-04/bal-v2.wav | 18272 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.321451 | 22050 | 1 | true | lesson-04:bal:발 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-04/bam-v2.wav | 18784 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.333061 | 22050 | 1 | true | lesson-04:bam:밤 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-04/ban-v2.wav | 18272 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.321451 | 22050 | 1 | true | lesson-04:ban:반 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-04/bang-v2.wav | 18784 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.333061 | 22050 | 1 | true | lesson-04:bang:방 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-04/gamsahamnida-v2.wav | 43342 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.889932 | 22050 | 1 | true | lesson-04:gamsahamnida:감사합니다 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-04/gong-v2.wav | 18516 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.326984 | 22050 | 1 | true | lesson-04:gong:공 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-04/mom-v2.wav | 18312 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.322358 | 22050 | 1 | true | lesson-04:mom:몸 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-04/mul-v2.wav | 17800 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.310748 | 22050 | 1 | true | lesson-04:mul:물 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |
| audio/lesson-04/san-v2.wav | 19838 | audio/x-wav | RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 22050 Hz | 0.356961 | 22050 | 1 | true | lesson-04:san:산 | valid-technical | 参数无明显异常；仍需人工听首尾、停顿和静音 |

## 声明但缺失

- `audio/k0-consonant-contrast/ga.mp3` ← k0-consonant-contrast:ga / `가` / pending
- `audio/k0-consonant-contrast/ka.mp3` ← k0-consonant-contrast:ka / `카` / pending
- `audio/k0-consonant-contrast/kka.mp3` ← k0-consonant-contrast:kka / `까` / pending
- `audio/k0-consonant-contrast/da.mp3` ← k0-consonant-contrast:da / `다` / pending
- `audio/k0-consonant-contrast/ta.mp3` ← k0-consonant-contrast:ta / `타` / pending
- `audio/k0-consonant-contrast/tta.mp3` ← k0-consonant-contrast:tta / `따` / pending
- `audio/k0-consonant-contrast/ba.mp3` ← k0-consonant-contrast:ba / `바` / pending
- `audio/k0-consonant-contrast/pa.mp3` ← k0-consonant-contrast:pa / `파` / pending
- `audio/k0-consonant-contrast/ppa.mp3` ← k0-consonant-contrast:ppa / `빠` / pending
- `audio/k0-consonant-contrast/ja.mp3` ← k0-consonant-contrast:ja / `자` / pending
- `audio/k0-consonant-contrast/cha.mp3` ← k0-consonant-contrast:cha / `차` / pending
- `audio/k0-consonant-contrast/jja.mp3` ← k0-consonant-contrast:jja / `짜` / pending
- `audio/k0-consonant-contrast/sa.mp3` ← k0-consonant-contrast:sa / `사` / pending
- `audio/k0-consonant-contrast/ssa.mp3` ← k0-consonant-contrast:ssa / `싸` / pending
- `audio/lesson-06/wa.mp3` ← lesson-06:wa / `와` / pending
- `audio/lesson-06/wae.mp3` ← lesson-06:wae / `왜` / pending
- `audio/lesson-06/oe.mp3` ← lesson-06:oe / `외` / pending
- `audio/lesson-06/wo.mp3` ← lesson-06:wo / `워` / pending
- `audio/lesson-06/we.mp3` ← lesson-06:we / `웨` / pending
- `audio/lesson-06/wi.mp3` ← lesson-06:wi / `위` / pending
- `audio/lesson-06/ui.mp3` ← lesson-06:ui / `의` / pending
- `audio/lesson-06/yae.mp3` ← lesson-06:yae / `얘` / pending
- `audio/lesson-06/ye.mp3` ← lesson-06:ye / `예` / pending
- `audio/lesson-06/mwo.mp3` ← lesson-06:mwo / `뭐` / pending
- `audio/lesson-06/gwaja.mp3` ← lesson-06:gwaja / `과자` / pending
- `audio/lesson-06/yeou.mp3` ← lesson-06:yeou / `여우` / pending
- `audio/lesson-06/uija.mp3` ← lesson-06:uija / `의자` / pending

## 缓存与重复引用

- Service Worker未预缓存具体音频；首次网络成功后会写入运行时缓存。策略为network-first，离线时可能回退旧缓存。
- 文件名大小写冲突：未发现。
- 同一文件映射不同speechText：未发现。
- deprecated文件未被canonical catalog引用，保留为历史证据；本任务未删除。

## 语言审核分类

所有被活动catalog/manifest引用的物理文件还同时属于 `needs-native-review`。`valid-technical` 只说明可解码；不能替代发音、停顿、语速、音变或自然度审核。
